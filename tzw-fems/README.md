# TZW LTD — Fire Extinguisher Management System (FEMS) Backend

A complete, production-ready backend microservices monorepo designed for **TZW LTD**, a commercial fire safety equipment management company. The system governs fire extinguishers, inspection scheduling, maintenance logs, compliance checklists, reporting exports (PDF/CSV), and real-time user notification pipelines.

---

## 1. Project Overview
The TZW LTD FEMS manages fire extinguishers and safety compliance schedules across commercial buildings and facility floors. Features include:
- Single-point authentication and JWT/Refresh token rotation.
- Fire extinguisher lifecycle registry, warning alerts, and automated expired status calculations.
- Inspector scheduling and maintenance history logger.
- Dynamic data reporting engines with direct cache controls and PDF/CSV stream exporters.
- Notification dispatching on schedules, overdue tasks, completed logs, and password requests.

---

## 2. Architecture Diagram

```mermaid
graph TD
    Client[Web Client / Postman] -->|HTTP Public requests| GW[API Gateway: Port 5000]
    
    subgraph Microservices Monorepo
        GW -->|Proxy /api/auth/*| Auth[Auth Service: Port 5001]
        GW -->|Proxy /api/users/*| Users[User Management Service: Port 5002]
        GW -->|Proxy /api/extinguishers/*| Ext[Extinguisher Service: Port 5003]
        GW -->|Proxy /api/inspections/*| Insp[Inspection Service: Port 5004]
        GW -->|Proxy /api/reports/*| Rpt[Report Service: Port 5005]
        GW -->|Proxy /api/notifications/*| Notif[Notification Service: Port 5006]
        
        Auth <-->|Internal HTTP /internal/*| Users
        Users <-->|Internal HTTP /internal/*| Auth
        Users -.->|Internal HTTP /internal/*| Notif
        Insp -->|Internal HTTP /internal/*| Ext
        Insp -->|Internal HTTP /internal/*| Notif
        Rpt -->|Internal HTTP /internal/*| Ext
        Rpt -->|Internal HTTP /internal/*| Insp
    end
    
    subgraph Databases
        Auth --> DB_Auth[(tzw_auth_db)]
        Users --> DB_Users[(tzw_user_db)]
        Ext --> DB_Ext[(tzw_ext_db)]
        Insp --> DB_Insp[(tzw_insp_db)]
        Rpt --> DB_Rpt[(tzw_rpt_db)]
        Notif --> DB_Notif[(tzw_notif_db)]
    end
```

---

## 3. Service Responsibilities

- **API Gateway (Port 5000)**: Serves as the single entry point. Handles security headers (Helmet), cross-origin request policies (CORS), activity logs (Morgan), request proxying (express-http-proxy) forwarding JWT credentials, and aggregates Swagger documentations using a dropdown selector.
- **Auth Service (Port 5001)**: Registers credentials, hashes passwords (bcrypt), verifies logins, and manages refresh tokens. Exposes internal routes for verification and password updates.
- **User Management Service (Port 5002)**: Governs profiles (first/last names, departments), initiates password resets (UUID token generation), and processes soft-deletions.
- **Fire Extinguisher Service (Port 5003)**: Tracks physical equipment (serial numbers, sizes, types, locations). Dynamically marks items expired on read and generates warning flags for items expiring soon.
- **Inspection & Maintenance Service (Port 5004)**: Manages calendar scheduling, maps inspector IDs, tracks overdue items, completed inspections, and log maintenance activities restoring extinguishers to active states.
- **Report Service (Port 5005)**: Dynamically aggregates live status data from the Extinguisher and Inspection databases. Utilizes a 5-minute cache buffer, and generates exportable PDF documents (via PDFKit) and CSV grids (via csv-writer).
- **Notification Service (Port 5006)**: Maintains unread counts, registers read receipts, and delivers dispatch logs for scheduling actions, overdue alerts, resets, and completions.

---

## 4. Prerequisites
- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14.0.0 or higher
- **NPM**: v8.0.0 or higher

---

## 5. Setup Steps

1. **Clone the Repository & Install Dependencies**:
   ```bash
   npm install
   ```
2. **Setup Databases**:
   Ensure PostgreSQL is running, then log into your PostgreSQL shell and create the target databases:
   ```sql
   CREATE DATABASE tzw_auth_db;
   CREATE DATABASE tzw_user_db;
   CREATE DATABASE tzw_ext_db;
   CREATE DATABASE tzw_insp_db;
   CREATE DATABASE tzw_rpt_db;
   CREATE DATABASE tzw_notif_db;
   ```
