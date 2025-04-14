import axios from "axios";

const isDev = import.meta.env.MODE === "development";
const liveURL = import.meta.env.VITE_API_BASE_URL;

const baseURL = isDev ? "/api/v1" : `${liveURL}/api/v1`;

const client = axios.create({ baseURL });

class AuthError extends Error {
  constructor(type) {
    super(type);
    this.name = 'AuthError';
  }
}

class AuthService {
  static REFRESH_TOKEN_EXPIRY_DAYS = 7;
  isRefreshing = false;
  token;
  refreshToken;
  user;
  tokenExpiry;
  refreshExpiry
  deviceId;

  constructor() {
    this.loadTokens();
    this.setupTokenRefresh();
    this.deviceId = this.generateDeviceId();
  }

  generateDeviceId() {
    // Create a persistent device identifier
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = `device-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
  }

  loadTokens() {
    this.token = localStorage.getItem("accessToken");
    this.refreshToken = localStorage.getItem("refreshToken");
    const expiry = localStorage.getItem("tokenExpiry");
    this.tokenExpiry = expiry ? parseInt(expiry) : null;
    this.refreshExpiry = parseInt(
      localStorage.getItem('refreshTokenExpiry')
    ) || null;
    this.user = JSON.parse(localStorage.getItem('user'));
  }
  

  saveTokens(response) {
    this.token = response.accessToken;
    this.refreshToken = response.refreshToken;
    this.tokenExpiry = Date.now() + response.expiresIn * 1000;
    this.user = JSON.stringify(response.user);
    // Calculate expiration (7 days from initial login)
    const refreshTokenExpiry = Date.now() + AuthService.REFRESH_TOKEN_EXPIRY_DAYS * 86400000;
    this.refreshExpiry = refreshTokenExpiry;

    localStorage.setItem("refreshTokenExpiry", refreshTokenExpiry.toString());
    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem("tokenExpiry", this.tokenExpiry.toString());
    localStorage.setItem("user", JSON.stringify(response.user));
  }

  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    this.user = null;
    this.REFRESH_TOKEN_EXPIRY_DAYS = null;

    localStorage.removeItem("refreshTokenExpiry");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("user");
  }

  async checkTokenExpiry() {
    console.log('is refreshing...', this.isRefreshing || !this.token ? "false" : "true");
    if (
      this.isRefreshing ||
      !this.token ||
      !this.refreshToken ||
      !this.tokenExpiry
    ) return;

    // If token is still valid (with 1 minute buffer), do nothing
    if (Date.now() < this.tokenExpiry - 60000) return;


    // if refresh token has expired, force logout UI update
    const refreshExpiry = localStorage.getItem("refreshTokenExpiry");
    if (refreshExpiry && Date.now() > parseInt(refreshExpiry) - 60000) {
      console.log('refresh token expired');
      await this.logout(true);
      return;
    }

    console.log('About to refresh...')
    
    this.isRefreshing = true;

    try {
      const refreshed = await this.refreshAuthToken();
      console.log(refreshed)
      if (!refreshed) {
        throw new AuthError("SessionExpired");
      }
    } catch (error) {
      console.log('Auto-refresh failed', error);
      await this.logout(true);
    } finally {
      this.isRefreshing = false;
    }
  }

  async getCurrentDeviceTokens() {
    await this.checkTokenExpiry();
    return {
      accessToken: this.token,
      refreshToken: this.refreshToken,
    };
  }

  async refreshAuthToken() {
    const storedExpiry = localStorage.getItem("refreshTokenExpiry");
    const expiryDate = storedExpiry ? parseInt(storedExpiry) : null

    if (!this.refreshToken || !expiryDate) return false;

    // Automatic logout if expired
    if (Date.now() > expiryDate) {
      console.log('refreshToken expired')

      await this.logout(true);
      return false;
    }

    try {
      console.log('Refreshing access token...');

      const response = await client("/users/refresh-token", {
        method: "POST",
        headers: this.getJsonHeaders(true),
        data: {
          refreshToken: this.refreshToken,
          deviceId: this.deviceId,
        },
      });

      if (response.status === 200) {
        this.saveTokens(response.data);
        console.log('Token refreshed successfully');
        return true;
      }
    } catch (error) {
      console.error("Error refreshing auth token:", error);
    }

    await this.logout(true);
    return false;
  }

  setupTokenRefresh() {
    setInterval(() => {
      this.checkTokenExpiry();
    }, 30000);
  }

  async login(credentials) {
    const response = await client("/users/login", {
      method: "POST",
      headers: this.getJsonHeaders(),
      data: {
        ...credentials,
        deviceInfo: {
          deviceId: this.deviceId,
          userAgent: navigator.userAgent,
        },
      },
    });
    // if (response.status !== 200) {
    //   console.log(error);
    //   const error = response.data;
    //   throw new AuthError(error.message || "LoginFailed");
    // }
    this.saveTokens(response.data);
    return true;
  }

  async logout(forceReload=false) {
    try {
      const { refreshToken } = await this.getCurrentDeviceTokens();
      if (refreshToken) {
        await client("/users/logout", {
          method: "POST",
          headers: this.getJsonHeaders(true),
          data: {
            refreshToken,
            deviceId: this.deviceId
          }
        });
      }
    } finally {
      this.clearTokens();
      localStorage.removeItem("deviceId");

      if (forceReload) {
        window.location.reload();
      } else {
        window.dispatchEvent(new CustomEvent('auth-change', {
          detail: { isLoggedIn: false }
        }));
      }
    }
  }

  async forgotPassword(email) {
    const response = await client("/users/forgot-password", {
      method: "PATCH",
      headers: {
        "Content-Type": this.getJsonHeaders(),
      },
      data: { email },
    });

    if (response.status !== 200) {
      const error = await response.json();
      throw new AuthError(error.error || "ResetPasswordFailed");
    }
    return response.data;
  }

  async resetPassword(credentials) {
    const response = await client("/users/reset-password", {
      method: "PATCH",
      headers: {
        "Content-Type": this.getJsonHeaders(),
      },
      data: credentials,
    });

    if (response.status !== 200) {
      const error = await response.json();
      throw new AuthError(error.error || "ResetPasswordFailed");
    }

    return response.data;
  }

  async changePassword(credentials) {
    const response = await client("/users/change-password", {
      method: "PATCH",
      headers: this.getJsonHeaders(true),
      data: credentials,
    });

    if (response.status !== 200) {
      const error = await response.json();
      throw new AuthError(error.error || "ChangePasswordFailed");
    }

    return response.data;
  }

  getAuthenticatedUser() {
    if (!this.token || !this.tokenExpiry) return {};
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user.id) return {};

    return user;
  }

  isAuthenticated() {
    if (!this.token || !this.tokenExpiry) return false;
    return Date.now() < this.tokenExpiry;
  }

  getJsonHeaders(auth = false) {
    const headers = { "Content-Type": "application/json" };

    // Check if token is missing or expired
    if (!this.token || (this.tokenExpiry && Date.now() >= this.tokenExpiry)) {
      // Fire-and-forget async refresh (non-blocking, fire and forget)
      this.checkTokenExpiry().catch(console.error);

      // If auth was requested but token is invalid, don't attach token
      return headers;
    }

    // Token is valid and auth is required — attach it
    if (auth) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }
}

export const authService = new AuthService();