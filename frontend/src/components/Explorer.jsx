import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiRefreshCw,
  FiFilePlus,
  FiFolderPlus,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { LuFolderTree } from "react-icons/lu";
import Folder from "./Folder";
import { createFile, createFolder } from "../features/file";

function Explorer({
  projectId,
  tree,
  reloadTree,
  openFile,
  activeTab,
  onClose,
}) {
  const [isCreatingRootFile, setIsCreatingRootFile] = useState(false);
  const [isCreatingRootFolder, setIsCreatingRootFolder] = useState(false);
  const [rootFileName, setRootFileName] = useState("");
  const [rootFolderName, setRootFolderName] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const safeTree = Array.isArray(tree)
    ? tree
    : tree?.tree && Array.isArray(tree.tree)
    ? tree.tree
    : [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await reloadTree();
    setTimeout(() => setRefreshing(false), 400);
  };

  const handleCreateRootFile = async () => {
    if (!rootFileName.trim()) return;
    const rootFolder = safeTree.find((item) => item.type === "folder");
    const parentId = rootFolder ? rootFolder._id : null;
    const lang = rootFileName.includes(".")
      ? rootFileName.split(".").pop()
      : "plaintext";

    await createFile(projectId, rootFileName.trim(), parentId, "", lang);
    setRootFileName("");
    setIsCreatingRootFile(false);
    reloadTree();
  };

  const handleCreateRootFolder = async () => {
    if (!rootFolderName.trim()) return;
    const rootFolder = safeTree.find((item) => item.type === "folder");
    const parentId = rootFolder ? rootFolder._id : null;

    await createFolder(projectId, rootFolderName.trim(), parentId);
    setRootFolderName("");
    setIsCreatingRootFolder(false);
    reloadTree();
  };

  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 260, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-full shrink-0 flex flex-col bg-white dark:bg-[#0c0d14] border-r border-slate-200 dark:border-white/[0.08] select-none overflow-hidden"
    >
      {/* Explorer Header */}
      <div className="flex items-center justify-between h-10 px-3.5 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Explorer
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setIsCreatingRootFile(true);
              setIsCreatingRootFolder(false);
            }}
            title="New File"
            className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
          >
            <FiFilePlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setIsCreatingRootFolder(true);
              setIsCreatingRootFile(false);
            }}
            title="New Folder"
            className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
          >
            <FiFolderPlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRefresh}
            title="Refresh Files"
            className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
          >
            <FiRefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              title="Close Explorer"
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.08] md:hidden transition-colors"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Root creation inputs */}
      <AnimatePresence>
        {isCreatingRootFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 p-2 bg-indigo-50/50 dark:bg-indigo-500/10 border-b border-indigo-200 dark:border-indigo-500/20"
          >
            <input
              type="text"
              value={rootFileName}
              onChange={(e) => setRootFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateRootFile();
                if (e.key === "Escape") {
                  setIsCreatingRootFile(false);
                  setRootFileName("");
                }
              }}
              placeholder="e.g. index.html"
              autoFocus
              className="flex-1 px-2 py-1 text-xs rounded bg-white dark:bg-black/40 border border-indigo-300 dark:border-indigo-500/30 text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              onClick={handleCreateRootFile}
              className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded"
            >
              <FiCheck className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setIsCreatingRootFile(false);
                setRootFileName("");
              }}
              className="p-1 text-slate-400 hover:bg-slate-500/10 rounded"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {isCreatingRootFolder && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 p-2 bg-indigo-50/50 dark:bg-indigo-500/10 border-b border-indigo-200 dark:border-indigo-500/20"
          >
            <input
              type="text"
              value={rootFolderName}
              onChange={(e) => setRootFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateRootFolder();
                if (e.key === "Escape") {
                  setIsCreatingRootFolder(false);
                  setRootFolderName("");
                }
              }}
              placeholder="e.g. src"
              autoFocus
              className="flex-1 px-2 py-1 text-xs rounded bg-white dark:bg-black/40 border border-indigo-300 dark:border-indigo-500/30 text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              onClick={handleCreateRootFolder}
              className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded"
            >
              <FiCheck className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setIsCreatingRootFolder(false);
                setRootFolderName("");
              }}
              className="p-1 text-slate-400 hover:bg-slate-500/10 rounded"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto px-1.5 py-2 [scrollbar-width:thin]">
        {safeTree.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 px-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center text-slate-400 mb-2">
              <LuFolderTree className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              No files yet
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-3">
              Add your first file to begin coding.
            </p>
            <button
              onClick={() => setIsCreatingRootFile(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              + Create File
            </button>
          </div>
        ) : (
          safeTree.map((item) => (
            <Folder
              key={item._id || item.id}
              projectId={projectId}
              tree={safeTree}
              node={item}
              reloadTree={reloadTree}
              openFile={openFile}
              activeTab={activeTab}
              level={0}
            />
          ))
        )}
      </div>
    </motion.aside>
  );
}

export default Explorer;