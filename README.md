# TukTuk Tracker API (local dev)

Quick notes to get the API running locally.

1) Create `.env` in the project root (see `.env.example`):

```
MONGO_URI=mongodb://username:password@host:port/dbname
PORT=5000
```

2) Install dependencies if you haven't:

```
npm install
```

3) Start in development mode (nodemon):

```powershell
npm run dev
```

Health check
- GET /health returns JSON with DB status: `{ ok: true, db: 'connected'|'disconnected'|'connecting' }`.

Notes
- The server will attempt to connect to MongoDB with retries. If the DB is not available the server still starts so you can access non-DB endpoints and the health check.
