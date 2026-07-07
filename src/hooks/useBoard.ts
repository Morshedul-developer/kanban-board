"use client";

import { useLocalStorage } from "./useLocalStorage";
import { Board, Task } from "../types";
import { INITIAL_BOARD_DATA } from "../lib/defaultData";
import { useState, useMemo } from "react";

export interface FilterState {
  search: string;
  assignee: string;
  priority: string;
  label: string;
}

export function useBoard() {
  const [board, setBoard, isHydrated] = useLocalStorage<Board>(
    "kanflow-board-state",
    INITIAL_BOARD_DATA
  );

  // Search and filter states
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    assignee: "",
    priority: "",
    label: "",
  });

  // Check if any filter is active
  const isFilteringActive = useMemo(() => {
    return (
      filters.search.trim() !== "" ||
      filters.assignee !== "" ||
      filters.priority !== "" ||
      filters.label !== ""
    );
  }, [filters]);

  // Reorder tasks in a column or move across columns
  const moveTask = (
    taskId: string,
    sourceColId: string,
    destColId: string,
    sourceIndex: number,
    destIndex: number
  ) => {
    setBoard((prev) => {
      const newColumns = prev.columns.map((col) => {
        if (col.id === sourceColId && col.id === destColId) {
          // Reorder in the same column
          const newTaskIds = Array.from(col.taskIds);
          newTaskIds.splice(sourceIndex, 1);
          newTaskIds.splice(destIndex, 0, taskId);
          return { ...col, taskIds: newTaskIds };
        } else if (col.id === sourceColId) {
          // Remove from source column
          return {
            ...col,
            taskIds: col.taskIds.filter((id) => id !== taskId),
          };
        } else if (col.id === destColId) {
          // Add to destination column
          const newTaskIds = Array.from(col.taskIds);
          newTaskIds.splice(destIndex, 0, taskId);
          return { ...col, taskIds: newTaskIds };
        }
        return col;
      });

      const updatedTasks = { ...prev.tasks };
      if (updatedTasks[taskId]) {
        updatedTasks[taskId] = {
          ...updatedTasks[taskId],
          columnId: destColId,
        };
      }

      return {
        ...prev,
        columns: newColumns,
        tasks: updatedTasks,
      };
    });
  };

  // Add a new task to a specific column
  const addTask = (columnId: string, task: Omit<Task, "id" | "columnId">) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = {
      ...task,
      id: newTaskId,
      columnId,
    };

    setBoard((prev) => {
      const newTasks = { ...prev.tasks, [newTaskId]: newTask };
      const newColumns = prev.columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            taskIds: [...col.taskIds, newTaskId],
          };
        }
        return col;
      });

      return {
        ...prev,
        columns: newColumns,
        tasks: newTasks,
      };
    });
  };

  // Edit an existing task
  const editTask = (taskId: string, updatedTaskData: Partial<Task>) => {
    setBoard((prev) => {
      if (!prev.tasks[taskId]) return prev;
      
      const newTasks = {
        ...prev.tasks,
        [taskId]: {
          ...prev.tasks[taskId],
          ...updatedTaskData,
        } as Task,
      };

      return {
        ...prev,
        tasks: newTasks,
      };
    });
  };

  // Delete a task with verification prompt
  const deleteTask = (taskId: string) => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("Are you sure you want to delete this task?");
      if (!confirmed) return;
    }

    setBoard((prev) => {
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];

      const newColumns = prev.columns.map((col) => {
        return {
          ...col,
          taskIds: col.taskIds.filter((id) => id !== taskId),
        };
      });

      return {
        ...prev,
        columns: newColumns,
        tasks: newTasks,
      };
    });
  };

  // Filter checking predicate
  const checkTaskMatchesFilters = (task: Task): boolean => {
    // 1. Search filter (by title, case insensitive)
    if (filters.search.trim() !== "") {
      const query = filters.search.toLowerCase();
      if (!task.title.toLowerCase().includes(query)) {
        return false;
      }
    }

    // 2. Assignee filter
    if (filters.assignee !== "") {
      if (task.assignee.name !== filters.assignee) {
        return false;
      }
    }

    // 3. Priority filter
    if (filters.priority !== "") {
      if (task.priority !== filters.priority) {
        return false;
      }
    }

    // 4. Label filter (match label ID or label name)
    if (filters.label !== "") {
      const hasLabel = task.labels.some((lbl) => lbl.id === filters.label || lbl.name === filters.label);
      if (!hasLabel) {
        return false;
      }
    }

    return true;
  };

  // Helper to retrieve unique list of assignees for filtering dropdowns
  const uniqueAssignees = useMemo(() => {
    const names = new Set<string>();
    Object.values(board.tasks).forEach((t) => {
      if (t.assignee && t.assignee.name) {
        names.add(t.assignee.name.trim());
      }
    });
    return Array.from(names).filter(Boolean);
  }, [board.tasks]);

  // Helper to retrieve unique list of labels used for filtering dropdowns
  const uniqueLabels = useMemo(() => {
    const labelsMap = new Map<string, string>(); // name -> id
    Object.values(board.tasks).forEach((t) => {
      t.labels.forEach((lbl) => {
        if (lbl.name) {
          labelsMap.set(lbl.name.trim(), lbl.id);
        }
      });
    });
    return Array.from(labelsMap.entries()).map(([name, id]) => ({ id, name }));
  }, [board.tasks]);

  const clearFilters = () => {
    setFilters({
      search: "",
      assignee: "",
      priority: "",
      label: "",
    });
  };

  const removeFilter = (key: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
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
  };
}
