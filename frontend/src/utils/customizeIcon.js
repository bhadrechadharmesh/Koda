import { createElement } from "react";
import {
  FiFile,
  FiFileText,
  FiCode,
  FiImage,
} from "react-icons/fi";
import {
  VscJson,
  VscMarkdown,
} from "react-icons/vsc";

export const getFolderColor = (name = "") => {
  const key = name.toLowerCase();

  const colorMap = {
    src: "text-blue-400",
    public: "text-emerald-400",
    node_modules: "text-slate-500",
    dist: "text-amber-400",
    build: "text-amber-400",
    components: "text-indigo-400",
    lib: "text-purple-400",
    utils: "text-cyan-400",
    api: "text-sky-400",
    routes: "text-teal-400",
    controllers: "text-blue-400",
    services: "text-violet-400",
    hooks: "text-rose-400",
    assets: "text-pink-400",
    styles: "text-pink-400",
    pages: "text-orange-400",
  };

  return colorMap[key] || "text-amber-400";
};

export const getFileIcon = (name = "") => {
  const ext = name.split(".").pop().toLowerCase();

  const iconMap = {
    js: "text-yellow-400",
    jsx: "text-cyan-400",
    ts: "text-blue-400",
    tsx: "text-sky-400",
    css: "text-pink-400",
    scss: "text-pink-500",
    html: "text-orange-500",
    json: "text-yellow-500",
    md: "text-slate-400",
    svg: "text-purple-400",
    png: "text-emerald-400",
    jpg: "text-emerald-400",
    env: "text-emerald-500",
  };

  return iconMap[ext] || "text-slate-400";
};

export const renderFileIcon = (name = "", className = "") => {
  const ext = name.split(".").pop().toLowerCase();

  switch (ext) {
    case "json":
      return createElement(VscJson, { className });
    case "md":
      return createElement(VscMarkdown, { className });
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "html":
    case "css":
    case "scss":
      return createElement(FiCode, { className });
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "webp":
      return createElement(FiImage, { className });
    case "txt":
      return createElement(FiFileText, { className });
    default:
      return createElement(FiFile, { className });
  }
};