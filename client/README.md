# TODO App – Client

React (Vite) frontend for the TODO app. It talks to the Express API in [`../server`](../server/README.md) over HTTP.

## Features

- View all todos, newest first
- Add a todo (title required, description optional) with inline validation
- Edit a todo's title and description in place
- Mark a todo as done or not done (completed items are struck through and faded)
- Delete a todo (with a confirmation prompt)
- Optimistic updates for toggle and delete: the UI changes immediately and rolls back with an error banner if the request fails
- Loading and error states, and an empty state
- Light and dark theme that follows the operating system setting

## Prerequisites

- Node.js 20.19+ or 22.12+ (the minimum Vite requires)
- The API from `../server` running (default `http://localhost:5000`)

## Setup and run

```bash
cd client
npm install
cp .env.example .env      # Windows (cmd/PowerShell): copy .env.example .env
npm run dev
```

Open the URL Vite prints, normally `http://localhost:5173`.

Start the server first (see [`server/README.md`](../server/README.md)), otherwise the page shows "Could not load todos".

### Other scripts

| Command           | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload  |
| `npm run build`   | Production build into `dist/`         |
| `npm run preview` | Serve the production build locally    |
| `npm run lint`    | Run ESLint                            |

## Environment variables

| Variable       | Description                | Default in `.env.example`      |
| -------------- | -------------------------- | ------------------------------ |
| `VITE_API_URL` | Base URL of the REST API   | `http://localhost:5000/api`    |

Vite reads `.env` only at startup, so restart `npm run dev` after changing it. Only variables prefixed with `VITE_` are exposed to the browser. `.env` is git-ignored.

## Project structure

```
client/src/
├── api/todos.js          # axios calls: getTodos, createTodo, updateTodo, toggleDone, deleteTodo
├── hooks/useTodos.js     # todo state (todos, loading, error) and the add/edit/toggle/delete actions
├── components/
│   ├── TodoForm.jsx      # add form with validation
│   ├── TodoList.jsx      # list and empty state
│   ├── TodoItem.jsx      # one todo: checkbox, inline edit, delete
│   └── ErrorBanner.jsx   # dismissible banner for failed actions
├── App.jsx               # wires the hook to the components
├── App.css               # component styles
└── index.css             # theme variables (light/dark) and base reset
```

### Design notes

- **API calls live in one file** (`api/todos.js`), so components never deal with URLs or axios responses.
- **State lives in one hook** (`useTodos`). Components receive data and callbacks as props, which keeps them small and easy to read.
- **Add and edit wait for the server** before updating the list, so the form can show validation or network errors next to the input. **Toggle and delete are optimistic**: the previous list is kept and restored if the request fails.
- **Two kinds of errors:** a failed initial load replaces the page with a message, while a failed action shows a banner and keeps the list visible.

## Assumptions and limitations

- The API must be running and reachable at `VITE_API_URL`; there is no offline mode or retry button.
- No authentication or user accounts (not required by the brief). All todos are shared.
- No pagination, search, filtering or sorting controls; the list shows every todo, newest first.
- Client-side validation mirrors the server limits (title required, max 100 characters; description max 500). The server is the source of truth.
- No automated tests; the UI was verified manually.
- Delete uses the browser's built-in `confirm` dialog instead of a custom modal.
