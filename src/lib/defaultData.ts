import { Board, Label } from "../types";

export const DEFAULT_LABELS: Label[] = [
  { id: "lbl-feature", name: "Feature", color: "blue" },
  { id: "lbl-bug", name: "Bug", color: "red" },
  { id: "lbl-design", name: "Design", color: "pink" },
  { id: "lbl-marketing", name: "Marketing", color: "amber" },
  { id: "lbl-research", name: "Research", color: "emerald" },
];

export const INITIAL_BOARD_DATA: Board = {
  columns: [
    {
      id: "backlog",
      title: "Backlog",
      taskIds: ["task-5"],
    },
    {
      id: "todo",
      title: "Todo",
      taskIds: ["task-4"],
    },
    {
      id: "in-progress",
      title: "In Progress",
      taskIds: ["task-3"],
    },
    {
      id: "review",
      title: "Review",
      taskIds: ["task-2"],
    },
    {
      id: "done",
      title: "Done",
      taskIds: ["task-1"],
    },
  ],
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Set up Next.js 14 codebase",
      description: "Initialize Next.js project with Tailwind CSS, TypeScript, and basic directory layout.",
      assignee: {
        name: "Alice Smith",
      },
      labels: [
        { id: "lbl-feature", name: "Feature", color: "blue" }
      ],
      dueDate: "2026-07-01",
      priority: "High",
      columnId: "done",
    },
    "task-2": {
      id: "task-2",
      title: "Design Landing Page Mockup",
      description: "Create premium glassmorphic mockups with dark and light variants in Figma. Review typography scale and color harmonies.",
      assignee: {
        name: "Bob Jones",
      },
      labels: [
        { id: "lbl-design", name: "Design", color: "pink" }
      ],
      dueDate: "2026-07-15",
      priority: "Medium",
      columnId: "review",
    },
    "task-3": {
      id: "task-3",
      title: "Implement drag and drop mechanics",
      description: "Integrate `@hello-pangea/dnd` context. Wrap columns and tasks, and style cards on active dragging states with Framer Motion.",
      assignee: {
        name: "Morshedul Developer",
      },
      labels: [
        { id: "lbl-feature", name: "Feature", color: "blue" },
        { id: "lbl-design", name: "Design", color: "pink" }
      ],
      dueDate: "2026-07-10",
      priority: "High",
      columnId: "in-progress",
    },
    "task-4": {
      id: "task-4",
      title: "Add Dark Mode toggler",
      description: "Implement a smooth theme toggler using context or HTML standard attributes. Store user choice in local storage and check system preferences.",
      assignee: {
        name: "Alice Smith",
      },
      labels: [
        { id: "lbl-feature", name: "Feature", color: "blue" }
      ],
      dueDate: "2026-07-12",
      priority: "Low",
      columnId: "todo",
    },
    "task-5": {
      id: "task-5",
      title: "Write integration tests and API docs",
      description: "Add Cypress/Playwright configuration files and document routing conventions inside README.md.",
      assignee: {
        name: "Charlie Brown",
      },
      labels: [
        { id: "lbl-research", name: "Research", color: "emerald" },
        { id: "lbl-marketing", name: "Marketing", color: "amber" }
      ],
      dueDate: "2026-07-20",
      priority: "Low",
      columnId: "backlog",
    },
  },
};
