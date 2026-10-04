import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiChevronRight,
  FiChevronDown,
  FiFilePlus,
  FiFolderPlus,
  FiTrash2,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { LuFolderClosed, LuFolderOpen } from "react-icons/lu";
import {
  getFolderColor,
  getFileIcon,
  renderFileIcon,
} from "../utils/customizeIcon";
import { createFile, createFolder, DeleteFile } from "../features/file";
import { createPortal } from "react-dom";

function Folder({
  projectId,
  tree,
  reloadTree,
  node,
  openFile,
  activeTab,
  level = 0,
}) {
  const [open, setOpen] = useState(true);
  const [folderName, setFolderName] = useState("");
  const [fileName, setFileName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [menu, setMenu] = useState(null);

  if (!node) return null;

  const folderColor = getFolderColor(node?.name);
  const fileColor = getFileIcon(node?.name);
  const isSelected = activeTab?._id === node?._id;

  const handleCreateFolder = async (e) => {
    e?.stopPropagation();
    if (!folderName.trim()) return;
    await createFolder(projectId, folderName.trim(), node._id);
    setFolderName("");
    setIsCreatingFolder(false);
    setOpen(true);
    reloadTree();
  };

  const handleCreateFile = async (e) => {
    e?.stopPropagation();
    if (!fileName.trim()) return;
    const lang = fileName.includes(".") ? fileName.split(".").pop() : "plaintext";
    await createFile(projectId, fileName.trim(), node._id, "", lang);
    setFileName("");
    setIsCreatingFile(false);
    setOpen(true);
    reloadTree();
  };

  const handleDelete = async (e) => {
    e?.stopPropagation();
    setMenu(null);
    const itemType = node.type === "folder" ? "folder" : "file";
    if (window.confirm(`Delete ${itemType} "${node.name}"?`)) {
      await DeleteFile(node._id);
      reloadTree();
    }
  };

  // --- FILE ITEM ---
  if (node.type === "file") {
    return (
      <div className="relative select-none">
        <div
          onClick={() => openFile && openFile(node)}
          onContextMenu={(e) => {
            e.preventDefault();
            setMenu({ x: e.clientX, y: e.clientY });
          }}
          style={{ paddingLeft: `${Math.max(level * 14 + 10, 10)}px` }}
          className={`group flex items-center justify-between py-1.5 pr-2 rounded-lg cursor-pointer text-xs transition-colors duration-150 ${
            isSelected
              ? "bg-indigo-500/15 text-indigo-400 font-medium"
              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {renderFileIcon(node.name, `w-3.5 h-3.5 shrink-0 ${fileColor}`)}
            <span className="truncate">{node.name}</span>
          </div>

          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
            <button
              onClick={handleDelete}
              title="Delete File"
              className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <FiTrash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Context Menu */}
        {menu &&
          createPortal(
            <>
              <div
                className="fixed inset-0 z-50"
                onClick={() => setMenu(null)}
              />
              <div
                className="fixed z-50 min-w-[140px] rounded-xl bg-white dark:bg-[#181924] border border-slate-200 dark:border-white/[0.08] shadow-xl py-1 text-xs backdrop-blur-xl"
                style={{ left: menu.x, top: menu.y }}
              >
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                  <span>Delete File</span>
                </button>
              </div>
            </>,
            document.body
          )}
      </div>
    );
  }

  // --- FOLDER ITEM ---
  return (
    <div className="relative select-none">
      <div
        onClick={() => setOpen(!open)}
        onContextMenu={(e) => {
          e.preventDefault();
          setMenu({ x: e.clientX, y: e.clientY });
        }}
        style={{ paddingLeft: `${Math.max(level * 14 + 6, 6)}px` }}
        className="group flex items-center justify-between py-1.5 pr-2 rounded-lg cursor-pointer text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors duration-150"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-slate-400 dark:text-slate-500 p-0.5">
            {open ? (
              <FiChevronDown className="w-3.5 h-3.5" />
            ) : (
              <FiChevronRight className="w-3.5 h-3.5" />
            )}
          </span>

          {open ? (
            <LuFolderOpen className={`w-4 h-4 shrink-0 ${folderColor}`} />
          ) : (
            <LuFolderClosed className={`w-4 h-4 shrink-0 ${folderColor}`} />
          )}

          <span className="truncate font-medium">{node.name}</span>
        </div>

        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCreatingFile(true);
              setIsCreatingFolder(false);
              setOpen(true);
            }}
            title="New File"
            className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
          >
            <FiFilePlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCreatingFolder(true);
              setIsCreatingFile(false);
              setOpen(true);
            }}
            title="New Folder"
            className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
          >
            <FiFolderPlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            title="Delete Folder"
            className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Inline Create File */}
      {isCreatingFile && (
        <div
          style={{ paddingLeft: `${(level + 1) * 14 + 10}px` }}
          className="flex items-center gap-1 py-1 pr-2"
        >
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateFile(e);
              if (e.key === "Escape") {
                setIsCreatingFile(false);
                setFileName("");
              }
            }}
            placeholder="filename.js"
            autoFocus
            className="flex-1 bg-white dark:bg-black/30 border border-indigo-500/40 rounded px-2 py-0.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={handleCreateFile}
            className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded"
          >
            <FiCheck className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setIsCreatingFile(false);
              setFileName("");
            }}
            className="p-1 text-slate-400 hover:bg-slate-500/10 rounded"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Inline Create Folder */}
      {isCreatingFolder && (
        <div
          style={{ paddingLeft: `${(level + 1) * 14 + 10}px` }}
          className="flex items-center gap-1 py-1 pr-2"
        >
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateFolder(e);
              if (e.key === "Escape") {
                setIsCreatingFolder(false);
                setFolderName("");
              }
            }}
            placeholder="folder-name"
            autoFocus
            className="flex-1 bg-white dark:bg-black/30 border border-indigo-500/40 rounded px-2 py-0.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={handleCreateFolder}
            className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded"
          >
            <FiCheck className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setIsCreatingFolder(false);
              setFolderName("");
            }}
            className="p-1 text-slate-400 hover:bg-slate-500/10 rounded"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Folder Children */}
      <AnimatePresence>
        {open && node.children && Array.isArray(node.children) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            {node.children.map((child) => (
              <Folder
                key={child._id}
                projectId={projectId}
                tree={tree}
                reloadTree={reloadTree}
                node={child}
                openFile={openFile}
                activeTab={activeTab}
                level={level + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Folder Context Menu */}
      {menu &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-50"
              onClick={() => setMenu(null)}
            />
            <div
              className="fixed z-50 min-w-[150px] rounded-xl bg-white dark:bg-[#181924] border border-slate-200 dark:border-white/[0.08] shadow-xl py-1 text-xs backdrop-blur-xl"
              style={{ left: menu.x, top: menu.y }}
            >
              <button
                onClick={() => {
                  setMenu(null);
                  setIsCreatingFile(true);
                  setIsCreatingFolder(false);
                  setOpen(true);
                }}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-slate-700 dark:text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors"
              >
                <FiFilePlus className="w-3.5 h-3.5" />
                <span>New File</span>
              </button>
              <button
                onClick={() => {
                  setMenu(null);
                  setIsCreatingFolder(true);
                  setIsCreatingFile(false);
                  setOpen(true);
                }}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-slate-700 dark:text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors"
              >
                <FiFolderPlus className="w-3.5 h-3.5" />
                <span>New Folder</span>
              </button>
              <div className="my-1 border-t border-slate-100 dark:border-white/[0.06]" />
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                <span>Delete Folder</span>
              </button>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}

export default Folder;