"use client";

import { FilterState } from "../hooks/useBoard";
import { motion, AnimatePresence } from "framer-motion";

interface SearchFilterProps {
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: string) => void;
  removeFilter: (key: keyof FilterState) => void;
  clearFilters: () => void;
  uniqueAssignees: string[];
  uniqueLabels: { id: string; name: string }[];
  isFilteringActive: boolean;
  showFiltersPanel: boolean;
}

export default function SearchFilter({
  filters,
  updateFilter,
  removeFilter,
  clearFilters,
  uniqueAssignees,
  uniqueLabels,
  isFilteringActive,
  showFiltersPanel,
}: SearchFilterProps) {
  // Check if we have individual filters active (excluding search, or including it for chips)
  const activeChips = Object.entries(filters).filter(
    ([key, value]) => value !== "" && key !== "search"
  );

  return (
    <div className="w-full">
      {/* Filters Dropdown Drawer */}
      <AnimatePresence>
        {showFiltersPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 md:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Assignee Filter */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="filter-assignee"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                  >
                    Assignee
                  </label>
                  <select
                    id="filter-assignee"
                    value={filters.assignee}
                    onChange={(e) => updateFilter("assignee", e.target.value)}
                    className="w-full text-sm py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="">All Assignees</option>
                    {uniqueAssignees.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Filter */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="filter-priority"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                  >
                    Priority
                  </label>
                  <select
                    id="filter-priority"
                    value={filters.priority}
                    onChange={(e) => updateFilter("priority", e.target.value)}
                    className="w-full text-sm py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Label Filter */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="filter-label"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                  >
                    Label Tag
                  </label>
                  <select
                    id="filter-label"
                    value={filters.label}
                    onChange={(e) => updateFilter("label", e.target.value)}
                    className="w-full text-sm py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="">All Labels</option>
                    {uniqueLabels.map((lbl) => (
                      <option key={lbl.id} value={lbl.name}>
                        {lbl.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Chips */}
      {isFilteringActive && (
        <div className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200/60 dark:border-slate-800/40 py-2.5">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Active filters:
            </span>

            {/* Title search chip if not empty */}
            {filters.search && (
              <span className="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 text-xs font-medium px-2.5 py-1 rounded-lg">
                Title: &quot;{filters.search}&quot;
                <button
                  onClick={() => removeFilter("search")}
                  className="hover:bg-indigo-200 dark:hover:bg-indigo-900/60 rounded-full p-0.5 ml-1 transition-colors cursor-pointer"
                  aria-label="Remove search filter"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}

            {/* Other filters chips */}
            {activeChips.map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-medium px-2.5 py-1 rounded-lg capitalize"
              >
                {key}: {value}
                <button
                  onClick={() => removeFilter(key as keyof FilterState)}
                  className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-0.5 ml-1 transition-colors cursor-pointer"
                  aria-label={`Remove ${key} filter`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}

            {/* Clear All Button */}
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 ml-1 transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
