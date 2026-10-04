import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiLoader, FiX, FiFolderPlus, FiLayers, FiCode, FiTerminal } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addNewProject } from "../redux/projectSlice.js";
import { createProject } from "../features/project.js";
import { createRootFolder } from "../features/file.js";

const TEMPLATES = [
  {
    name: "React + Vite",
    desc: "Fast, modern React app powered by Vite and Tailwind",
    icon: FiCode,
  },
  {
    name: "Node.js API",
    desc: "RESTful microservice with Express and MongoDB",
    icon: FiTerminal,
  },
  {
    name: "Fullstack App",
    desc: "Complete frontend and backend connected environment",
    icon: FiLayers,
  },
];

function CreateProjectModel({  onClose }) {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const selectTemplate = (template) => {
    setName((prev) => (prev ? prev : template.name.toLowerCase().replace(/[^a-z0-9]/g, "-")));
    setDescription(template.desc);
    setError("");
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!name.trim()) {
      setError("Please enter a project name");
      return;
    }

    setLoading(true);
    setError("");
    const data = await createProject(name.trim(), description.trim());
    if(data){
      await createRootFolder(data.name,data._id.toString());
      dispatch(addNewProject(data));
      setName("");
      setDescription("");
      onClose();
    } else {
      setError("Failed to create project. Please try again.");
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg rounded-2xl border border-slate-200/80 dark:border-white/[0.09] bg-white dark:bg-[#12131b] shadow-2xl shadow-slate-900/20 dark:shadow-black/70 overflow-hidden z-10"
        >
          {/* Top ambient highlight */}
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/50 dark:border-indigo-500/20">
                  <FiFolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Create New Project
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Spin up a new cloud workspace in seconds
                  </p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                aria-label="Close modal"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
              >
                <FiX className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Quick Templates */}
            <div className="mb-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Quick Starters
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TEMPLATES.map((tmpl) => {
                  const Icon = tmpl.icon;
                  return (
                    <button
                      key={tmpl.name}
                      type="button"
                      onClick={() => selectTemplate(tmpl)}
                      className="flex flex-col items-center p-2.5 rounded-xl border border-slate-200/70 dark:border-white/[0.06] bg-slate-50/60 dark:bg-white/[0.02] hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-500/30 text-center transition-all group cursor-pointer"
                    >
                      <Icon className="w-4 h-4 mb-1 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                      <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-white truncate w-full">
                        {tmpl.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="e.g. awesome-saas-app"
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-white/[0.04] text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What are you building?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-white/[0.04] text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 dark:text-red-400 font-medium">
                  {error}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <FiLoader className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Project</span>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default CreateProjectModel;

