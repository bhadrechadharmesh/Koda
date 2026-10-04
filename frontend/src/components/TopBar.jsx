import { useSelector } from "react-redux";
import {
  FiCode,
  FiEye,
  FiFolder,
  FiArrowLeft,
  FiColumns,
  FiMaximize,
  FiMinimize,
} from "react-icons/fi";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

function TopBar({
  showPreview,
  setShowPreview,
  isSplitView,
  setIsSplitView,
  isFullscreen,
  setIsFullscreen,
}) {
  const { currentProjects, currentProject } = useSelector(
    (state) => state.project
  );
  const activeProj = currentProject || currentProjects;

  return (
    <header className="w-full h-12 bg-white dark:bg-[#0c0d14] border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between px-3 shrink-0 select-none z-20">
      {/* Left: Brand & Back link */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          title="Back to Dashboard"
          className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-xs font-bold tracking-tight">KODA</span>
        </Link>

        <div className="h-4 w-px bg-slate-200 dark:bg-white/[0.08]" />

        {/* Project Breadcrumb */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-100/80 dark:bg-white/[0.04] text-xs font-medium text-slate-700 dark:text-slate-200">
          <FiFolder className="w-3.5 h-3.5 text-indigo-400" />
          <span className="truncate max-w-[160px] font-semibold">
            {activeProj?.name || "Workspace"}
          </span>
        </div>
      </div>

      {/* Center / Right: View Mode Segmented Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-100 dark:bg-white/[0.05] p-1 rounded-xl border border-slate-200/60 dark:border-white/[0.06]">
          <button
            onClick={() => {
              setShowPreview(false);
              if (setIsSplitView) setIsSplitView(false);
            }}
            title="Code Editor"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              !showPreview && !isSplitView
                ? "bg-white dark:bg-white/[0.1] text-indigo-600 dark:text-white shadow-sm font-semibold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <FiCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Code</span>
          </button>

          {setIsSplitView && (
            <button
              onClick={() => {
                setIsSplitView(true);
                setShowPreview(false);
              }}
              title="Split View (Code + Preview)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                isSplitView
                  ? "bg-white dark:bg-white/[0.1] text-indigo-600 dark:text-white shadow-sm font-semibold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <FiColumns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>
          )}

          <button
            onClick={() => {
              setShowPreview(true);
              if (setIsSplitView) setIsSplitView(false);
            }}
            title="Live Preview"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              showPreview && !isSplitView
                ? "bg-white dark:bg-white/[0.1] text-indigo-600 dark:text-white shadow-sm font-semibold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <FiEye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>

        {setIsFullscreen && (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            {isFullscreen ? (
              <FiMinimize className="w-4 h-4" />
            ) : (
              <FiMaximize className="w-4 h-4" />
            )}
          </motion.button>
        )}
      </div>
    </header>
  );
}

export default TopBar;