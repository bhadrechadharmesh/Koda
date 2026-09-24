import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
    name : "project",
    initialState :{
        projects : [],
        starredProjects:[]
    },
    reducers:{
        setProjects:(state,action)=>{
            state.projects = action.payload
        },
        addNewProject:(state,action)=>{
            state.projects.unshift(action.payload)
        },
        starProject:(state,action)=>{
            const id = state.projects.find(p=>p._id==action.payload)
            if(id){
                id.starred = !id.starred
            }
        },
        setDeleteProject:(state,action)=>{
            state.projects = state.projects.filter(p=>p._id!=action.payload)
        }
    }
})

export const {setProjects,addNewProject,starProject,setDeleteProject} = projectSlice.actions
export default projectSlice.reducer