import {motion} from "motion/react"
import { FiFolder, FiStar, FiZap } from 'react-icons/fi';
function SideBar({activeSession,setActiveSession}) {

    const isActive = activeSession=="projects"?"projects":"starred";

  return (
    <div className='flex h-full w-64 shrink-0 flex-col border-r border-slate-200/70 bg-white/60 px-3 py-5 font-sans backdrop-blur-xl transition-colors duration-300 dark:border-white/[0.06] dark:bg-white/[0.02] '> 
        <div className='flex flex-col gap-1'>
            <motion.div whileTap={{scale:0.97}} onClick={()=>setActiveSession("projects")} className={`${isActive=="projects"?"bg-slate-100/70 dark:bg-white/[0.05] ":""} flex items-center gap-2 px-2 py-2 rounded-lg`}>
                {activeSession=="projects" &&(
                    <div className='absolute h-8 w-1 bg-slate-500 right-0 rounded-r-full' />
                )}
                <FiFolder className='relative text-slate-800 dark:text-white'/> 
                <span className="text-sm font-semibold text-slate-800 dark:text-white">Projects</span>
            </motion.div>

            <motion.div whileTap={{scale:0.97}} onClick={()=>setActiveSession("starred")} className={`${isActive=="starred"?"bg-slate-100/70 dark:bg-white/[0.05] ":""} flex items-center gap-2 px-2 py-2 rounded-lg  `}>
                            {activeSession=="starred" &&(
                    <div className='absolute h-8 w-1 bg-slate-500 right-0 rounded-r-full' />
                )}
                <FiStar className='relative text-slate-800 dark:text-white'/>
                <span className="text-sm font-semibold text-slate-800 dark:text-white">Starred</span>
            </motion.div>

        </div>
            <div className="my-4 h-px bg-slate-200/70 dark:bg-white/[0.06]" />
            
        <div className=" rounded-xl border border-slate-200/70 bg-white/70 p-3.5 shadow-sm backdrop-blur-xl dark:border-white/[0.07] dark:bg-white/[0.03] dark:shadow-none ">
                <p className="mb-1 text-[12.5px] font-medium text-slate-700 dark:text-slate-300" > Upgrade Plan </p>
                <p className=" mb-3 leading-snug text-[12.5px] text-slate-500 dark:text-slate-400">Upgrade to Pro to access advanced features and unlock your full potential.</p>
                <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} className="flex items-center gap-2 justify-center w-full rounded-lg bg-slate-900 py-2 text-[12.5px] font-semibold text-white transition-opacity duration-150 dark:bg-white dark:text-slate-900 "> <FiZap/> Upgrade Now</motion.button>
        </div>

    </div>
  )
}

export default SideBar