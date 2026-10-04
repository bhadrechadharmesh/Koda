import { api } from "../utils/axios.js";

export const createProject = async (name, description) => {
  try {
    const { data } = await api.post("/api/project", { name, description });
    return data;
  } catch (err) {
    console.error("createProject error:", err);
    return null;
  }
};

export const getProjects = async () => {
  try {
    const { data } = await api.get("/api/project");
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("getProjects error:", err);
    return [];
  }
};

export const getProjectById = async (id) => {
  try {
    const { data } = await api.get(`/api/project/${id}`);
    return data;
  } catch (err) {
    console.error("getProjectById error:", err);
    return null;
  }
};

export const getStarredProjects = async () => {
  try {
    const { data } = await api.get("/api/project/starred");
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("getStarredProjects error:", err);
    return [];
  }
};

export const toggleStar = async (id) => {
  try {
    const { data } = await api.patch(`/api/project/${id}`);
    return data;
  } catch (err) {
    console.error("toggleStar error:", err);
    return null;
  }
};

export const deleteProject = async (id) => {
  try {
    const { data } = await api.delete(`/api/project/${id}`);
    return data;
  } catch (err) {
    console.error("deleteProject error:", err);
    return null;
  }
};