3. **Configure Environment Variables**:
   Copy the root-level `.env.example` into a new file called `.env` at the monorepo root. Note that service directories will automatically read this or their local configs.
   ```bash
   cp .env.example .env
   ```
4. **Run Migrations**:
   Run all Prisma migrations to compile schema definitions and generate custom clients locally:
   ```bash
   npm run migrate:all
   ```
5. **Seed Databases**:
   Insert the complete mock dataset of users, profiles, extinguishers, inspections, logs, and notification entries:
   ```bash
   npm run seed
   ```
6. **Start All Services**:
   Spin up the API Gateway and the 6 microservices concurrently in watch-mode:
   ```bash
   npm run dev
   ```

---

## 6. Environment Variables

| Variable | Description | Example / Default |
|---|---|---|
| `NODE_ENV` | Running environment | `development` |
| `JWT_SECRET` | Secret key used to sign JWT access tokens | `supersecretjwtkey12345` |
| `JWT_EXPIRES_IN` | Duration of access token validity | `15m` |
| `REFRESH_TOKEN_SECRET` | Secret key used to sign JWT refresh tokens | `supersecretrefreshkey12345` |
| `REFRESH_TOKEN_EXPIRES_IN` | Duration of refresh token validity | `7d` |
| `INTERNAL_API_KEY` | Header key used to authorize internal Axios inter-service calls | `supersecretinternalkey` |
| `GATEWAY_PORT` | Port for the API Gateway entry point | `5000` |
| `*_PORT` | Independent ports for services | `5001-5006` |
| `*_DATABASE_URL` | PostgreSQL connection strings (URLs contain URL-encoded comma `%2C`) | `postgresql://postgres:kk123%2C4@localhost:5432/tzw_auth_db` |

---

## 7. Database Migration

Prisma migrations can be run globally or per-service:
- **Run all migrations globally**: `npm run migrate:all`
- **Auth Service**: `npm run migrate:auth` or `npm run migrate --workspace=services/auth-service`
- **User Management**: `npm run migrate:users` or `npm run migrate --workspace=services/user-management-service`
- **Extinguishers**: `npm run migrate:ext` or `npm run migrate --workspace=services/extinguisher-service`
- **Inspections**: `npm run migrate:insp` or `npm run migrate --workspace=services/inspection-service`
- **Reports**: `npm run migrate:report` or `npm run migrate --workspace=services/report-service`
- **Notifications**: `npm run migrate:notif` or `npm run migrate --workspace=services/notification-service`

---

## 8. Running Locally

- Run all services simultaneously: `npm run dev`
- Run Gateway only: `npm run dev:gateway`
- Run Auth only: `npm run dev:auth`
- Run Users only: `npm run dev:users`
- Run Extinguishers only: `npm run dev:ext`
- Run Inspections only: `npm run dev:insp`
- Run Reports only: `npm run dev:report`
- Run Notifications only: `npm run dev:notif`

---

## 9. API Endpoints Summary

### Auth Service (Port 5001)
- `POST /api/auth/register` - Create user credentials.
- `POST /api/auth/login` - Authenticate user; returns tokens.
- `POST /api/auth/refresh` - Rotate access token.
- `POST /api/auth/logout` - Invalidate refresh token.
- `GET /api/auth/me` - Read own user credentials.

### User Management Service (Port 5002)
- `GET /api/users` - List user profiles (Admin only).
- `GET /api/users/:id` - Fetch user profile.
- `PUT /api/users/:id` - Update user profile.
- `POST /api/users/:id/change-password` - Update password.
- `POST /api/users/forgot-password` - Request a password reset token.
- `POST /api/users/reset-password` - Reset password using token.
- `DELETE /api/users/:id` - Soft-delete user (Admin only).

### Extinguisher Service (Port 5003)
- `POST /api/extinguishers` - Register new extinguisher (Admin/Inspector).
- `GET /api/extinguishers` - List extinguishers (with status, type, and building filters).
- `GET /api/extinguishers/:id` - Fetch extinguisher detail.
- `PUT /api/extinguishers/:id` - Update extinguisher (Admin/Inspector).
- `DELETE /api/extinguishers/:id` - Remove record (Admin only).
- `GET /api/extinguishers/expired` - List expired items.
- `GET /api/extinguishers/expiring-soon` - List items expiring within 30 days.
- `PATCH /api/extinguishers/:id/status` - Change status only (Admin/Inspector).

