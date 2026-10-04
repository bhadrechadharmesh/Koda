import { FiFile, FiHome } from "react-icons/fi";
import { IoTerminal } from "react-icons/io5";
import { LuBot } from "react-icons/lu";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

function ActivityIcon({ icon: Icon, label, active, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center w-full my-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-14 z-50 bg-slate-900 dark:bg-[#1f202b] text-white px-2.5 py-1 rounded-md text-[11px] font-semibold shadow-xl border border-white/[0.08] pointer-events-none whitespace-nowrap"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        aria-label={label}
        className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
          active
            ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30"
            : "text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
        }`}
      >
        <Icon className="w-4 h-4" />
        {active && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-indigo-500 rounded-r" />
        )}
      </motion.button>
    </div>
  );
}

function ActivityBar({
  showExplorer,
  setShowExplorer,
  showAi,
  setShowAi,
  showTerminal,
  setShowTerminal,
}) {
  return (
    <nav className="w-12 sm:w-14 h-full bg-slate-50 dark:bg-[#090a10] border-r border-slate-200 dark:border-white/[0.08] flex flex-col justify-between py-2 shrink-0 select-none z-10">
      {/* Top Icons */}
      <div className="flex flex-col items-center w-full">
        <ActivityIcon
          icon={FiFile}
          label="Explorer"
          active={showExplorer}
          onClick={() => setShowExplorer(!showExplorer)}
        />
        <ActivityIcon
          icon={LuBot}
          label="AI Assistant"
          active={showAi}
          onClick={() => setShowAi(!showAi)}
        />
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col items-center w-full pt-2 border-t border-slate-200/60 dark:border-white/[0.06]">
        <ActivityIcon
          icon={IoTerminal}
          label="Terminal Panel"
          active={showTerminal}
          onClick={() => setShowTerminal(!showTerminal)}
        />
        <Link
          to="/"
          title="Dashboard"
          className="relative flex items-center justify-center w-full my-1"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors">
            <FiHome className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </nav>
  );
}

export default ActivityBar;