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
    if (!isAuthenticated || !userRoles.includes(user.role)) {
      console.warn("Not authorized to fetch programs.");
      return [];
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

  async fetchCohorts(id) {
    const userRoles = ["admin", "instructor", "learner"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated || !userRoles.includes(user.role)) {
      console.warn("Not authorized to fetch cohorts.");
      return [];
    }

    try {
      let url = "/cohorts"
      if (id) {
        url = `/cohorts?programId=${id}`;
      }
      
      const response = await client(url, {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async fetchCohortInstructors(cohortId) {
    const userRoles = ["admin", "instructor", "learner"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated || !userRoles.includes(user.role)) {
      console.warn("Not authorized to fetch cohorts.");
      return [];
    }

    const response = await client(`/cohorts/${cohortId}/instructors`, {
      headers: headers,
    });
    return response.data;
  }


  async fetchCohortLearners(cohortId) {
    const userRoles = ["admin", "instructor", "learner"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated || !userRoles.includes(user.role)) {
      console.warn("Not authorized to fetch cohorts.");
      return [];
    }

    const response = await client(`/cohorts/${cohortId}/learners`, {
      headers: headers,
    });
    return response.data;
  }


  async mutateProgram(formData) {
    const userRoles = ["admin"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated || !userRoles.includes(user.role)) {
      console.warn("Not authorized to perform operation.");
      return {};
    }

    try {
      const { id, ...rest } = formData;
      let url = "/programs";
      let method = "POST";
      if (id) {
        url = `${url}/${id}`;
        method = "PATCH";
      }
      console.log(url);
      const response = await client(url, {
        method: method,
        headers: headers,
        data: rest,
      });
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async mutateCohort(formData) {
    const userRoles = ["admin"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated || !userRoles.includes(user.role)) {
      console.warn("Not authorized to perform operation.");
      return {};
    }

    try {
      const { id, ...rest } = formData;
      let url = "/cohorts";
      let method = "POST";
      if (id) {
        url = `${url}/${id}`;
        method = "PATCH";
      }
      const response = await client(url, {
        method: method,
        headers: headers,
        data: rest,
      });
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export const programService = new ProgramService();
