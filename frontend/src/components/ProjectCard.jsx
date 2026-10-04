import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiStar, FiTrash2, FiExternalLink, FiClock, FiCode } from "react-icons/fi";
import { deleteProject, toggleStar } from "../features/project.js";
import { useDispatch } from "react-redux";
import { setDeleteProject, starProject } from "../redux/projectSlice.js";
import { useNavigate } from "react-router-dom";

function ProjectCard({ project }) {
  const [loadingStar, setLoadingStar] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (project?._id) {
      navigate(`/project/${project._id}`);
    }
  };

  const handleToggleStar = async (e) => {
    e.stopPropagation();
    setLoadingStar(true);
    dispatch(starProject(project?._id));
    await toggleStar(project?._id);
    setLoadingStar(false);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setLoadingDelete(true);
    await deleteProject(project?._id);
    dispatch(setDeleteProject(project?._id));
    setLoadingDelete(false);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  const promptDelete = (e) => {
    e.stopPropagation();
    setConfirmDelete(true);
  };

  // Generate deterministic gradient color from project name
  const getGradient = (name = "") => {
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-indigo-500 to-purple-600",
      "from-purple-500 to-pink-600",
      "from-emerald-500 to-teal-600",
      "from-amber-500 to-orange-600",
      "from-cyan-500 to-blue-600",
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return gradients[sum % gradients.length];
  };

  const formattedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "Recent";

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#111219]/90 p-5 shadow-sm hover:shadow-md hover:shadow-indigo-500/5 dark:hover:shadow-black/60 dark:hover:border-indigo-500/30 backdrop-blur-xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Top accent glow on hover */}
      <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 bg-indigo-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Card Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getGradient(
                project.name
              )} text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0`}
            >
              <FiCode className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {project.name}
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                <FiClock className="w-3 h-3" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Star Button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleToggleStar}
            disabled={loadingStar}
            aria-label="Star project"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors shrink-0"
          >
            <FiStar
              className={`w-4 h-4 transition-colors ${
                project.starred
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            />
          </motion.button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {project.description || "No description provided."}
        </p>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline">
          Open Workspace <FiExternalLink className="w-3 h-3" />
        </span>

        {/* Delete actions */}
        <div className="flex items-center">
          <AnimatePresence mode="wait">
            {!confirmDelete ? (
              <motion.button
                key="trash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileTap={{ scale: 0.9 }}
                onClick={promptDelete}
                aria-label="Delete project"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </motion.button>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/[0.08] px-2 py-1 rounded-lg"
              >
                <button
                  onClick={handleCancelDelete}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-1 py-0.5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loadingDelete}
                  className="text-[11px] font-bold text-red-600 hover:text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-500/20"
                >
                  {loadingDelete ? "..." : "Delete"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default ProjectCard;