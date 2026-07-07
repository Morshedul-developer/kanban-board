"use client";

import { Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { Task } from "../types";
import { getInitials, getAvatarGradient, getLabelColorClasses } from "../lib/utils";

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isFilteredAndHighlighted?: boolean;
}

export default function TaskCard({
  task,
  index,
  onEdit,
  onDelete,
  isFilteredAndHighlighted = false,
}: TaskCardProps) {
  // Check if task is overdue (dueDate in past, only if not Done column)
  const isOverdue = () => {
    if (!task.dueDate || task.columnId === "done") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    return due < today;
  };

  const getPriorityBadgeClasses = (priority: Task["priority"]) => {
    switch (priority) {
      case "High":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60";
      case "Low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-800";
    }
  };

  const formattedDate = () => {
    if (!task.dueDate) return "";
    try {
      const date = new Date(task.dueDate);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return task.dueDate;
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Avoid opening edit modal if trash button was clicked
    const target = e.target as HTMLElement;
    if (target.closest(".delete-btn")) return;
    onEdit(task);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          onClick={handleCardClick}
          className="outline-none mb-3"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`group relative p-3.5 sm:p-4 rounded-xl border bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/80 cursor-grab active:cursor-grabbing select-none transition-all duration-200 hover:-translate-y-0.5 ${
              snapshot.isDragging
                ? "shadow-xl border-indigo-400 dark:border-indigo-500 scale-[1.02] ring-2 ring-indigo-500/10"
                : isFilteredAndHighlighted
                ? "shadow-lg ring-2 ring-indigo-500 dark:ring-indigo-400 border-indigo-300 dark:border-indigo-700 scale-[1.01]"
                : "shadow-sm border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            {/* Top Row: Priorities & Actions */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityBadgeClasses(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>

              {/* Actions - Always visible on touch, hover on desktop */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                className="delete-btn opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 active:scale-95 cursor-pointer touch-manipulation"
                title="Delete Task"
                aria-label="Delete Task"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>

            {/* Task Title */}
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5 leading-snug line-clamp-2">
              {task.title}
            </h4>

            {/* Description (2 lines max, truncated) */}
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3.5 line-clamp-2 leading-relaxed">
              {task.description || "No description provided."}
            </p>

            {/* Labels Area */}
            {task.labels && task.labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3.5">
                {task.labels.map((lbl) => (
                  <span
                    key={lbl.id}
                    className={`text-[10px] font-bold border rounded-md px-2 py-0.5 ${getLabelColorClasses(
                      lbl.color
                    )}`}
                  >
                    {lbl.name}
                  </span>
                ))}
              </div>
            )}

            {/* Footer: Due date + Assignee — wraps on small cards */}
            <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-2 border-t border-slate-100 dark:border-slate-800/80 pt-2.5 mt-1 text-[11px]">
              {/* Due Date */}
              {task.dueDate ? (
                <div
                  className={`flex items-center gap-1 font-semibold ${
                    isOverdue()
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-3.5 h-3.5 flex-shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                  <span className="whitespace-nowrap">{formattedDate()}</span>
                  {isOverdue() && (
                    <span className="font-extrabold uppercase text-[8px] tracking-wide bg-rose-100 dark:bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-200/50 dark:border-rose-900/40">
                      Overdue
                    </span>
                  )}
                </div>
              ) : (
                <div />
              )}

              {/* Assignee Avatar */}
              {task.assignee && task.assignee.name && (
                <div
                  className="flex items-center gap-1.5 ml-auto"
                  title={`Assigned to ${task.assignee.name}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black tracking-wider bg-gradient-to-br shadow-sm flex-shrink-0 ${getAvatarGradient(
                      task.assignee.name
                    )}`}
                  >
                    {getInitials(task.assignee.name)}
                  </div>
                  <span className="font-semibold text-slate-600 dark:text-slate-300 max-w-[90px] truncate">
                    {task.assignee.name.split(" ")[0]}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}
