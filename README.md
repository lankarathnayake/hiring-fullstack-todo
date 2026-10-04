# TODO App

A full-stack TODO app: React frontend, Express API, MongoDB storage.

Users can view, create, edit, mark as done and delete todos.

## Architecture

```
┌──────────────┐   HTTP / JSON   ┌──────────────┐   Mongoose   ┌──────────┐
│  client/     │ ──────────────▶ │  server/     │ ───────────▶ │ MongoDB  │
│  React+Vite  │ ◀────────────── │  Express API │ ◀─────────── │ (Atlas or│
│  :5173       │                 │  :5000       │              │  local)  │
└──────────────┘                 └──────────────┘              └──────────┘
```

| Folder                | What it is                                          | Docs                                  |
| --------------------- | --------------------------------------------------- | ------------------------------------- |
| [`client/`](client/)  | React (Vite) UI, talks to the API via axios         | [client/README.md](client/README.md)  |
| [`server/`](server/)  | Express REST API with Mongoose models and validation | [server/README.md](server/README.md)  |

### API

| Method | Endpoint                | Description                  |
| ------ | ----------------------- | ---------------------------- |
| GET    | `/api/todos`            | List all todos (newest first) |
| POST   | `/api/todos`            | Create a todo                |
| PUT    | `/api/todos/:id`        | Update title / description   |
| PATCH  | `/api/todos/:id/done`   | Toggle the done status       |
| DELETE | `/api/todos/:id`        | Delete a todo                |

Full request and response details are in [server/README.md](server/README.md).

## Quick start

You need Node.js 20.19+ (or 22.12+) and a MongoDB database, either local or [Atlas](https://www.mongodb.com/atlas). Run the two parts in separate terminals.

**1. Server**

```bash
cd server
npm install
cp .env.example .env      # Windows: copy .env.example .env
# edit .env and set MONGO_URI (local or Atlas, see server/README.md)
npm run dev
```

Wait for `MongoDB connected` and `Server running on port 5000`.

**2. Client**

```bash
cd client
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev
```

Open `http://localhost:5173`.

## Key decisions

- **Express + Mongoose + MongoDB:** the stack the brief prefers. The Mongoose schema holds the validation rules (required title, length limits) and provides the `createdAt` / `updatedAt` timestamps.
- **Layered server:** routes map URLs to controllers, controllers hold the logic, and one error-handling middleware turns validation errors into `400` responses with readable messages.
- **One hook owns the client state:** `useTodos` holds the todos, loading and error state and all the actions. Components only receive props and callbacks.
- **Optimistic UI for toggle and delete:** the list updates immediately and rolls back with an error banner if the request fails. Add and edit wait for the server so errors can appear next to the form.
- **Secrets stay out of git:** connection strings live in `.env` files, and `.env.example` files document the variables.

## Assumptions and limitations

- No authentication or user accounts (not required by the brief). All todos are shared, so do not expose this API publicly as is.
- No pagination, search or filtering.
- No automated tests; the app was verified manually.
- CORS is open to all origins for local development.
- If you use Atlas, network access may be open to all IPs for convenience; restrict it for real use.

## What I would do next

JWT authentication with a `user` reference on each todo, pagination, automated tests for the API and the components, a custom delete confirmation, and restricted CORS and network access.