### Inspection Service (Port 5004)
- `POST /api/inspections` - Schedule inspection.
- `GET /api/inspections` - List inspections (filters by status/dates).
- `GET /api/inspections/:id` - Fetch inspection.
- `PUT /api/inspections/:id` - Update schedule (Admin/Inspector).
- `PATCH /api/inspections/:id/complete` - Complete inspection (Inspector only).
- `DELETE /api/inspections/:id` - Cancel inspection (Admin only).
- `POST /api/inspections/:id/maintenance` - Log maintenance for inspection (Inspector only).
- `GET /api/inspections/maintenance` - List all maintenance logs.
- `GET /api/inspections/:id/maintenance` - Get log by inspection.

### Report Service (Port 5005)
- `GET /api/reports/inventory` - Get cached inventory status.
- `GET /api/reports/inventory/daily` - Daily inventory statistics.
- `GET /api/reports/inventory/monthly` - Monthly inventory statistics.
- `GET /api/reports/inventory/yearly` - Yearly inventory statistics.
- `GET /api/reports/inspections` - Get cached inspection status.
- `GET /api/reports/compliance` - Get cached compliance rates.
- `GET /api/reports/maintenance` - Get cached maintenance frequency.
- `POST /api/reports/:type/export` - Trigger PDF/CSV generation.
- `GET /api/reports/exports/:jobId` - Check export file generation status.
- `GET /api/reports/exports/download/:filename` - Download generated file.

### Notification Service (Port 5006)
- `GET /api/notifications` - Retrieve own notifications.
- `GET /api/notifications/unread-count` - Get count of unread logs.
- `PATCH /api/notifications/:id/read` - Mark notification as read.
- `PATCH /api/notifications/read-all` - Mark all notifications as read.
- `DELETE /api/notifications/:id` - Remove notification entry.

---

## 10. Example API Flow (End-to-End)

```
1. POST http://localhost:5000/api/auth/register          → Create user credentials
2. POST http://localhost:5000/api/auth/login             → Receive Access + Refresh tokens
3. POST http://localhost:5000/api/extinguishers          → Register extinguisher (ADMIN/INSPECTOR)
4. POST http://localhost:5000/api/inspections            → Schedule inspection (notifies inspector)
5. PATCH http://localhost:5000/api/inspections/:id/complete → Inspector marks inspection as COMPLETED
6. POST http://localhost:5000/api/inspections/:id/maintenance → Log maintenance details (restores status to ACTIVE, sends notification)
7. GET http://localhost:5000/api/reports/compliance      → Fetch compliance status report
8. POST http://localhost:5000/api/reports/compliance/export → Request PDF export of the compliance report
9. GET http://localhost:5000/api/notifications           → Retrieve own notifications list
10. PATCH http://localhost:5000/api/notifications/:id/read → Mark notification as read
```

---

## 11. Export Features

Generating and downloading exports follows a job-queue layout:
1. **Trigger Generation**: Send a `POST` request to `/api/reports/:type/export` specifying `{ "format": "PDF" }` (or `"CSV"`).
2. **Retrieve Job Status**: The response returns a `jobId` and a state of `PROCESSING`.
3. **Verify and Download**: Fetch job details using `GET /api/reports/exports/:jobId`. Once the status is `DONE`, access the `fileUrl` (e.g. `/api/reports/exports/download/:jobId.pdf`) to retrieve the generated file.

---

## 12. Roles & Permissions

| Endpoint Path | Method | Allowed Roles |
|---|---|---|
| `/api/auth/register` | `POST` | Public |
| `/api/auth/login` | `POST` | Public |
| `/api/users` | `GET` | `ADMIN` |
| `/api/users/:id` | `GET`, `PUT` | `ADMIN` or own user |
| `/api/users/:id` | `DELETE` | `ADMIN` |
| `/api/extinguishers` | `POST`, `PUT`, `PATCH` | `ADMIN`, `INSPECTOR` |
| `/api/extinguishers` | `GET` | All Authenticated |
| `/api/extinguishers/:id` | `DELETE` | `ADMIN` |
| `/api/inspections` | `POST` | All Authenticated |
| `/api/inspections/:id` | `PUT` | `ADMIN`, `INSPECTOR` |
| `/api/inspections/:id/complete` | `PATCH` | `INSPECTOR` |
| `/api/inspections/:id/maintenance` | `POST` | `INSPECTOR` |
| `/api/inspections/:id` | `DELETE` | `ADMIN` |
| `/api/reports/**` | `GET`, `POST` | `ADMIN`, `INSPECTOR` |
| `/api/notifications/**` | `GET`, `PATCH`, `DELETE`| All Authenticated |
