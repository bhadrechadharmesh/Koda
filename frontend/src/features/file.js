import { api } from "../utils/axios.js";

export const createRootFolder = async (nameOrObj, projectId) => {
  let name = nameOrObj;
  let pId = projectId;
  if (typeof nameOrObj === "object" && nameOrObj !== null) {
    name = nameOrObj.name;
    pId = nameOrObj.projectId;
  }
  try {
    const { data } = await api.post("/api/file/create-root-folder", {
      name,
      projectId: pId,
    });
    return data?.rootFolder || data;
  } catch (err) {
    console.error("createRootFolder error:", err);
    return null;
  }
};

export const createFolder = async (projectIdOrObj, name, parentId) => {
  let payload;
  if (typeof projectIdOrObj === "object" && projectIdOrObj !== null) {
    payload = projectIdOrObj;
  } else {
    payload = { projectId: projectIdOrObj, name, parentId };
  }
  try {
    const { data } = await api.post("/api/file/create-folder", payload);
    return data?.folder || data;
  } catch (err) {
    console.error("createFolder error:", err);
    return null;
  }
};

export const createFile = async (projectIdOrObj, name, parentId, content = "", language = "plaintext") => {
  let payload;
  if (typeof projectIdOrObj === "object" && projectIdOrObj !== null) {
    payload = projectIdOrObj;
  } else {
    payload = { projectId: projectIdOrObj, name, parentId, content, language };
  }
  try {
    const { data } = await api.post("/api/file/create-file", payload);
    return data?.file || data;
  } catch (err) {
    console.error("createFile error:", err);
    return null;
  }
};

export const updateFile = async (nameOrObj, content, id) => {
  let fileName, fileContent, fileId;
  if (typeof nameOrObj === "object" && nameOrObj !== null) {
    fileName = nameOrObj.name;
    fileContent = nameOrObj.content;
    fileId = nameOrObj.id || nameOrObj._id;
  } else {
    fileName = nameOrObj;
    fileContent = content;
    fileId = id;
  }
  try {
    const { data } = await api.post(`/api/file/update-file/${fileId}`, {
      name: fileName,
      content: fileContent,
    });
    return data?.file || data;
  } catch (err) {
    console.error("updateFile error:", err);
    return null;
  }
};

export const DeleteFile = async (idOrObj) => {
  const id = typeof idOrObj === "object" && idOrObj !== null ? (idOrObj.id || idOrObj._id) : idOrObj;
  try {
    const { data } = await api.delete(`/api/file/${id}`);
    return data?.file || data;
  } catch (err) {
    console.error("DeleteFile error:", err);
    return null;
  }
};

export const getFile = async (id) => {
  try {
    const { data } = await api.get(`/api/file/${id}`);
    return data?.file || data;
  } catch (err) {
    console.error("getFile error:", err);
    return null;
  }
};

export const getTree = async (projectId) => {
  try {
    const { data } = await api.get(`/api/file/tree/${projectId}`);
    if (Array.isArray(data)) return data;
    if (data?.tree && Array.isArray(data.tree)) return data.tree;
    return [];
  } catch (err) {
    console.error("getTree error:", err);
    return [];
  }
};
