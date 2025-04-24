import axios from "axios";
import { authService } from "./auth";

const isDev = import.meta.env.VITE_MODE === "development";
const liveURL = import.meta.env.VITE_API_BASE_URL;

const baseURL = isDev ? "/api/v1" : `${liveURL}/api/v1`;

const client = axios.create({ baseURL });

class AnnouncementService {
  getAuthContext(auth = false) {
    return {
      user: authService.getAuthenticatedUser(),
      headers: authService.getJsonHeaders(auth),
      isAuthenticated: authService.isAuthenticated(),
    };
  }

  async fetchAnnouncements(id) {
    const userRoles = ["admin", "instructor", "learner"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated || !userRoles.includes(user.role)) {
      console.warn("Not authorized to fetch programs.");
      return [];
    }

    try {
      let url = "/announcements";
      if (id) {
        url = `/announcements?classroomId=${id}`;
      }
      const response = await client(url, {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async fetchAnnouncementById(id) {
    const userRoles = ["admin", "instructor", "learner"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated || !userRoles.includes(user.role)) {
      console.warn("Not authorized to fetch classroom.");
      return {};
    }

    if (!id) return;

    try {
      const response = await client(`/announcements/${id}`, {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async mutateAnnouncement(formData) {
    const userRoles = ["admin", "instructor"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated || !userRoles.includes(user.role)) {
      console.warn("Not authorized to perform operation.");
      return {};
    }

    const { id, ...rest } = formData;
    let url = "/announcements";
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
  }

  async deleteAnnouncement(id) {
    const userRoles = ["admin", "instructor"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated || !userRoles.includes(user.role)) {
      console.warn("Not authorized to perform operation.");
      return ;
    }

    const response = await client(`/announcements/${id}`, {
      method: "DELETE",
      headers: headers,
    });
    return response.data;
  }

  async imageLoad(formData) {
    console.log(formData)
    const userRoles = ["admin", "instructor"];
    const { user, headers, isAuthenticated } = this.getAuthContext(true);
    if (!isAuthenticated || !userRoles.includes(user.role)) {
      console.warn("Not authorized to perform operation.");
      return ;
    }
    headers["Content-Type"] = "multipart/form-data";
    const response = await client("/announcements/upload-image", {
      method: "POST",
      headers: headers,
      data: formData
    });
    return response.data;
  }
}

export const announcementService = new AnnouncementService();
