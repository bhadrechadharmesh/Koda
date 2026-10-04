import { useState } from "react";
import { motion } from "motion/react";
import { FiTerminal, FiX, FiTrash2, FiPlay } from "react-icons/fi";
import { VscDebugConsole } from "react-icons/vsc";

function BottomPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState("terminal");
  const [cmdInput, setCmdInput] = useState("");
  const [history, setHistory] = useState([
    { text: "Koda Cloud Workspace Environment v1.2.0 [ready]", type: "info" },
    { text: "Node v20.12.0, npm v10.5.0 installed", type: "system" },
    { text: "Type 'help' for available commands or 'clear' to reset.", type: "system" },
  ]);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = cmdInput.trim();
    if (!cmd) return;

    const newHistory = [...history, { text: `$ ${cmd}`, type: "command" }];

    const lower = cmd.toLowerCase();
    if (lower === "clear") {
      setHistory([]);
      setCmdInput("");
      return;
    } else if (lower === "help") {
      newHistory.push(
        { text: "Available commands:", type: "info" },
        { text: "  ls             - list workspace files", type: "output" },
        { text: "  node -v        - check Node version", type: "output" },
        { text: "  npm test       - run project test suite", type: "output" },
        { text: "  npm run dev    - start dev server & preview", type: "output" },
        { text: "  clear          - clear terminal window", type: "output" }
      );
    } else if (lower === "ls" || lower === "dir") {
      newHistory.push({
        text: "src/  public/  index.html  package.json  README.md",
        type: "output",
      });
    } else if (lower === "node -v" || lower === "node --version") {
      newHistory.push({ text: "v20.12.0", type: "output" });
    } else if (lower.includes("dev") || lower.includes("start")) {
      newHistory.push(
        { text: "> workspace@0.1.0 dev", type: "system" },
        { text: "✓ Local:   http://localhost:3000/", type: "info" },
        { text: "⚡ Live preview is active in top bar Preview tab", type: "info" }
      );
    } else {
      newHistory.push({
        text: `bash: ${cmd}: command executed. Output piped to workspace runtime.`,
        type: "output",
      });
    }

    setHistory(newHistory);
    setCmdInput("");
  };

  const handleClear = () => {
    setHistory([]);
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 220, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col bg-[#141520] border-t border-slate-200 dark:border-white/[0.08] select-none text-xs font-mono overflow-hidden shrink-0"
    >
      {/* Panel Tab Bar */}
      <div className="flex h-9 shrink-0 items-center justify-between px-3 bg-[#0d0e17] border-b border-white/[0.06]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("terminal")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-t-lg transition-colors cursor-pointer ${
              activeTab === "terminal"
                ? "bg-[#141520] text-indigo-400 font-semibold border-b-2 border-indigo-500"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FiTerminal className="w-3.5 h-3.5" />
            <span>Terminal</span>
          </button>
          <button
            onClick={() => setActiveTab("console")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-t-lg transition-colors cursor-pointer ${
              activeTab === "console"
                ? "bg-[#141520] text-indigo-400 font-semibold border-b-2 border-indigo-500"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <VscDebugConsole className="w-3.5 h-3.5" />
            <span>Console</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClear}
            title="Clear Terminal"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            title="Close Panel"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-[11px] leading-relaxed [scrollbar-width:thin]">
        {history.map((line, idx) => (
          <div
            key={idx}
            className={`${
              line.type === "command"
                ? "text-indigo-300 font-semibold"
                : line.type === "info"
                ? "text-emerald-400"
                : line.type === "system"
                ? "text-slate-400"
                : "text-slate-300"
            }`}
          >
            {line.text}
          </div>
        ))}

        {/* Input prompt */}
        <form onSubmit={handleCommand} className="flex items-center gap-2 pt-1">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <FiPlay className="w-2.5 h-2.5" /> koda@dev:~$
          </span>
          <input
            type="text"
            value={cmdInput}
            onChange={(e) => setCmdInput(e.target.value)}
            placeholder="Type command..."
            className="flex-1 bg-transparent text-white focus:outline-none placeholder-slate-600 font-mono text-[11px]"
          />
        </form>
      </div>
    </motion.div>
  );
}

export default BottomPanel;