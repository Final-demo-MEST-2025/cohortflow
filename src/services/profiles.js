import axios from 'axios';
import { authService } from './auth';

const isDev = import.meta.env.MODE === "development";
const liveURL = import.meta.env.VITE_API_BASE_URL;

const baseURL = isDev ? "/api/v1" : `${liveURL}/api/v1`;

const client = axios.create({ baseURL });


class ProfileService {
  getAuthContext(auth = false) {
    return {
      user: authService.getAuthenticatedUser(),
      headers: authService.getJsonHeaders(auth),
      isAuthenticated: authService.isAuthenticated(),
    };
  }
  async fetchUserProfile() {
    const userRoles = ["admin", "instructor", "learner"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated && !userRoles.includes(user.role)) {
      console.warn("Not authorized to fetch profile.");
      return null;
    }

    try {
      const response = await client("/profile/me", {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUserProfile(credentials) {
    const userRoles = ["admin", "instructor", "learner"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated && !userRoles.includes(user.role)) {
      console.warn("Not authorized to fetch profile.");
      return null;
    }

    try {
      const response = await client("/profile/me", {
        method: "patch",
        headers: headers,
        data: credentials
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}

export const profileService = new ProfileService();