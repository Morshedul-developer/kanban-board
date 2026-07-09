"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task, Label } from "../types";
import { DEFAULT_LABELS } from "../lib/defaultData";
import { parseMarkdown } from "../lib/utils";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, "id" | "columnId">) => void;
  task?: Task; // If provided, we are editing; if null, we are creating
}

const AVAILABLE_COLORS = ["blue", "red", "pink", "amber", "emerald", "purple", "indigo", "gray"];

export default function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Form states
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [assigneeName, setAssigneeName] = useState(task?.assignee?.name || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">(task?.priority || "Medium");
  const [selectedLabels, setSelectedLabels] = useState<Label[]>(task?.labels || []);
  
  // Custom label creator states
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("blue");
  const [showLabelCreator, setShowLabelCreator] = useState(false);

  // Editor states (Write / Preview tabs)
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");



  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const container = modalContainerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    const previousActiveElement = document.activeElement as HTMLElement;

    // Focus the title input (first element) initially
    setTimeout(() => {
      const titleInput = container.querySelector<HTMLInputElement>("#task-title");
      if (titleInput) titleInput.focus();
    }, 50);

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose]);

  // Handle outside click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Insert markdown shortcuts inside editor
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selectedText = text.substring(start, end);
    const replacement = prefix + selectedText + suffix;

    setDescription(text.substring(0, start) + replacement + text.substring(end));

    // Refocus and place cursor correctly
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  // Label toggling
  const toggleLabel = (label: Label) => {
    const exists = selectedLabels.some((lbl) => lbl.id === label.id);
    if (exists) {
      setSelectedLabels(selectedLabels.filter((lbl) => lbl.id !== label.id));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  // Custom label addition
  const handleCreateLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabelName.trim()) return;

    const newLabel: Label = {
      id: `lbl-${Date.now()}`,
      name: newLabelName.trim(),
      color: newLabelColor,
    };

    setSelectedLabels([...selectedLabels, newLabel]);
    setNewLabelName("");
    setShowLabelCreator(false);
  };

  // Save submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description,
      assignee: {
        name: assigneeName.trim() || "Unassigned",
      },
      labels: selectedLabels,
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      priority,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalContainerRef}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden focus:outline-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title-text"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h2
                id="modal-title-text"
                className="text-lg font-bold text-slate-800 dark:text-slate-100"
              >
                {task ? "Edit Task Details" : "Create New Task"}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-350 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Task Title */}
              <div className="space-y-1.5">
                <label
                  htmlFor="task-title"
                  className="text-sm font-semibold text-slate-600 dark:text-slate-300"
                >
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="task-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full text-base py-2 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>

              {/* Description Markdown Editor */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="task-description"
                    className="text-sm font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Description
                  </label>
                  {/* Write vs Preview Tabs */}
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setEditorTab("write")}
                      className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        editorTab === "write"
                          ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      }`}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab("preview")}
                      className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        editorTab === "preview"
                          ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {editorTab === "write" ? (
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-indigo-500 bg-white dark:bg-slate-800 transition-all">
                    {/* Markdown toolbar */}
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => insertFormatting("**", "**")}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
                        title="Bold (Ctrl+B equivalent)"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("*", "*")}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 text-xs italic cursor-pointer"
                        title="Italic"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("### ")}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                        title="Heading"
                      >
                        H
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("- ")}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 text-xs cursor-pointer"
                        title="Bullet List"
                      >
                        • List
                      </button>
                    </div>
                    {/* Textarea */}
                    <textarea
                      ref={textareaRef}
                      id="task-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add detailed task notes... (Supports basic Markdown)"
                      rows={5}
                      className="w-full p-3 bg-transparent text-sm text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
                    />
                  </div>
                ) : (
                  <div
                    className="w-full min-h-[142px] max-h-[220px] p-3 overflow-y-auto bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-sm prose dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(description) || '<span class="text-slate-400 italic">No description provided.</span>' }}
                  />
                )}
              </div>

              {/* Assignee & Due Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Assignee Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="task-assignee"
                    className="text-sm font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Assignee Name
                  </label>
                  <input
                    id="task-assignee"
                    type="text"
                    value={assigneeName}
                    onChange={(e) => setAssigneeName(e.target.value)}
                    placeholder="E.g., Alice Smith"
                    className="w-full text-sm py-2 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                {/* Due Date */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="task-duedate"
                    className="text-sm font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Due Date
                  </label>
                  <input
                    id="task-duedate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-sm py-2 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Priority Radios */}
              <div className="space-y-1.5">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Priority level
                </span>
                <div className="flex gap-4">
                  {(["Low", "Medium", "High"] as const).map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={level}
                        checked={priority === level}
                        onChange={() => setPriority(level)}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>

              {/* Labels Multi-Select */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Label Tags
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowLabelCreator(!showLabelCreator)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    {showLabelCreator ? "Cancel Custom" : "+ Add Custom Label"}
                  </button>
                </div>

                {/* Custom Label Form */}
                <AnimatePresence>
                  {showLabelCreator && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newLabelName}
                          onChange={(e) => setNewLabelName(e.target.value)}
                          placeholder="Label name (e.g. Hotfix)"
                          className="flex-1 text-xs py-1.5 px-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={handleCreateLabel}
                          className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs text-slate-500 dark:text-slate-400 mr-1.5">
                          Pick color:
                        </span>
                        {AVAILABLE_COLORS.map((colorName) => (
                          <button
                            key={colorName}
                            type="button"
                            onClick={() => setNewLabelColor(colorName)}
                            className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer ${
                              newLabelColor === colorName
                                ? "border-slate-800 dark:border-slate-200 scale-110"
                                : "border-transparent opacity-70 hover:opacity-100"
                            } ${
                              colorName === "blue" ? "bg-blue-400" :
                              colorName === "red" ? "bg-red-400" :
                              colorName === "pink" ? "bg-pink-400" :
                              colorName === "amber" ? "bg-amber-400" :
                              colorName === "emerald" ? "bg-emerald-400" :
                              colorName === "purple" ? "bg-purple-400" :
                              colorName === "indigo" ? "bg-indigo-400" : "bg-slate-400"
                            }`}
                            aria-label={`Select ${colorName}`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Grid of label options */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {DEFAULT_LABELS.map((label) => {
                    const isSelected = selectedLabels.some((lbl) => lbl.id === label.id);
                    return (
                      <button
                        key={label.id}
                        type="button"
                        onClick={() => toggleLabel(label)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800/80"
                        }`}
                      >
                        {label.name}
                        {isSelected && <span className="ml-1 text-[10px] font-black">✓</span>}
                      </button>
                    );
                  })}
                  
                  {/* Render custom created labels that are selected but not in DEFAULT_LABELS */}
                  {selectedLabels
                    .filter((lbl) => !DEFAULT_LABELS.some((d) => d.id === lbl.id))
                    .map((label) => (
                      <button
                        key={label.id}
                        type="button"
                        onClick={() => toggleLabel(label)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100 shadow-sm transition-all cursor-pointer"
                      >
                        {label.name}
                        <span className="ml-1 text-[10px] font-black">✓</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 dark:shadow-none transition-colors cursor-pointer"
                >
                  {task ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
