import React, { useState } from "react";
import { motion } from "motion/react";
import { FiLoader, FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addNewProject } from "../redux/projectSlice.js";
import { createProject } from "../features/project.js";
function CreateProjectModel({ openModel, onClose }) {

  const [name,setName] = useState("")
  const [description,setDescription] = useState("")
  const [loading,setLoading] = useState(false)

  const dispatch = useDispatch()

  const handleSubmit = async()=>{
    setLoading(true)
    const data = await createProject(name,description)
    if(data){
      dispatch(addNewProject(data))
    }
    onClose()
    setLoading(false)
    setName("")
    setDescription("")
  } 

  return (
    <div className="fixed   inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/10 backdrop-blur-[2px] ">
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/60"
      />

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        className=" relative w-full max-w-2xl"
      >
        <div className="rounded-2xl bg-white p-4 dark:bg-[#141419]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Create Project
              </h2>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                Set up a new workspace in seconds
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              {" "}
              <FiX className="text-lg" />{" "}
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="" className="text-slate-700 dark:text-slate-300">Project Name</label>
              <input
                className="px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 "
                type="text"
                name=""
                placeholder="my-first-pro"
                id=""

                onChange={(e)=>setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="" className="text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                className="px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 "
                type="text"
                name=""
                placeholder="A web app for..."
                id=""

                onChange={(e)=>setDescription(e.target.value)}
              />
            </div>

            <div className="flex w-full justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md cursor-pointer text-white dark:text-slate-900 bg-slate-900 text-white dark:bg-white dark:text-slate-900 "
              >
                Cancel
              </button>
              <button onClick={handleSubmit}  className="px-4 py-2 rounded-md cursor-pointer bg-slate-900 text-white dark:bg-white dark:text-slate-900 ">
                {loading ?( <FiLoader/> ) : "Create Project"}
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

export default CreateProjectModel;
