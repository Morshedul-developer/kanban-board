# KanFlow — Interactive Kanban Board

A modern, responsive Kanban Board built with Next.js 14+, TypeScript, and Tailwind CSS as part of a Frontend Developer Internship task for SammTech Ltd.

🔗 **Live Demo:** [https://kanban-board-orcin-two.vercel.app](https://kanban-board-orcin-two.vercel.app)

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Morshedul-developer/kanban-board.git

# Navigate to project directory
cd kanban-board

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## ✅ Features Implemented

### Core Features
- **5 Kanban Columns** — Backlog, Todo, In Progress, Review, Done
- **Task Cards** with title, description, assignee (avatar + name), colored labels, due date, and priority (High / Medium / Low)
- **Drag & Drop** — move cards between columns and reorder within the same column using `@hello-pangea/dnd`
- **Add New Cards** — click "Add Card" in any column to create a new task
- **Delete Cards** — remove tasks with confirmation
- **Edit Modal** — click any card to open a full edit form
- **Search & Filter** — filter cards by title, assignee, label, and priority in real time
- **Dark / Light Mode** — respects system preference on first load, persists choice in localStorage
- **localStorage Persistence** — board state is saved and restored on page reload
- **Framer Motion Animations** — smooth card transitions, modal open/close, and drag previews
- **Fully Responsive** — works on mobile, tablet, and desktop

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus trap inside modal
- Escape key closes modal

---

## 🛠️ Technical Decisions

### Why `@hello-pangea/dnd` for drag and drop?
I chose `@hello-pangea/dnd` over alternatives like `dnd-kit` because it is a maintained fork of `react-beautiful-dnd` with full TypeScript support and a stable, well-documented API. It handles both cross-column and same-column reordering cleanly without requiring complex sensor setup.

### Why localStorage over a database?
The task requirement specified localStorage for persistence. I implemented a custom `useLocalStorage` hook to encapsulate read/write logic and handle SSR hydration safely — preventing a mismatch between server-rendered HTML and client state on first load.

### Server vs Client Components
I kept the root layout and page as Server Components. Only components that require interactivity — the board, columns, cards, modal, search, and theme toggle — are marked `"use client"`. This keeps the bundle size smaller and follows Next.js App Router best practices.

### Why Framer Motion?
The task explicitly allowed and encouraged Framer Motion. I used it for modal open/close animations (scale + fade), card mount animations (fade in), and drag overlay previews. This adds polish without impacting core functionality.

### Folder Structure
```
/src
  /app
    layout.tsx       → Root layout, theme provider
    page.tsx         → Server component entry point
  /components
    Board.tsx        → Main board, DragDropContext
    Column.tsx       → Individual column with Droppable
    TaskCard.tsx     → Card UI with Draggable
    TaskModal.tsx    → Add/Edit modal
    SearchFilter.tsx → Search input and filter dropdowns
    ThemeToggle.tsx  → Dark/Light mode button
  /hooks
    useLocalStorage.ts → Custom hook for localStorage with SSR safety
    useBoard.ts        → Board state management (add, edit, delete, move)
  /lib
    utils.ts         → Helper functions (cn, date formatting)
    defaultData.ts   → Sample board data for first load
  /types
    index.ts         → TypeScript interfaces (Task, Column, Board, Label)
```

### TypeScript
I used TypeScript throughout with strict typing. All component props, hook return values, and state shapes are explicitly typed in `/types/index.ts`. I avoided `any` types entirely.

---

## ⚡ Challenges and Solutions

### Challenge 1 — localStorage Hydration Mismatch
**Problem:** Next.js renders on the server first. Reading localStorage on the server causes a hydration mismatch error because the server returns empty state but the client loads saved data.

**Solution:** I used a `mounted` state flag in the `useLocalStorage` hook. The component renders default data on the first render, then updates with localStorage data after mount on the client side. This eliminates the hydration error completely.

### Challenge 2 — TypeScript with Drag & Drop
**Problem:** The `@hello-pangea/dnd` drop result object has nullable fields (`destination` can be `null`), which TypeScript enforces strictly.

**Solution:** I added proper null checks before processing drop results and typed the `DropResult` interface explicitly. This made the drag logic safer and caught potential runtime errors at compile time.

### Challenge 3 — Dark Mode Flash on Load
**Problem:** When using Tailwind's `dark:` classes with a toggle, the page briefly shows the wrong theme before JavaScript loads.

**Solution:** I added an inline script in the root `layout.tsx` that reads the localStorage theme value and applies the `dark` class to the `<html>` element before the page renders. This eliminates the flash entirely.

---

## 🔮 What I Would Improve With More Time

- **Undo/Redo** for drag and drop actions using a history stack
- **Export/Import** board as JSON for backup and sharing
- **Keyboard shortcuts** — `N` to add a new card, `Esc` to close modal
- **Real-time sync** across multiple browser tabs using `BroadcastChannel`
- **Virtualized list** for performance when there are many cards in a single column
- **Backend integration** — replace localStorage with a real database (MongoDB + API routes)
- **User authentication** — allow multiple users to have separate boards
- **Due date notifications** — highlight overdue cards visually

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14+ | Framework with App Router |
| TypeScript | Type safety throughout |
| Tailwind CSS | All styling |
| Framer Motion | Animations |
| @hello-pangea/dnd | Drag and drop |
| localStorage | Data persistence |

---

## 📁 Project Structure

```
kanban-board/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Board.tsx
│   │   ├── Column.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskModal.tsx
│   │   ├── SearchFilter.tsx
│   │   └── ThemeToggle.tsx
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   └── useBoard.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   └── defaultData.ts
│   └── types/
│       └── index.ts
├── public/
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

Built by [Md. Morshedul Khaer Nijhum](https://github.com/Morshedul-developer) for SammTech Ltd. Frontend Internship Task.