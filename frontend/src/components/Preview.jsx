import { useMemo, useState } from "react";
import {
  FiRefreshCw,
  FiMonitor,
  FiTablet,
  FiSmartphone,
  FiExternalLink,
} from "react-icons/fi";
import { motion } from "motion/react";

function Preview({ tree }) {
  const [device, setDevice] = useState("desktop"); // 'desktop' | 'tablet' | 'mobile'
  const [key, setKey] = useState(0);

  const srcDoc = useMemo(() => {
    let html = "";
    let css = "";
    let js = "";

    const safeTree = Array.isArray(tree)
      ? tree
      : tree?.tree && Array.isArray(tree.tree)
      ? tree.tree
      : [];

    const traverse = (items = []) => {
      for (const item of items) {
        if (item.type === "file") {
          const ext = item?.name?.split(".").pop().toLowerCase();
          const content = item.content || "";

          if (ext === "css") {
            css += `\n/* ${item.name} */\n` + content;
          }

          if (ext === "js" || ext === "jsx") {
            js += `\n// ${item.name}\n` + content;
          }

          if (ext === "html") {
            // If it's index.html or we don't have html yet, use it
            if (item.name.toLowerCase() === "index.html" || !html) {
              html = content;
            }
          }
        }

        if (item.children && Array.isArray(item.children)) {
          traverse(item.children);
        }
      }
    };

    traverse(safeTree);

    if (!html) {
      html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Koda Sandbox Preview</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      text-align: center;
      background: #fafafa;
      color: #333;
    }
    .card {
      background: white;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      max-width: 440px;
    }
    h2 { margin-top: 0; color: #4f46e5; }
    p { color: #666; font-size: 14px; line-height: 1.6; }
    code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🚀 Live Preview Ready</h2>
    <p>Create or edit an <code>index.html</code>, <code>style.css</code>, or <code>script.js</code> file in your workspace to render live changes instantly.</p>
  </div>
</body>
</html>`;
    }

    if (css) {
      if (html.includes("</head>")) {
        html = html.replace("</head>", `<style>${css}</style></head>`);
      } else {
        html = `<head><style>${css}</style></head>` + html;
      }
    }

    if (js) {
      const scriptTag = `<script>\n${js}\n</script>`;
      if (html.includes("</body>")) {
        html = html.replace("</body>", `${scriptTag}</body>`);
      } else {
        html = html + scriptTag;
      }
    }

    return html;
  }, [tree]);

  const handleOpenNewTab = () => {
    const blob = new Blob([srcDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const getDeviceWidth = () => {
    switch (device) {
      case "mobile":
        return "max-w-[375px]";
      case "tablet":
        return "max-w-[768px]";
      default:
        return "w-full";
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-slate-100 dark:bg-[#0b0c13] overflow-hidden select-none">
      {/* Browser Bar */}
      <div className="flex items-center justify-between h-10 px-4 bg-white dark:bg-[#12131c] border-b border-slate-200 dark:border-white/[0.08] shrink-0">
        {/* Left URL mock */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06] text-xs text-slate-600 dark:text-slate-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>localhost:3000</span>
          </div>
        </div>

        {/* Viewport & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/[0.04] p-0.5 rounded-lg border border-slate-200/60 dark:border-white/[0.06]">
            <button
              onClick={() => setDevice("desktop")}
              title="Desktop View"
              className={`p-1.5 rounded-md text-xs transition-colors ${
                device === "desktop"
                  ? "bg-white dark:bg-white/[0.1] text-indigo-500 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FiMonitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice("tablet")}
              title="Tablet View (768px)"
              className={`p-1.5 rounded-md text-xs transition-colors ${
                device === "tablet"
                  ? "bg-white dark:bg-white/[0.1] text-indigo-500 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FiTablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice("mobile")}
              title="Mobile View (375px)"
              className={`p-1.5 rounded-md text-xs transition-colors ${
                device === "mobile"
                  ? "bg-white dark:bg-white/[0.1] text-indigo-500 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FiSmartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setKey((k) => k + 1)}
            title="Reload Preview"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleOpenNewTab}
            title="Open in New Tab"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <FiExternalLink className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 min-h-0 flex items-center justify-center p-3 overflow-hidden">
        <div
          className={`h-full ${getDeviceWidth()} transition-all duration-300 bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-white/[0.1]`}
        >
          <iframe
            key={key}
            srcDoc={srcDoc}
            title="Sandbox Preview"
            sandbox="allow-scripts allow-forms allow-modals"
            className="w-full h-full border-none bg-white"
          />
        </div>
      </div>
    </div>
  );
}

export default Preview;