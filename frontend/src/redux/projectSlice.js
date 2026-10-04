import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
    starredProjects: [],
    currentProject: null,
    currentProjects: null, // Aliased for backward compatibility
  },
  reducers: {
    setProjects: (state, action) => {
      state.projects = Array.isArray(action.payload) ? action.payload : [];
    },
    setStarredProjects: (state, action) => {
      state.starredProjects = Array.isArray(action.payload) ? action.payload : [];
    },
    addNewProject: (state, action) => {
      if (!Array.isArray(state.projects)) state.projects = [];
      if (action.payload) {
        state.projects.unshift(action.payload);
      }
    },
    starProject: (state, action) => {
      const id = action.payload;
      if (Array.isArray(state.projects)) {
        const item = state.projects.find((p) => p._id === id);
        if (item) {
          item.starred = !item.starred;
        }
      }
      if (Array.isArray(state.starredProjects)) {
        const idx = state.starredProjects.findIndex((p) => p._id === id);
        if (idx !== -1) {
          state.starredProjects.splice(idx, 1);
        } else {
          const item = state.projects?.find((p) => p._id === id);
          if (item) state.starredProjects.push(item);
        }
      }
      if (state.currentProjects && state.currentProjects._id === id) {
        state.currentProjects.starred = !state.currentProjects.starred;
      }
      if (state.currentProject && state.currentProject._id === id) {
        state.currentProject.starred = !state.currentProject.starred;
      }
    },
    setDeleteProject: (state, action) => {
      const id = action.payload;
      if (Array.isArray(state.projects)) {
        state.projects = state.projects.filter((p) => p._id !== id);
      }
      if (Array.isArray(state.starredProjects)) {
        state.starredProjects = state.starredProjects.filter((p) => p._id !== id);
      }
      if (state.currentProjects?._id === id) {
        state.currentProjects = null;
      }
      if (state.currentProject?._id === id) {
        state.currentProject = null;
      }
    },
    setCurrentProjects: (state, action) => {
      state.currentProjects = action.payload;
      state.currentProject = action.payload;
    },
    setCurrentProject: (state, action) => {
      state.currentProjects = action.payload;
      state.currentProject = action.payload;
    },
  },
});

export const {
  setProjects,
  setStarredProjects,
  addNewProject,
  starProject,
  setDeleteProject,
  setCurrentProjects,
  setCurrentProject,
} = projectSlice.actions;

export default projectSlice.reducer;