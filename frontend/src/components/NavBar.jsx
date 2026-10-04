import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiCode, FiLogOut, FiMoon, FiSun,  FiShield } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/logout.js";
import { setUserData } from "../redux/userSlice.js";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

function NavBar() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const theme = localStorage.getItem("theme");
    return theme ? theme === "dark" : true;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  
  const initials = userData?.name
    ? userData.name.trim().split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    dispatch(setUserData(null));
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-slate-200/80 dark:border-white/[0.08] bg-white/75 dark:bg-[#090a10]/80 backdrop-blur-xl transition-colors duration-300">
      <div className="flex items-center justify-between h-full px-6 max-w-7xl mx-auto w-full">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/35 transition-all duration-300">
            <FiCode className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              KODA
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/20 tracking-wider">
              AI
            </span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-slate-200/60 dark:border-white/[0.06] transition-colors"
          >
            {isDark ? (
              <FiSun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <FiMoon className="w-4 h-4 text-slate-600 transition-transform hover:-rotate-12" />
            )}
          </motion.button>

          {/* User Profile */}
          {userData && (
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-xl border transition-all duration-200 ${
                  menuOpen
                    ? "bg-slate-100 dark:bg-white/[0.08] border-slate-300 dark:border-white/20"
                    : "border-slate-200/80 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/[0.05]"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-semibold shadow-sm">
                  {initials}
                </div>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 max-w-[130px] truncate">
                  {userData.name}
                </span>
                <FiChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-400 transition-transform duration-200 ${
                    menuOpen ? "rotate-180 text-indigo-500" : ""
                  }`}
                />
              </motion.button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-[#12131a] border border-slate-200 dark:border-white/[0.08] shadow-xl shadow-slate-300/40 dark:shadow-black/60 overflow-hidden py-1.5 z-50 backdrop-blur-xl"
                  >
                    {/* User info card */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-white/[0.06]">
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Signed in as
                      </p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate mt-0.5">
                        {userData.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {userData.email}
                      </p>
                    </div>

                    <div className="p-1.5 space-y-0.5">
                      <div className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                        <FiShield className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Plan: Free Developer</span>
                      </div>

                      <div className="my-1 border-t border-slate-100 dark:border-white/[0.06]" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <FiLogOut className="w-3.5 h-3.5" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavBar;