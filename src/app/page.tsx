"use client";

import { useState } from "react";
import { useBoard } from "@/hooks/useBoard";
import { Task } from "@/types";
import Board from "@/components/Board";
import SearchFilter from "@/components/SearchFilter";
import ThemeToggle from "@/components/ThemeToggle";
import TaskModal from "@/components/TaskModal";

export default function Home() {
  const {
    board,
    isHydrated,
    filters,
    isFilteringActive,
    moveTask,
    addTask,
    editTask,
    deleteTask,
    checkTaskMatchesFilters,
    uniqueAssignees,
    uniqueLabels,
    updateFilter,
    removeFilter,
    clearFilters,
  } = useBoard();

  // Modal display states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<{
    task?: Task;
    columnId?: string;
  }>({});

  // Filter drawer panel toggle state
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Trigger modal for adding a new task
  const handleOpenAddTask = (columnId: string = "todo") => {
    setModalMode({ columnId });
    setIsModalOpen(true);
  };

  // Trigger modal for editing an existing task
  const handleOpenEditTask = (task: Task) => {
    setModalMode({ task });
    setIsModalOpen(true);
  };

  // Save changes from modal (Add or Edit)
  const handleSaveModalTask = (taskData: Omit<Task, "id" | "columnId">) => {
    if (modalMode.task) {
      editTask(modalMode.task.id, taskData);
    } else if (modalMode.columnId) {
      addTask(modalMode.columnId, taskData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 md:px-8 flex items-center justify-between gap-4">

          {/* Logo Section */}
          <div className="flex items-center gap-2.5 select-none">
            <svg
              className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="3" width="4" height="12" rx="1" fill="currentColor" className="opacity-60" />
              <rect x="10" y="3" width="4" height="18" rx="1" fill="currentColor" />
              <rect x="17" y="3" width="4" height="8" rx="1" fill="currentColor" className="opacity-80" />
            </svg>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              KanBan
            </span>
          </div>

          {/* Real-time Search Box — hidden on very small screens, visible on sm+ */}
          <div className="hidden sm:flex flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
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
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              placeholder="Search tasks..."
              className="w-full text-sm py-2 pl-9 pr-8 bg-slate-100 hover:bg-slate-200/60 dark:bg-slate-800 dark:hover:bg-slate-800/80 border border-transparent focus:border-slate-350 dark:focus:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-450 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 transition-all"
              aria-label="Search board tasks"
            />
            {filters.search && (
              <button
                onClick={() => removeFilter("search")}
                className="absolute inset-y-0 right-2.5 flex items-center text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 cursor-pointer"
                aria-label="Clear search text"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* Toggle Filters Button */}
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={`p-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${showFiltersPanel || isFilteringActive
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800/50 dark:text-indigo-300 shadow-sm"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-750"
                }`}
              aria-label="Toggle filter selectors panel"
              aria-expanded={showFiltersPanel}
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
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                />
              </svg>
              <span className="hidden sm:inline">Filters</span>
            </button>

            {/* Dark Mode Theme Toggle */}
            <ThemeToggle />

            {/* Global Create Task Trigger */}
            <button
              onClick={() => handleOpenAddTask("todo")}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-md shadow-indigo-500/25 dark:shadow-none flex items-center gap-1.5 cursor-pointer"
              aria-label="Add a task card to board"
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
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>

        </div>
      </header>

      {/* Dropdown Filters and Active Filter Chips */}
      <SearchFilter
        filters={filters}
        updateFilter={updateFilter}
        removeFilter={removeFilter}
        clearFilters={clearFilters}
        uniqueAssignees={uniqueAssignees}
        uniqueLabels={uniqueLabels}
        isFilteringActive={isFilteringActive}
        showFiltersPanel={showFiltersPanel}
      />

      {/* Main Board Area */}
      <main className="flex-1 flex flex-col py-4 sm:py-6 overflow-x-hidden">
        <Board
          board={board}
          isHydrated={isHydrated}
          moveTask={moveTask}
          onEditTask={handleOpenEditTask}
          onDeleteTask={deleteTask}
          onAddTask={handleOpenAddTask}
          checkTaskMatchesFilters={checkTaskMatchesFilters}
          isFilteringActive={isFilteringActive}
        />
      </main>

      {/* Edit / Add Dialog Popup Overlay */}
      <TaskModal
        key={isModalOpen ? (modalMode.task?.id || `new-${modalMode.columnId}`) : 'closed'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModalTask}
        task={modalMode.task}
      />
    </div>
  );
}
