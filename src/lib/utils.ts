import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Standard cn utility to merge tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate initials from a name (e.g. "Alice Smith" -> "AS")
export function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Generate a deterministic premium HSL gradient background for an assignee based on their name hash
const GRADIENTS = [
  "from-indigo-500 to-purple-600 text-white shadow-indigo-200/50 dark:shadow-none",
  "from-emerald-500 to-teal-600 text-white shadow-emerald-200/50 dark:shadow-none",
  "from-rose-500 to-pink-600 text-white shadow-rose-200/50 dark:shadow-none",
  "from-amber-500 to-orange-600 text-white shadow-amber-200/50 dark:shadow-none",
  "from-violet-500 to-fuchsia-600 text-white shadow-violet-200/50 dark:shadow-none",
  "from-cyan-500 to-blue-600 text-white shadow-cyan-200/50 dark:shadow-none",
];

export function getAvatarGradient(name: string): string {
  if (!name) return GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

// Map general label color names to Tailwind badge styling classes
export const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800/60",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-200 dark:border-red-800/60",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-950/40",
    text: "text-pink-700 dark:text-pink-300",
    border: "border-pink-200 dark:border-pink-800/60",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800/60",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800/60",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800/60",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-800/60",
  },
  gray: {
    bg: "bg-slate-50 dark:bg-slate-900/60",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-800/60",
  },
};

export function getLabelColorClasses(color: string): string {
  const normColor = color.toLowerCase();
  const classes = COLOR_MAP[normColor] || COLOR_MAP.gray;
  return `${classes.bg} ${classes.text} ${classes.border}`;
}

// Convert a subset of Markdown rules into clean HTML paragraphs/headings/lists.
export function parseMarkdown(text: string): string {
  if (!text) return "";

  // 1. Escape HTML entities
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Headings
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-sm font-bold mt-3 mb-1 text-slate-800 dark:text-slate-200">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-base font-bold mt-4 mb-2 text-slate-800 dark:text-slate-200">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-lg font-bold mt-5 mb-3 text-slate-800 dark:text-slate-200">$1</h1>');

  // 3. Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-slate-100">$1</strong>');

  // 4. Italic
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

  // 5. Bullet Lists
  const lines = html.split("\n");
  let inList = false;
  const processedLines = lines.map((line) => {
    const listMatch = line.match(/^[\-\*]\s+(.*)$/);
    if (listMatch) {
      let prefix = "";
      if (!inList) {
        inList = true;
        prefix = '<ul class="list-disc pl-5 my-1.5 space-y-0.5 text-slate-700 dark:text-slate-300">';
      }
      return prefix + `<li>${listMatch[1]}</li>`;
    } else {
      let suffix = "";
      if (inList) {
        inList = false;
        suffix = "</ul>";
      }
      return suffix + line;
    }
  });
  if (inList) {
    processedLines.push("</ul>");
  }

  html = processedLines.join("\n");

  // 6. Split blocks and wrap simple lines in paragraphs
  const blocks = html.split(/\n\n+/);
  const parsedBlocks = blocks.map((block) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("<ul") || trimmed.startsWith("<h") || trimmed.startsWith("<p")) {
      return block;
    }
    if (!trimmed) return "";
    return `<p class="mb-2 leading-relaxed text-slate-600 dark:text-slate-400">${trimmed.replace(/\n/g, "<br />")}</p>`;
  });

  return parsedBlocks.join("\n");
}
