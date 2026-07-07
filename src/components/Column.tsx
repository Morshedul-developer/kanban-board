"use client";

import { Droppable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { Column as ColumnType, Task } from "../types";
import TaskCard from "./TaskCard";

interface ColumnProps {
  column: ColumnType;
  tasks: Record<string, Task>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (columnId: string) => void;
  checkTaskMatchesFilters: (task: Task) => boolean;
  isFilteringActive: boolean;
}

export default function Column({
  column,
  tasks,
  onEditTask,
  onDeleteTask,
  onAddTask,
  checkTaskMatchesFilters,
  isFilteringActive,
}: ColumnProps) {
  // Map and filter tasks that belong to this column and match active filters
  const filteredTasks = column.taskIds
    .map((id) => tasks[id])
    .filter(Boolean)
    .filter(checkTaskMatchesFilters);

  const taskCount = filteredTasks.length;

  return (
    <div className="flex flex-col w-[85vw] xs:w-72 sm:w-80 flex-shrink-0 snap-start sm:h-[calc(100vh-200px)] sm:min-h-[500px] bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          {column.title}
          {/* Animated Task Count Badge */}
          <motion.span
            key={taskCount}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 450, damping: 18 }}
            className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold bg-slate-200/60 text-slate-700 rounded-full dark:bg-slate-800 dark:text-slate-300"
          >
            {taskCount}
          </motion.span>
        </h3>

        {/* Column settings or context button if needed */}
      </div>

      {/* Droppable Task List Container */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-0 sm:overflow-y-auto p-3 transition-colors duration-200 ${
              snapshot.isDraggingOver
                ? "bg-indigo-500/5 dark:bg-indigo-500/5"
                : ""
            }`}
          >
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  isFilteredAndHighlighted={isFilteringActive}
                />
              ))
            ) : (
              <div className="h-28 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800/60 rounded-xl">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  No tasks here
                </span>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Column Footer "Add Card" Trigger */}
      <div className="p-3 bg-white/20 dark:bg-slate-900/20 border-t border-slate-200/20 dark:border-slate-800/40">
        <button
          onClick={() => onAddTask(column.id)}
          className="flex items-center justify-center gap-1.5 w-full py-2 px-4 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-slate-800 dark:hover:border-slate-700 transition-all shadow-sm shadow-transparent hover:shadow-slate-100 dark:hover:shadow-none cursor-pointer"
          aria-label={`Add card to ${column.title}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add Card</span>
        </button>
      </div>
    </div>
  );
}
