import { useEffect, useState, useMemo } from "react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase.js";
import { login } from "../features/login.js";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
import NavBar from "../components/NavBar.jsx";
import SideBar from "../components/SideBar.jsx";
import { FiPlus, FiSearch, FiFolder, FiStar, FiZap, FiCode } from "react-icons/fi";
import { getProjects, getStarredProjects } from "../features/project.js";
import { setProjects, setStarredProjects } from "../redux/projectSlice.js";
import ProjectCard from "../components/ProjectCard.jsx";
import CreateProjectModel from "../components/CreateProjectModel.jsx";
import { motion } from "motion/react";

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [activeSession, setActiveSession] = useState("projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [openModel, setOpenModel] = useState(false);

  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { projects, starredProjects } = useSelector((state) => state.project);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const data = await signInWithPopup(auth, googleProvider);
      const token = await data.user.getIdToken();
      const d = await login(token);
      dispatch(setUserData(d));
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      setLoadingProjects(true);
      if (activeSession === "projects") {
        const data = await getProjects();
        if (isMounted && data) dispatch(setProjects(data));
      } else {
        const data = await getStarredProjects();
        if (isMounted && data) dispatch(setStarredProjects(data));
      }
      if (isMounted) setLoadingProjects(false);
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, [activeSession, dispatch]);

  // Filter projects by active tab and search
  const filteredProjects = useMemo(() => {
    const source =
      activeSession === "starred"
        ? starredProjects.length > 0
          ? starredProjects
          : (projects || []).filter((p) => p.starred)
        : projects || [];

    if (!searchQuery.trim()) return source;
    const q = searchQuery.toLowerCase();
    return source.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [projects, starredProjects, activeSession, searchQuery]);

  // Login view
  if (!userData) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-900 text-white selection:bg-indigo-500 selection:text-white px-4">
        {/* Ambient background glow orbs */}
        <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-blue-600/20 blur-[130px]" />

        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

        <div className="relative w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-3xl border border-white/[0.08] bg-[#0c0d14]/80 p-8 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-2xl text-center"
          >
            {/* Logo Badge */}
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30">
              <FiCode className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
              <FiZap className="w-3.5 h-3.5" /> Next-Gen AI Workspace
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
              Build Software Faster with <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">KODA AI</span>
            </h1>

            <p className="text-sm leading-relaxed text-slate-400 mb-8">
              Interactive cloud developer environments with intelligent AI pair-programming built in.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.12] bg-white/[0.08] hover:bg-white/[0.14] py-3 text-sm font-semibold text-white shadow-lg shadow-black/30 transition-all duration-200 cursor-pointer disabled:opacity-60"
            >
              <FcGoogle className="w-5 h-5" />
              <span>{loading ? "Authenticating..." : "Continue with Google"}</span>
            </motion.button>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-white/[0.06] text-[11px] text-slate-400">
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-slate-200">⚡ Instant</span>
                <span>Dev Sandboxes</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-slate-200">🤖 Smart</span>
                <span>AI Pair Agent</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-slate-200">☁️ Cloud</span>
                <span>Always Synced</span>
              </div>
            </div>

            <p className="mt-8 text-xs text-slate-500">
              By continuing, you agree to our{" "}
              <a href="#" className="text-indigo-400 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-400 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-slate-50 dark:bg-[#07070c] transition-colors duration-300">
      {/* Background ambient accents for dark mode */}
      <div className="pointer-events-none absolute -top-40 left-1/3 hidden h-[600px] w-[600px] rounded-full bg-indigo-500/[0.03] blur-[140px] dark:block" />
      <div className="pointer-events-none absolute top-1/3 right-0 hidden h-[500px] w-[500px] rounded-full bg-purple-500/[0.03] blur-[130px] dark:block" />

      {/* Navigation Bar */}
      <NavBar />

      {/* Main Workspace Body */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Sidebar */}
        <SideBar activeSession={activeSession} setActiveSession={setActiveSession} />

        {/* Content Area */}
        <main className="min-h-0 flex-1 overflow-y-auto px-6 lg:px-10 py-8 [scrollbar-width:thin] [scrollbar-color:rgba(100,116,139,0.25)_transparent]">
          <div className="max-w-6xl mx-auto space-y-7">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/70 dark:border-white/[0.06]">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Welcome back, {userData.name.split(" ")[0]} 👋
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Manage your cloud projects or create a new workspace.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setOpenModel(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all cursor-pointer self-start sm:self-auto"
              >
                <FiPlus className="w-4 h-4" />
                <span>New Project</span>
              </motion.button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects by name or description..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {filteredProjects.length}
                </span>{" "}
                {filteredProjects.length === 1 ? "project" : "projects"} found
              </div>
            </div>

            {/* Section Heading */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {activeSession === "starred" ? (
                <>
                  <FiStar className="text-amber-400" /> Starred Projects
                </>
              ) : (
                <>
                  <FiFolder className="text-indigo-400" /> Recent Projects
                </>
              )}
            </div>

            {/* Project Grid / States */}
            {loadingProjects ? (
              // Skeleton Loading State
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-44 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 animate-pulse flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/[0.06]" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-slate-200 dark:bg-white/[0.06] rounded w-2/3" />
                          <div className="h-3 bg-slate-200 dark:bg-white/[0.06] rounded w-1/3" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-white/[0.06] rounded w-full" />
                        <div className="h-3 bg-slate-200 dark:bg-white/[0.06] rounded w-4/5" />
                      </div>
                    </div>
                    <div className="h-4 bg-slate-200 dark:bg-white/[0.06] rounded w-1/4 mt-4" />
                  </div>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-white/[0.1] bg-white/40 dark:bg-white/[0.01] py-16 px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 border border-indigo-200/50 dark:border-indigo-500/20">
                  {activeSession === "starred" ? (
                    <FiStar className="w-6 h-6" />
                  ) : (
                    <FiFolder className="w-6 h-6" />
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                  {searchQuery
                    ? "No matching projects found"
                    : activeSession === "starred"
                    ? "No starred projects yet"
                    : "No projects in your workspace"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                  {searchQuery
                    ? `No projects matched "${searchQuery}". Try searching for something else.`
                    : activeSession === "starred"
                    ? "Star any project to quickly access it from this tab."
                    : "Create your first project to launch a high-speed AI cloud dev environment."}
                </p>
                {!searchQuery && activeSession !== "starred" && (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOpenModel(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Create Your First Project</span>
                  </motion.button>
                )}
              </div>
            ) : (
              // Projects Grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Project Modal */}
      {openModel && (
        <CreateProjectModel
          openModel={openModel}
          onClose={() => setOpenModel(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;

