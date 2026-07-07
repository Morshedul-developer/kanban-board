"use client";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Board as BoardType, Task } from "../types";
import Column from "./Column";

interface BoardProps {
  board: BoardType;
  isHydrated: boolean;
  moveTask: (
    taskId: string,
    sourceColId: string,
    destColId: string,
    sourceIndex: number,
    destIndex: number
  ) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (columnId: string) => void;
  checkTaskMatchesFilters: (task: Task) => boolean;
  isFilteringActive: boolean;
}

export default function Board({
  board,
  isHydrated,
  moveTask,
  onEditTask,
  onDeleteTask,
  onAddTask,
  checkTaskMatchesFilters,
  isFilteringActive,
}: BoardProps) {
  // Handle drag completions
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid droppable column area
    if (!destination) return;

    // Dropped in the same exact spot
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveTask(
      draggableId,
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  };

  // Render Skeleton Loader during Client-side Hydration loading state
  if (!isHydrated) {
    return (
      <div className="board-scroll flex items-start gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 select-none w-full max-w-7xl mx-auto px-4 md:px-8 snap-x snap-mandatory scroll-smooth">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            className="flex flex-col w-[85vw] xs:w-72 sm:w-80 sm:h-[calc(100vh-200px)] sm:min-h-[500px] flex-shrink-0 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden animate-pulse snap-start"
          >
            {/* Header Skeleton */}
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-slate-900/20">
              <div className="w-24 h-4 bg-slate-200 dark:bg-slate-850 rounded" />
              <div className="w-6 h-5 bg-slate-200 dark:bg-slate-850 rounded-full" />
            </div>
            {/* Cards Skeletons */}
            <div className="flex-1 p-3 space-y-3 overflow-hidden">
              {[1, 2].map((cardIdx) => (
                <div
                  key={cardIdx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-3"
                >
                  <div className="w-12 h-3.5 bg-slate-100 dark:bg-slate-800 rounded" />
                  <div className="w-full h-5 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="w-3/4 h-3.5 bg-slate-100 dark:bg-slate-800 rounded" />
                  <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="w-16 h-3 bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="w-6 h-6 bg-slate-200 dark:bg-slate-850 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
            {/* Footer Skeleton */}
            <div className="p-3 border-t border-slate-150/20 dark:border-slate-800/40">
              <div className="w-full h-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="board-scroll flex items-start gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 select-none w-full max-w-7xl mx-auto px-4 md:px-8 snap-x snap-mandatory scroll-smooth scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {board.columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={board.tasks}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onAddTask={onAddTask}
            checkTaskMatchesFilters={checkTaskMatchesFilters}
            isFilteringActive={isFilteringActive}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
