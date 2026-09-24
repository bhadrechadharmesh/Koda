import { useEffect, useState } from "react"
import { FiChevronDown, FiLogOut, FiMoon, FiSun, FiUser  } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/logout.js";
import { setUserData } from "../redux/userSlice.js";

function NavBar() {

    const [isDark , setIsDark] = useState(true);

    const [menuOpen , setMenuOpen] = useState(false);

    const dispatch  = useDispatch()

    const {userData } = useSelector((state)=>state.user);
    const initials = userData.name.trim().split(" ").map(n=>n[0]).join("").toUpperCase();
    
    useEffect(()=>{
        if(typeof(window) == undefined) return ;

        const theme = localStorage.getItem('theme')
        
        const dark = theme ?theme=="dark" :true;
        
        document.documentElement.classList.toggle("dark",dark);

        setIsDark(dark);
    },[])

    const toggleTheme = () =>{
        const next = !isDark;

        document.documentElement.classList.toggle("dark",next);
        localStorage.setItem("theme",next?"dark":"light");
        setIsDark(next)
    }

    const handleLogout = async() => {
        await logout()
        dispatch(setUserData(null));
    }

    return (
        <div className="w-full h-16 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.07] flex items-center px-6 gap-6 font-sans transition-colors duration-300 z-50">
            <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white text-[17px]">KODA AI</span>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-2 shrink=0">
                <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors duration-150 " >
                  { isDark ? <FiSun/> : <FiMoon/> } 
                 </button>

                <div className="relative ml-1" >
                    <button onClick={()=>setMenuOpen(!menuOpen)} className=" flex items-center gap-2 pl-1.5 pr-2 h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors duration-150 ">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-slate-800 dark:bg-white text-white dark:text-black flex items-center justify-center text-sm font-medium">
                                {initials}
                            </span>
                        </div>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">{userData.name}</span>
                            <FiChevronDown className={`text-slate-400 dark:text-slate-500 transition-transform duration-250 ${menuOpen ? "rotate-180" : ""}` } />
                    </button>
                    {
                        menuOpen &&
                        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-[#17171e] border border-slate-200 dark:border-white/[0.06] shadow-lg shadow-slate-200/50 dark:shadow-black/40 overflow-hidden">
                        <div className="px-2 py-1.5">
                            <div className="w-full px-2 flex items-center gap-2 rounded-lg py-2 text-sm font-medium text-slate-600 dark:text-slate-300 dark:hover:bg-white/[0.06] transition-colors ">
                                <span className="text-sm text-slate-600 dark:text-slate-300" > <FiUser/></span>
                                <span className="text-sm text-slate-600 dark:text-slate-300" >{userData.name}</span>
                            </div>
                            <div className="w-full px-2 flex items-center gap-2 rounded-lg py-2 text-sm font-medium text-slate-600 dark:text-slate-300 dark:hover:bg-white/[0.06] transition-colors ">
                                <span className="text-sm text-slate-600 dark:text-slate-300" > <FiUser/></span>
                                <span className="text-sm text-slate-600 dark:text-slate-300" >{userData.email}</span>
                            </div>
                            <button onClick={handleLogout} className="w-full px-2 flex items-center gap-2 rounded-lg py-2 text-sm font-medium text-slate-600 hover:bg-red-50 dark:text-slate-300 dark:hover:bg-white/[0.06] transition-colors ">
                                <span className="text-sm text-red-500 dark:text-red-400" > <FiLogOut/></span>
                                <span className="text-sm text-red-500 dark:text-red-400" >Logout</span>
                            </button>
                        </div>
                        </div>
                    }

                </div>

            </div>
        </div>
    )
}

export default NavBar