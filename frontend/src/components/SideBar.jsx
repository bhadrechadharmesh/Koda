import { motion } from "motion/react";
import { FiFolder, FiStar, FiZap } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { useSelector } from "react-redux";

function SideBar({ activeSession, setActiveSession }) {
  const { projects, starredProjects } = useSelector((state) => state.project);
  const starredCount =
    starredProjects && starredProjects.length > 0
      ? starredProjects.length
      : projects
      ? projects.filter((p) => p.starred).length
      : 0;
  const totalCount = projects ? projects.length : 0;

  const navItems = [
    {
      id: "projects",
      label: "All Projects",
      icon: FiFolder,
      count: totalCount,
    },
    {
      id: "starred",
      label: "Starred",
      icon: FiStar,
      count: starredCount,
    },
  ];

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col justify-between border-r border-slate-200/80 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#0b0c12]/60 px-3.5 py-6 font-sans backdrop-blur-xl transition-colors duration-300">
      <div className="flex flex-col gap-5">
        <div>
          <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Workspace
          </p>
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSession === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSession(item.id)}
                  className={`group relative flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white dark:bg-white/[0.08] text-indigo-600 dark:text-white shadow-sm shadow-slate-200/50 dark:shadow-none border border-slate-200/70 dark:border-white/10"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.count > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-colors ${
                        isActive
                          ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300"
                          : "bg-slate-200/60 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pro Upgrade Widget */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-200/50 dark:border-indigo-500/20 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-transparent p-4 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/30">
            <FiZap className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Koda Pro
            </p>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
              Unlimited AI Copilot
            </p>
          </div>
        </div>

        <p className="text-[12px] leading-relaxed text-slate-600 dark:text-slate-400 mb-3.5">
          Access high-speed cloud dev environments and advanced AI reasoning models.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-all duration-200 cursor-pointer"
        >
          <HiSparkles className="w-3.5 h-3.5" />
          <span>Upgrade to Pro</span>
        </motion.button>
      </div>
    </aside>
  );
}

export default SideBar;