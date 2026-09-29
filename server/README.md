# TODO App – Server

Express.js REST API for the TODO app, backed by MongoDB (via Mongoose).

## Prerequisites

- Node.js 18 or newer
- A MongoDB database: local install or MongoDB Atlas (see below)

## Setup and run

```bash
cd server
npm install
cp .env.example .env      
# Windows (cmd/PowerShell): copy .env.example .env
```

Edit `.env` and set `MONGO_URI` (see [MongoDB connection notes](#mongodb-connection-notes)), then:

```bash
npm run dev     # development, restarts on file changes (nodemon)
npm start       # plain node
```

The API listens on `http://localhost:5000` by default. Check it with `GET /api/health`, which returns `{ "ok": true }`.

The server only starts listening after MongoDB connects. If the connection fails, it prints the reason and exits.

## Environment variables

`PORT` : `5000`
`MONGO_URI` : `mongodb://127.0.0.1:27017/todo-app`

`.env` is git-ignored. `.env.example` is committed as a template.

## MongoDB connection notes

Either option works. The code is identical, only `MONGO_URI` changes.

### Option 1: Local MongoDB

1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) and make sure the `mongod` service is running.
2. Use:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/todo-app
   ```

### Option 2: MongoDB Atlas

1. Create a free **M0** cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. **Database Access**: create a database user (read and write to any database). Prefer a password with letters and numbers only. Special characters must be URL-encoded (`@` → `%40`, `#` → `%23`, `/` → `%2F`, `:` → `%3A`).
3. **Network Access**: add your IP address (or `0.0.0.0/0` for a throwaway project).
4. **Connect → Drivers**: copy the connection string and add the database name before the `?`:
   ```
   MONGO_URI=mongodb+srv://<user>:<password>@<cluster-host>/todo-app?retryWrites=true&w=majority
   ```

The `todo-app` database and the `todos` collection are created automatically on the first write.

## API reference

Base URL: `http://localhost:5000`

| Method | Endpoint                | Body                        | Success        | Errors   |
| ------ | ----------------------- | --------------------------- | -------------- | -------- |
| GET    | `/api/todos`            | none                        | `200` (array)  | n/a      |
| POST   | `/api/todos`            | `{ title, description? }`   | `201` (todo)   | `400`    |
| PUT    | `/api/todos/:id`        | `{ title?, description? }`  | `200` (todo)   | `400`, `404` |
| PATCH  | `/api/todos/:id/done`   | none (toggles `done`)       | `200` (todo)   | `404`    |
| DELETE | `/api/todos/:id`        | none                        | `204`          | `404`    |

`GET /api/todos` returns the newest todos first.

### Todo object

```json
{
  "_id": "6abbf5da8e09585f63a326eb",
  "title": "Buy milk",
  "description": "2 litres",
  "done": false,
  "createdAt": "2026-09-29T17:31:06.152Z",
  "updatedAt": "2026-09-29T17:31:06.152Z"
}
```

### Validation and errors

- `title` is required, trimmed, max 100 characters.
- `description` is optional, trimmed, max 500 characters.
- Validation failures return `400` with `{ "message": "Title is required" }`.
- An invalid or unknown `:id` returns `404` with `{ "message": "Todo not found" }`.
- Unexpected errors return `500` with `{ "message": "Something went wrong" }`.

### Examples (PowerShell)

```powershell
# create
Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/todos `
  -ContentType 'application/json' -Body '{"title":"Buy milk","description":"2 litres"}'

# list
Invoke-RestMethod -Uri http://localhost:5000/api/todos

# toggle done
Invoke-RestMethod -Method Patch -Uri http://localhost:5000/api/todos/<id>/done
```

## Project structure

```
server/
├── src/
│   ├── index.js                  # app setup, DB connection, server start
│   ├── models/Todo.js            # Mongoose schema
│   ├── controllers/todoController.js
│   ├── routes/todos.js           # maps URLs to controller functions
│   └── middleware/errorHandler.js
├── .env.example
└── package.json
```

## Assumptions and limitations

- No authentication: all todos are shared by everyone using the API.
- No pagination on `GET /api/todos`; it returns every todo.
- CORS is open to all origins, which is fine for local development but should be restricted in production.
- If using Atlas with `0.0.0.0/0` network access, restrict it for real use.
- No automated tests; endpoints were verified manually.
- Toggling `done` is done server-side (the server flips the current value), so two rapid toggles from different clients can cancel each other out.
