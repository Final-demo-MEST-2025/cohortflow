import axios from "axios";
import { authService } from "./auth";

const isDev = import.meta.env.VITE_MODE === "development";
const liveURL = import.meta.env.VITE_API_BASE_URL;

const baseURL = isDev ? "/api/v1" : `${liveURL}/api/v1`;

const client = axios.create({ baseURL });

class ClassroomService {
  getAuthContext(auth = false) {
    return {
      user: authService.getAuthenticatedUser(),
      headers: authService.getJsonHeaders(auth),
      isAuthenticated: authService.isAuthenticated(),
    };
  }

  async fetchMyClassrooms() {
    const userRoles = ["admin", "instructor", "learner"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated || !userRoles.includes(user.role)) {
      console.warn("Not authorized to fetch programs.");
      return [];
    }

    try {
      const response = await client("/classrooms", {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async fetchClassroomById(id) {
    const userRoles = ["admin","instructor", "learner"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated || !userRoles.includes(user.role)) {
      console.warn("Not authorized to fetch classroom.");
      return {};
    }

    if (!id) return null;


    try {
      const response = await client(`/classrooms/${id}`, {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async mutateClassroom(formData) {
    const userRoles = ["admin"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated || !userRoles.includes(user.role)) {
      console.warn("Not authorized to perform operation.");
      return {};
    }

    try {
      const { id, ...rest } = formData;
      let url = "/classrooms";
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
}

export const classroomService = new ClassroomService();
