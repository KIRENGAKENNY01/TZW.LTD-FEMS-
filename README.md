<div align="center">

# 🔥 TZW FEMS
### Fire Extinguisher Management System

**A full-stack, enterprise-grade microservices platform for managing fire extinguisher inventory, inspections, maintenance, and compliance reporting.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Database Design](#-database-design)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Services & Ports](#-api-services--ports)
- [User Roles & Permissions](#-user-roles--permissions)
- [Default Credentials](#-default-credentials)
- [Database Migrations & Seeding](#-database-migrations--seeding)
- [Scripts Reference](#-scripts-reference)

---

## 🔍 Overview

**TZW FEMS** (Fire Extinguisher Management System) is a production-ready, role-based web platform developed for **TZW Ltd** to digitize and automate the full lifecycle of fire extinguisher management — from acquisition and inventory tracking, through scheduled inspections and maintenance logging, to compliance reporting and audit exports.

The system is built as a **microservices monorepo** with a decoupled Next.js frontend, an API Gateway, and six independent backend services — each with its own PostgreSQL database and Prisma ORM schema.

---

## 🏗 System Architecture

The diagram below shows the full microservice topology, API routes exposed through the gateway, and inter-service communication flows.

![TZW FEMS System Architecture](TZW%20LTD%20FireExtiguisherManagementSystem-2026-06-03-115943.png)

### Service Map

| Service | Port | Responsibility |
|---------|------|---------------|
| **API Gateway** | `5000` | Single entry point — routes, CORS, Swagger aggregation |
| **Auth Service** | `5001` | Registration, login, JWT access/refresh tokens, password reset |
| **User Management Service** | `5002` | User profiles, CRUD, role management |
| **Extinguisher Service** | `5003` | Fire extinguisher inventory, status tracking, assignments |
| **Inspection Service** | `5004` | Inspection scheduling, approval, completion, maintenance logs |
| **Report Service** | `5005` | Analytics, PDF/CSV export, inventory & compliance reports |
| **Notification Service** | `5006` | In-app notifications (inspection assigned, expiry alerts, etc.) |
| **Frontend (Next.js)** | `6006` | Role-based dashboard UI — Admin, Inspector, User |

---

## 🗄 Database Design

Each microservice owns its own isolated PostgreSQL database. The entity-relationship diagram below shows all tables, fields, types, and relationships across the system.

![TZW FEMS Database Design](TZW%20LTD%20database%20design-2026-06-04-091940.png)

### Databases

| Database | Service |
|----------|---------|
| `tzw_auth_db` | Auth Service — users, refresh tokens, password resets |
| `tzw_user_db` | User Management Service — user profiles |
| `tzw_ext_db` | Extinguisher Service — fire extinguishers |
| `tzw_insp_db` | Inspection Service — inspections, maintenance logs |
| `tzw_rpt_db` | Report Service — report cache, export jobs |
| `tzw_notif_db` | Notification Service — notifications |

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with access + refresh token rotation
- Role-based access control (ADMIN / INSPECTOR / USER)
- Password reset via secure token
- Cookie-based session persistence with automatic token refresh

### 🧯 Extinguisher Inventory Management
- Register, edit, and decommission fire extinguishers
- Track type (CO₂, Water, Foam, Dry Chemical), size, location, building, floor
- Monitor statuses: `ACTIVE`, `INACTIVE`, `EXPIRED`, `UNDER_MAINTENANCE`
- Auto-detect expiring extinguishers (within 30 days)
- Assign extinguishers to users and inspectors

### 📋 Inspection Lifecycle
- **Users** request inspections for their extinguishers
- **Admins** approve requests and assign them to inspectors
- **Inspectors** complete inspections, log results (`PASS` / `NEEDS_MAINTENANCE`)
- Overdue inspection tracking and status filtering
- Full inspection history per extinguisher

### 🔧 Maintenance Logging
- Inspectors log maintenance activities after completing inspections
- Record: action taken, issues identified, recommendations, conditions noted, maintenance date
- Full maintenance history linked to extinguishers and inspections

### 📊 Reports & Analytics
- **Inventory Report** — total stock counts (Daily / Monthly / Yearly)
- **Inspection Status Report** — pass/fail/overdue breakdown
- **Expired Extinguishers Report** — compliance tracking
- **Maintenance History Report** — full audit trail
- Export to **PDF** and **CSV** with date-range filtering

### 🔔 Notifications
- Real-time in-app notifications for:
  - Inspection scheduled/assigned
  - Inspection overdue
  - Maintenance completed
  - Extinguisher expiry alerts
- Unread count badge in dashboard header

### 📦 Extinguisher Requests
- Users submit requests for new, replacement, or installation
- Admins review and approve/reject with comments
- Optional: auto-create extinguisher record on approval with serial number assignment

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js 18+** | Runtime |
| **Express.js** | HTTP framework for each microservice |
| **Prisma ORM** | Database schema, migrations, typed queries |
| **PostgreSQL 15+** | Primary database (one per service) |
| **JSON Web Tokens (JWT)** | Stateless authentication |
| **bcrypt** | Password hashing |
| **PDFKit** | PDF report generation |
| **json2csv** | CSV report generation |
| **Swagger / OpenAPI** | Auto-generated API documentation |
| **express-http-proxy** | API Gateway request proxying |
| **helmet + cors** | Security middleware |
| **morgan** | HTTP request logging |
| **Joi** | Request schema validation |
| **concurrently** | Run all microservices simultaneously |

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework (App Router) |
| **TypeScript** | Type-safe frontend code |
| **Tailwind CSS** | Utility-first styling |
| **Axios** | HTTP client for API calls |
| **React Context API** | Global auth state management |

---

## 📁 Project Structure

```
RESTFUL/
├── .gitignore                          # Root gitignore (monorepo-wide)
├── README.md                           # This file
├── frontend/
│   └── FEMS/                           # Next.js 15 frontend
│       ├── app/
│       │   ├── dashboard/              # Protected dashboard pages
│       │   ├── login/                  # Auth pages
│       │   └── register/
│       ├── components/fems/
│       │   ├── auth/                   # Login / Register forms
│       │   ├── dashboard/
│       │   │   ├── admin/              # Admin dashboard
│       │   │   ├── inspector/          # Inspector dashboard + Maintenance modal
│       │   │   ├── user/               # User dashboard
│       │   │   └── views/              # Shared view components (Extinguishers, Inspections, Reports…)
│       │   ├── landing/                # Public marketing landing page
│       │   ├── layout/                 # Sidebar, DashboardShell
│       │   └── shared/                 # DataTable, Pagination, StatusBadge, etc.
│       └── lib/
│           ├── api/                    # Typed API client functions
│           └── context/                # AuthContext (JWT session management)
│
└── tzw-fems/                           # Backend monorepo (npm workspaces)
    ├── api-gateway/                    # Express gateway — port 5000
    ├── shared/                         # Shared middleware, utilities, validation
    ├── scripts/
    │   └── seed.js                     # Database seeder
    └── services/
        ├── auth-service/               # Port 5001
        ├── user-management-service/    # Port 5002
        ├── extinguisher-service/       # Port 5003
        ├── inspection-service/         # Port 5004
        ├── report-service/             # Port 5005
        └── notification-service/       # Port 5006
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 18.x`
- **PostgreSQL** `>= 15` running locally
- **npm** `>= 9.x`
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/KIRENGAKENNY01/TZW.LTD-FEMS-.git
cd TZW.LTD-FEMS-
```

### 2. Set Up the Backend

```bash
cd tzw-fems

# Install all workspace dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Run all database migrations
npm run migrate:all

# Generate Prisma clients for all services
npx prisma generate --schema=services/auth-service/prisma/schema.prisma
npx prisma generate --schema=services/user-management-service/prisma/schema.prisma
npx prisma generate --schema=services/extinguisher-service/prisma/schema.prisma
npx prisma generate --schema=services/inspection-service/prisma/schema.prisma
npx prisma generate --schema=services/report-service/prisma/schema.prisma
npx prisma generate --schema=services/notification-service/prisma/schema.prisma

# Seed the database with initial data
npm run seed

# Start all services
npm run dev
```

### 3. Set Up the Frontend

```bash
cd frontend/FEMS

# Install dependencies
npm install

# Configure environment
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Start development server
npm run dev
```

### 4. Open the Application

| URL | Description |
|-----|-------------|
| `http://localhost:6006` | Frontend application |
| `http://localhost:6006/dashboard` | Role-based dashboard |
| `http://localhost:5000/api-docs` | Aggregated Swagger API docs |
| `http://localhost:5000/health` | System health check |

---

## 🔐 Environment Variables

### Backend (`tzw-fems/.env`)

```env
# PostgreSQL connection strings
AUTH_DATABASE_URL="postgresql://postgres:password@localhost:5432/tzw_auth_db"
USER_DATABASE_URL="postgresql://postgres:password@localhost:5432/tzw_user_db"
EXT_DATABASE_URL="postgresql://postgres:password@localhost:5432/tzw_ext_db"
INSP_DATABASE_URL="postgresql://postgres:password@localhost:5432/tzw_insp_db"
RPT_DATABASE_URL="postgresql://postgres:password@localhost:5432/tzw_rpt_db"
NOTIF_DATABASE_URL="postgresql://postgres:password@localhost:5432/tzw_notif_db"

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Ports
GATEWAY_PORT=5000
AUTH_PORT=5001
USER_PORT=5002
EXT_PORT=5003
INSP_PORT=5004
REPORT_PORT=5005
NOTIF_PORT=5006

# Internal service communication
INTERNAL_API_KEY=your_internal_api_key
```

### Frontend (`frontend/FEMS/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🌐 API Services & Ports

All routes are accessible via the **API Gateway at port 5000**.

| Route Prefix | Service | Key Endpoints |
|---|---|---|
| `/api/auth` | Auth Service | `POST /login`, `POST /register`, `POST /refresh`, `POST /logout` |
| `/api/users` | User Service | `GET /users`, `GET /users/:id`, `PUT /users/:id` |
| `/api/extinguishers` | Extinguisher Service | `GET/POST /extinguishers`, `PUT/DELETE /extinguishers/:id` |
| `/api/inspections` | Inspection Service | `GET/POST /inspections`, `PATCH /inspections/:id/approve`, `PATCH /inspections/:id/complete` |
| `/api/inspections/:id/maintenance` | Inspection Service | `POST` — log maintenance activity |
| `/api/reports` | Report Service | `GET /inventory`, `GET /inspections`, `GET /compliance`, `GET /maintenance` |
| `/api/reports/export` | Report Service | `POST` — generate PDF/CSV export |
| `/api/notifications` | Notification Service | `GET /notifications`, `PATCH /notifications/:id/read` |
| `/api-docs` | API Gateway | Aggregated Swagger UI for all services |
| `/health` | API Gateway | System-wide health check |

---

## 👥 User Roles & Permissions

| Feature | Admin | Inspector | User |
|---------|:-----:|:---------:|:----:|
| View all extinguishers | ✅ | ✅ | ✅ (own) |
| Register/edit extinguishers | ✅ | ✅ | ❌ |
| Delete extinguishers | ✅ | ❌ | ❌ |
| Request inspection | ❌ | ❌ | ✅ |
| Approve & assign inspection | ✅ | ❌ | ❌ |
| Complete inspection | ❌ | ✅ | ❌ |
| Log maintenance activity | ❌ | ✅ | ❌ |
| View reports | ✅ | ❌ | ❌ |
| Export PDF/CSV reports | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| View notifications | ✅ | ✅ | ✅ |
| Submit extinguisher requests | ✅ | ✅ | ✅ |
| Review/approve requests | ✅ | ❌ | ❌ |

---

## 🔑 Default Credentials

After running `npm run seed` in the `tzw-fems` directory:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@tzw.com` | `Admin1234!` |
| **Inspector** | `inspector1@tzw.com` | `Insp1234!` |
| **Inspector** | `inspector2@tzw.com` | `Insp1234!` |
| **User** | `user1@tzw.com` | `User1234!` |
| **User** | `user2@tzw.com` | `User1234!` |

> ⚠️ **Change all default credentials before deploying to production.**

---

## 🗃 Database Migrations & Seeding

### Run Migrations

```bash
cd tzw-fems

# Migrate a single service
npm run migrate:auth
npm run migrate:users
npm run migrate:ext
npm run migrate:insp
npm run migrate:report
npm run migrate:notif

# Migrate all at once
npm run migrate:all
```

### Seed the Database

```bash
cd tzw-fems
npm run seed
```

The seed script creates:
- 5 users (1 Admin, 2 Inspectors, 2 Users)
- 10 fire extinguishers (2 expired, 2 expiring soon, 6 active)
- 5 inspections (completed, pending, overdue states)
- 1 maintenance log
- 5 notifications

---

## 📜 Scripts Reference

### Backend (`tzw-fems/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all 7 services concurrently |
| `npm run dev:gateway` | Start API Gateway only (port 5000) |
| `npm run dev:auth` | Start Auth Service only (port 5001) |
| `npm run dev:users` | Start User Service only (port 5002) |
| `npm run dev:ext` | Start Extinguisher Service only (port 5003) |
| `npm run dev:insp` | Start Inspection Service only (port 5004) |
| `npm run dev:report` | Start Report Service only (port 5005) |
| `npm run dev:notif` | Start Notification Service only (port 5006) |
| `npm run migrate:all` | Run all Prisma migrations |
| `npm run seed` | Seed all databases with demo data |

### Frontend (`frontend/FEMS/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server on port 6006 |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |

---

## 🏢 About

**TZW FEMS** was built for **TZW Ltd** to replace manual fire safety compliance processes with a modern, digital, role-driven platform that ensures every extinguisher is tracked, every inspection is logged, and every compliance report is audit-ready.

---

<div align="center">

**Built with ❤️ by Kenny.K**

</div>
