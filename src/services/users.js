import axios from 'axios';
import { authService } from './auth';

const isDev = import.meta.env.VITE_MODE === "development";
const liveURL = import.meta.env.VITE_API_BASE_URL;

const baseURL = isDev ? "/api/v1" : `${liveURL}/api/v1`;

const client = axios.create({ baseURL });


class UserService {
  getAuthContext(auth = false) {
    return {
      user: authService.getAuthenticatedUser(),
      headers: authService.getJsonHeaders(auth),
      isAuthenticated: authService.isAuthenticated(),
    };
  }

  async fetchUserData() {
    const { user, headers, isAuthenticated } = this.getAuthContext(true);

    if (!isAuthenticated && user?.role !== "admin") {
      console.warn("Not authorized to fetch user data.");
      return null;
    }

    try {
      const response = await client("/users", {
        method: "GET",
        headers,
      });

      if (response.status !== 200) {
        console.error("Failed to fetch user data.");
        return null;
      }

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchUserCount() {
    const { user, headers, isAuthenticated } = this.getAuthContext(true);

    if (!isAuthenticated && user?.role !== "admin") {
      console.warn("Not authorized to fetch user count.");
      return null;
    }

    try {
      const response = await client("/users/count", {
        method: "GET",
        headers,
      });

      if (response.status !== 200) {
        console.error("Failed to fetch user count.");
        return null;
      }

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchUser() {
    const userRoles = ["admin", "instructor", "learner"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated && !userRoles.includes(user.role)) {
      console.warn("Not authorized to fetch profile.");
      return null;
    }

    try {
      const response = await client("/users/me", {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async registerUser(credentials) {
    console.log(credentials);
    const { user, headers, isAuthenticated } = this.getAuthContext(true);

    if (!isAuthenticated && user?.role !== "admin") {
      console.warn("Not authorized to fetch user count.");
      return;
    }
    try {
      const response = await client("/users/register", {
        method: "POST",
        headers,
        data: credentials,
      });

      if (response.status !== 201) {
        console.error("Failed to fetch user count.");
        return null;
      }

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export const userService = new UserService();