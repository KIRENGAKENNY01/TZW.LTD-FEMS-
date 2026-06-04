# TZW FEMS — Fire Extinguisher Management System

Monorepo layout:

| Path | Description |
|------|-------------|
| `frontend/FEMS/` | Next.js 15 app (landing, auth, role-based dashboards) — port **6006** |
| `tzw-fems/` | API gateway + microservices — gateway port **5000** |

## Quick start

### Backend

```bash
cd tzw-fems
npm install
npm run dev   # starts gateway (5000) and all services
```

### Frontend

```bash
cd frontend/FEMS
npm install
npm run dev   # http://localhost:6006
```

Set `NEXT_PUBLIC_API_URL=http://localhost:5000` in `frontend/FEMS/.env.local`.

## Public routes

- `/` — TZW FEMS marketing landing page
- `/login`, `/register` — auth (API via gateway)
- `/dashboard` — protected; role-based UI (Admin / Inspector / User)
