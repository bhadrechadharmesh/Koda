import { useState, useRef, useEffect, useCallback } from "react";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react";
import {
  FiSend,
  FiTrash2,
  FiX,
  FiCopy,
  FiCheck,
  FiCpu,
} from "react-icons/fi";

const QUICK_PROMPTS = [
  "Create an index.html and modern CSS landing page",
  "How to build a responsive navbar in React?",
  "Write a fetch API utility with error handling",
  "Add dark mode support using CSS variables",
];

function AiChat({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: "initial",
      role: "assistant",
      content:
        "Hello! I am your **Koda AI Copilot**. Ask me to generate components, refactor code, find bugs, or scaffold files for this workspace.",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = useCallback((textToSend) => {
    const query = typeof textToSend === "string" ? textToSend : input;
    if (!query.trim() || isTyping) return;

    const timeStr = "Now";

    const userMessage = {
      id: `msg-${messages.length + 1}`,
      role: "user",
      content: query.trim(),
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate intelligent AI pairing response
    setTimeout(() => {
      let replyContent;
      const lower = query.toLowerCase();

      if (lower.includes("html") || lower.includes("landing")) {
        replyContent =
          "Here is a modern responsive HTML & CSS starter template:\n\n```html\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Modern Web App</title>\n  <link rel=\"stylesheet\" href=\"style.css\" />\n</head>\n<body>\n  <main class=\"hero\">\n    <h1>Built with Koda AI</h1>\n    <p>Fast, interactive cloud dev environment.</p>\n    <button class=\"btn-primary\">Get Started</button>\n  </main>\n</body>\n</html>\n```\n\nYou can create `index.html` and `style.css` using the Explorer panel!";
      } else if (lower.includes("navbar") || lower.includes("nav")) {
        replyContent =
          "Here is a clean responsive Navbar pattern using Flexbox:\n\n```html\n<nav class=\"navbar\">\n  <div class=\"logo\">Brand</div>\n  <ul class=\"nav-links\">\n    <li><a href=\"#\">Home</a></li>\n    <li><a href=\"#\">Features</a></li>\n    <li><a href=\"#\">Contact</a></li>\n  </ul>\n</nav>\n```\n\n```css\n.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem 2rem;\n  background: rgba(255,255,255,0.05);\n  backdrop-filter: blur(10px);\n}\n```";
      } else if (lower.includes("fetch") || lower.includes("api")) {
        replyContent =
          "Here is a robust asynchronous fetch utility function:\n\n```javascript\nexport async function request(url, options = {}) {\n  try {\n    const res = await fetch(url, {\n      headers: { 'Content-Type': 'application/json', ...options.headers },\n      ...options,\n    });\n    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);\n    return await res.json();\n  } catch (err) {\n    console.error('Request failed:', err);\n    throw err;\n  }\n}\n```";
      } else {
        replyContent = `I understand you're working on "${query}".\n\nTo apply this to your workspace:\n1. Open your relevant file in the editor or create a new file in Explorer.\n2. Write your logic or styles and press **Ctrl + S** to save.\n3. Click **Preview** in the top bar to inspect live changes instantly!\n\nLet me know if you'd like a specific code snippet or implementation.`;
      }

      const aiMessage = {
        id: `ai-${messages.length}-${Math.random().toString(36).slice(2, 7)}`,
        role: "assistant",
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 900);
  }, [input, isTyping, messages.length]);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 340, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-full shrink-0 flex flex-col bg-white dark:bg-[#0c0d14] border-l border-slate-200 dark:border-white/[0.08] select-none overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between h-10 px-3.5 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white">
            <IoSparkles className="w-3 h-3" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
            Koda Copilot
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
            AI
          </span>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              title="Clear Chat"
              className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              title="Close Chat"
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3.5 [scrollbar-width:thin]">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 border border-indigo-500/20">
              <IoSparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-1">
              How can I help you today?
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">
              Ask for code generation, bug fixing, or architecture advice.
            </p>

            <div className="w-full space-y-1.5">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="w-full text-left p-2 rounded-xl border border-slate-200/70 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] hover:bg-indigo-500/10 hover:border-indigo-500/30 text-[11px] text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                {isUser ? (
                  <span>You</span>
                ) : (
                  <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                    <FiCpu className="w-3 h-3" /> Copilot
                  </span>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              <div
                className={`relative group max-w-[92%] rounded-2xl p-3 text-xs leading-relaxed ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-sm"
                    : "bg-slate-100 dark:bg-[#151622] text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-white/[0.06] rounded-tl-none whitespace-pre-wrap font-sans"
                }`}
              >
                <div>{msg.content}</div>

                {!isUser && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    title="Copy message"
                    className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 rounded bg-black/40 text-slate-300 hover:text-white transition-opacity"
                  >
                    {copiedId === msg.id ? (
                      <FiCheck className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <FiCopy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] w-fit text-slate-400 text-xs">
            <IoSparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span className="animate-pulse">Copilot is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.01]">
        <div className="relative rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141520] focus-within:border-indigo-500 transition-colors shadow-sm">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask AI to write code or components..."
            rows={2}
            className="w-full p-2.5 pr-10 text-xs bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none resize-none [scrollbar-width:none]"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            disabled={!input.trim() || isTyping}
            onClick={() => handleSendMessage()}
            className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
          >
            <FiSend className="w-3.5 h-3.5" />
          </motion.button>
        </div>
        <p className="mt-1.5 text-[10px] text-center text-slate-400 dark:text-slate-500">
          Press <kbd className="font-mono">Enter</kbd> to send, <kbd className="font-mono">Shift+Enter</kbd> for newline
        </p>
      </div>
    </motion.aside>
  );
}

export default AiChat;