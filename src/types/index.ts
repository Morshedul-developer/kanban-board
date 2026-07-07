export interface Label {
  id: string;
  name: string;
  color: string; // Tailind badge color scheme (e.g. bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300)
}

export interface Assignee {
  name: string;
  avatarUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: Assignee;
  labels: Label[];
  dueDate: string; // YYYY-MM-DD format
  priority: 'High' | 'Medium' | 'Low';
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Board {
  columns: Column[];
  tasks: Record<string, Task>;
}
