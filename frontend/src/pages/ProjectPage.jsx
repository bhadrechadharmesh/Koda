import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import { FiMinimize } from "react-icons/fi";

import ActivityBar from "../components/ActivityBar.jsx";
import TopBar from "../components/TopBar.jsx";
import Explorer from "../components/Explorer.jsx";
import Editor from "../components/Editor.jsx";
import Preview from "../components/Preview.jsx";
import BottomPanel from "../components/BottomPanel.jsx";
import AiChat from "../components/AiChat.jsx";

import { getProjectById } from "../features/project.js";
import { setCurrentProjects } from "../redux/projectSlice.js";
import { getTree } from "../features/file.js";

function ProjectPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Panels
  const [showExplorer, setShowExplorer] = useState(true);
  const [showAi, setShowAi] = useState(false);
  const [showBottomPanel, setShowBottomPanel] = useState(false);

  // View modes
  const [showPreview, setShowPreview] = useState(false);
  const [isSplitView, setIsSplitView] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Workspace data
  const [tree, setTree] = useState([]);
  const [openTabs, setOpenTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const loadTree = useCallback(async () => {
    if (!id) return;
    const data = await getTree(id);
    setTree(Array.isArray(data) ? data : []);
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      const projData = await getProjectById(id);
      if (isMounted && projData) {
        dispatch(setCurrentProjects(projData));
      }

      const treeData = await getTree(id);
      if (isMounted) {
        const safe = Array.isArray(treeData) ? treeData : [];
        setTree(safe);

        // Auto-open first file found if no tabs open
        const findFirstFile = (nodes) => {
          for (const node of nodes) {
            if (node.type === "file") return node;
            if (node.children?.length) {
              const res = findFirstFile(node.children);
              if (res) return res;
            }
          }
          return null;
        };

        const firstFile = findFirstFile(safe);
        if (firstFile) {
          setOpenTabs([firstFile]);
          setActiveTab(firstFile);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, [id, dispatch]);

  const openFile = (file) => {
    if (!file) return;
    const exists = openTabs.find((tab) => tab._id === file._id);
    if (!exists) {
      setOpenTabs((prev) => [...prev, file]);
    }
    setActiveTab(file);
    if (!isSplitView) {
      setShowPreview(false);
    }
  };

  return (
    <div className="relative flex flex-col h-screen w-full bg-slate-100 dark:bg-[#090a10] text-slate-900 dark:text-white overflow-hidden select-none">
      {/* Top Bar Header */}
      <TopBar
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        isSplitView={isSplitView}
        setIsSplitView={setIsSplitView}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
      />

      {/* Main Workspace Body */}
      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        {/* Leftmost Activity Bar Icon Rail */}
        <ActivityBar
          showExplorer={showExplorer}
          setShowExplorer={setShowExplorer}
          showAi={showAi}
          setShowAi={setShowAi}
          showTerminal={showBottomPanel}
          setShowTerminal={setShowBottomPanel}
        />

        {/* Collapsible File Explorer */}
        <AnimatePresence initial={false}>
          {showExplorer && (
            <Explorer
              projectId={id}
              tree={tree}
              reloadTree={loadTree}
              openFile={openFile}
              activeTab={activeTab}
              onClose={() => setShowExplorer(false)}
            />
          )}
        </AnimatePresence>

        {/* Center Workspace (Editor + Live Preview + Terminal) */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-900">
          {/* Main Visual Display Area */}
          <div className="flex-1 flex min-h-0 w-full overflow-hidden">
            {isSplitView ? (
              // Split View: Editor on Left, Live Preview on Right
              <div className="flex-1 flex min-h-0 w-full">
                <div className="flex-1 min-w-0 h-full border-r border-slate-200 dark:border-white/[0.08]">
                  <Editor
                    activeTab={activeTab}
                    openTabs={openTabs}
                    setOpenTabs={setOpenTabs}
                    setActiveTab={setActiveTab}
                  />
                </div>
                <div className="flex-1 min-w-0 h-full">
                  <Preview tree={tree} />
                </div>
              </div>
            ) : showPreview ? (
              // Full Width Preview
              <Preview tree={tree} />
            ) : (
              // Full Width Code Editor
              <Editor
                activeTab={activeTab}
                openTabs={openTabs}
                setOpenTabs={setOpenTabs}
                setActiveTab={setActiveTab}
              />
            )}
          </div>

          {/* Bottom Docked Panel (Terminal / Console) */}
          <AnimatePresence>
            {showBottomPanel && (
              <BottomPanel
                onClose={() => setShowBottomPanel(false)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Right Collapsible AI Copilot Panel */}
        <AnimatePresence initial={false}>
          {showAi && (
            <AiChat
              projectId={id}
              onClose={() => setShowAi(false)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Fullscreen Preview Overlay Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#090a10]"
          >
            <div className="h-10 px-4 flex items-center justify-between bg-slate-900 border-b border-white/[0.08] text-white">
              <span className="text-xs font-semibold">Fullscreen Sandbox Preview</span>
              <button
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.1] hover:bg-white/[0.2] text-xs font-semibold"
              >
                <FiMinimize className="w-3.5 h-3.5" />
                <span>Exit Fullscreen</span>
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <Preview tree={tree} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProjectPage;