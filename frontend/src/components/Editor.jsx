import { AnimatePresence, motion } from "motion/react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { FiCode, FiSave, FiCheck, FiX } from "react-icons/fi";
import MonacoEditor from "@monaco-editor/react";
import { updateFile } from "../features/file";
import { getFileIcon, renderFileIcon } from "../utils/customizeIcon";

function Editor({ activeTab, openTabs, setOpenTabs, setActiveTab }) {
  const [code, setCode] = useState(activeTab?.content ?? "");
  const [prevTabId, setPrevTabId] = useState(activeTab?._id);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Recommended React pattern: update state when activeTab changes without useEffect
  if (activeTab?._id !== prevTabId) {
    setPrevTabId(activeTab?._id);
    setCode(activeTab?.content ?? "");
  }

  const isDirty = useMemo(() => {
    return activeTab && code !== (activeTab.content ?? "");
  }, [activeTab, code]);

  const handleCloseTab = (e, tab) => {
    e.stopPropagation();
    const result = openTabs.filter((t) => t._id !== tab._id);
    setOpenTabs(result);
    if (activeTab?._id === tab._id) {
      setActiveTab(result.length > 0 ? result[result.length - 1] : null);
    }
  };

  const handleSave = useCallback(async () => {
    if (!activeTab || saving) return;

    try {
      setSaving(true);
      await updateFile(activeTab.name, code, activeTab._id);

      const updatedTab = { ...activeTab, content: code };
      setActiveTab(updatedTab);
      setOpenTabs((tabs) =>
        tabs.map((t) => (t._id === activeTab._id ? updatedTab : t))
      );

      setSaving(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1200);
    } catch (e) {
      console.error("Save failed:", e);
      setSaving(false);
    }
  }, [activeTab, code, saving, setActiveTab, setOpenTabs]);

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  const getMonacoLanguage = (name = "") => {
    const ext = name.split(".").pop().toLowerCase();
    const map = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      html: "html",
      css: "css",
      scss: "scss",
      json: "json",
      md: "markdown",
      py: "python",
      sh: "shell",
    };
    return map[ext] || "plaintext";
  };

  if (!activeTab) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center h-full bg-slate-50 dark:bg-[#0d0e17] text-center px-4 select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center max-w-sm"
        >
          <div className="p-4 mb-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] shadow-md shadow-slate-200/50 dark:shadow-none">
            <FiCode size={40} className="text-indigo-500" />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-white mb-1.5">
            No File Selected
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
            Select a file from the explorer on the left or create a new one to begin coding.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-white/[0.08] font-mono text-[10px] text-slate-700 dark:text-slate-300">
              Ctrl + S
            </kbd>
            <span>to save changes anytime</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full min-w-0 bg-[#1e1e1e] overflow-hidden">
      {/* Horizontal Tabs Header Bar */}
      <div className="flex items-center justify-between h-10 px-2 bg-[#181818] border-b border-white/[0.08] shrink-0 select-none">
        {/* Open Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden h-full">
          <AnimatePresence initial={false}>
            {openTabs.map((tab) => {
              const isActive = activeTab?._id === tab._id;
              const iconColor = getFileIcon(tab.name);
              const tabIsDirty = isActive && isDirty;

              return (
                <motion.div
                  key={tab._id}
                  onClick={() => setActiveTab(tab)}
                  className={`group relative flex items-center gap-2 h-8 px-3 rounded-t-lg text-xs cursor-pointer transition-all duration-150 border-t-2 ${
                    isActive
                      ? "bg-[#1e1e1e] text-white border-indigo-500 font-medium"
                      : "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border-transparent"
                  }`}
                >
                  {renderFileIcon(tab.name, `w-3.5 h-3.5 shrink-0 ${iconColor}`)}
                  <span className="truncate max-w-[120px]">{tab.name}</span>

                  {tabIsDirty ? (
                    <span
                      title="Unsaved changes"
                      className="w-2 h-2 rounded-full bg-amber-400 shrink-0"
                    />
                  ) : (
                    <button
                      onClick={(e) => handleCloseTab(e, tab)}
                      title="Close Tab"
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-white hover:bg-white/[0.1] transition-opacity"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Right Tab Bar Actions */}
        <div className="flex items-center gap-2 pl-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={saving}
            title="Save (Ctrl+S)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              justSaved
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : isDirty
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                : "bg-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.1]"
            }`}
          >
            {saving ? (
              <span>Saving...</span>
            ) : justSaved ? (
              <>
                <FiCheck className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <FiSave className="w-3.5 h-3.5" />
                <span>Save</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 min-h-0 w-full relative">
        <MonacoEditor
          language={getMonacoLanguage(activeTab.name)}
          value={code}
          onChange={(val) => setCode(val ?? "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            fontSize: 13.5,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace",
            lineHeight: 22,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: "all",
            smoothScrolling: true,
            cursorBlinking: "smooth",
          }}
        />
      </div>
    </div>
  );
}

export default Editor;