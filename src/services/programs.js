import axios from "axios";
import { authService } from "./auth";

const isDev = import.meta.env.VITE_MODE === "development";
const liveURL = import.meta.env.VITE_API_BASE_URL;

const baseURL = isDev ? "/api/v1" : `${liveURL}/api/v1`;

const client = axios.create({ baseURL });

class ProgramService {
  getAuthContext(auth = false) {
    return {
      user: authService.getAuthenticatedUser(),
      headers: authService.getJsonHeaders(auth),
      isAuthenticated: authService.isAuthenticated(),
    };
  }

  async fetchPrograms() {
    const userRoles = ["admin", "instructor", "learner"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated && !userRoles.includes(user.role)) {
      console.warn("Not authorized to fetch programs.");
      return null;
    }

    try {
      const response = await client("/programs", {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async fetchCohorts() {
    const userRoles = ["admin", "instructor", "learner"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated && !userRoles.includes(user.role)) {
      console.warn("Not authorized to fetch cohorts.");
      return null;
    }

    try {
      const response = await client("/cohorts", {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createProgram(data) {
    const userRoles = ["admin"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated && !userRoles.includes(user.role)) {
      console.warn("Not authorized to fetch cohorts.");
      return null;
    }

    try {
      const response = await client("/programs", {
        headers: headers,
        data: data,
      });
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createCohort(data) {
    const userRoles = ["admin"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated && !userRoles.includes(user.role)) {
      console.warn("Not authorized to fetch cohorts.");
      return null;
    }

    try {
      const response = await client("/cohorts", {
        headers: headers,
        data: data,
      });
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updatePrograms(credentials) {
    const userRoles = ["admin", "instructor", "learner"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated && !userRoles.includes(user.role)) {
      console.warn("Not authorized to fetch profile.");
      return null;
    }

    try {
      const response = await client("/programs", {
        method: "patch",
        headers: headers,
        data: credentials,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}

export const programService = new ProgramService();
