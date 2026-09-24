import React, { useState } from 'react'
import {motion} from "motion/react"
import { FiStar, FiTrash2 } from 'react-icons/fi'
import { deleteProject, toggleStar } from '../features/project.js'
import { useDispatch } from 'react-redux'
import { setDeleteProject, starProject } from '../redux/projectSlice.js'
function ProjectCard({project}) {
    const [loadingStar , setLoadingStar] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    const dispatch = useDispatch()
    
    const handleToggleStar = async()=>{
        setLoadingStar(true)
        dispatch(starProject(project?._id))
        await toggleStar(project?._id)
        setLoadingStar(false)
    }

    const handleDelete = async()=>{
        setLoadingDelete(true) 
        await deleteProject(project?._id)
        dispatch(setDeleteProject(project?._id))
        setLoadingDelete(false)
    }


  return (
    <motion.div className="border border-slate-200 dark:border-white/10 bg-white/60 backdrop-blur-md rounded-lg p-4 shadow-sm dark:bg-white/10 dark:shadow-black/40 " 
    whileHover={{ y: -5 }}
    transition={{type:"spring",stiffness:300}}
    >  
        <div className='relative w-full' >
            <h1 className="text-slate-900 dark:text-white">{project.name}</h1>
            <p className="text-slate-500 dark:text-slate-400">{project.description || "No description"}</p>
        </div>

        <motion.div className="absolute top-4 right-4 " whileHover={{scale:1.3}} transition={{type:"spring",stiffness:300}} > 
            <button onClick={handleToggleStar} className='flex items-center gap-1' disabled={loadingStar} ><FiStar className='text-slate-900 dark:text-white'/> </button>
        </motion.div>

        <div className='absolute bottom-4 right-4' > <button onClick={()=>setConfirmDelete(true)} className='flex items-center gap-1' disabled={loadingDelete} >{ !confirmDelete ? (<FiTrash2 className='text-slate-900 dark:text-white'/>) : (<motion.div>
            <button className='text-red-500' onClick={()=>setConfirmDelete(false)} >Cancel</button> <button className='text-slate-900 dark:text-white' onClick={()=>handleDelete()}>Yes</button>
        </motion.div>)}</button> </div>
    </motion.div>


  )
}

export default ProjectCard