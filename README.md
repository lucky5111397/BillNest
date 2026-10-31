# Brightloop — Subscription Management System

[![CI](https://github.com/brightloop/billnest/actions/workflows/ci.yml/badge.svg)](https://github.com/brightloop/billnest/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Brightloop is a high-performance, modular subscription management platform engineered to automate recurring billing lifecycles, structured quotations, multi-variant product pricing, and manual payment reconciliation.

---

## 1. Problem Being Solved

Modern B2B and SaaS businesses require adaptable billing operations that support diverse subscription cadences (daily, weekly, monthly, and yearly), flexible quoting lifecycles, and reliable manual payment reconciliation (bank wire transfers, checks, POS) without analytical lag. Brightloop unifies these mission-critical domains into a high-performance modular monolith with guaranteed sub-two-second query response times.

---

## 2. Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui component architecture, TanStack Query, React Router, Lucide icons.
- **Backend**: Node.js, Express, TypeScript, Zod schema validation.
- **Database & ORM**: PostgreSQL 16, Prisma ORM.
- **Testing**: Vitest, Supertest, Testing Library.
- **Monorepo & Tooling**: npm workspaces, ESLint, Prettier, Docker Compose, GitHub Actions.

---

## 3. Architecture

Brightloop follows a **Modular Monolith** architecture:

- `client`: Single-page client dashboard application.
- `server`: RESTful versioned API service (`/api/v1`) with isolated domain modules.
- `PostgreSQL`: Relational persistence layer ensuring transactional ACID guarantees.

For full architectural details, see [System Overview](docs/architecture/system-overview.md) and [ADR 0001: Modular Monolith](docs/architecture/decisions/0001-modular-monolith.md).

---

## 4. Repository Structure

```
/
├── client/                      # React + Vite + Tailwind + shadcn/ui SPA
│   ├── src/
│   │   ├── app/                 # Application entry and providers
│   │   ├── components/          # UI components & dashboard layout shell
│   │   ├── features/            # Domain features (landing, dashboard, etc.)
│   │   ├── lib/                 # Utilities and API client abstraction
│   │   └── styles/              # Tailwind and global design tokens
│   └── package.json
│
├── server/                      # Node.js + Express + TypeScript API service
│   ├── prisma/                  # Prisma schema and migrations
│   ├── src/
│   │   ├── config/              # Zod environment parsing and configuration
│   │   ├── middleware/          # Error, logger, and not-found middlewares
│   │   ├── modules/             # Domain business modules
│   │   ├── routes/              # Versioned routing and health probes
│   │   ├── app.ts               # Express application setup
│   │   └── server.ts            # Server HTTP listener bootstrap
│   ├── tests/                   # Unit and integration tests
│   └── package.json
│
├── docs/                        # Architecture, product specs, and workflows
├── .github/                     # Issue forms, PR templates, CI workflow, Dependabot
├── compose.yaml                 # Local PostgreSQL development container
└── package.json                 # Monorepo root scripts & npm workspaces
```

---

## 5. Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS) or later (Verified on Node `v24.x`)
- **npm**: `v10.x` or later
- **Docker & Docker Compose**: Required for running the local PostgreSQL container.

---

## 6. Getting Started

### 6.1 Clone and Install

```bash
# Clone the repository
git clone <repo-url>
cd BillNest

# Install workspace dependencies
npm install
```

### 6.2 Start Local Database

```bash
# Spin up PostgreSQL via Docker Compose
docker-compose up -d
# or using Docker CLI v2:
docker compose up -d

# Verify container health
docker-compose ps
```

### 6.3 Configure Environment Variables

Copy example environment templates for each workspace:

```bash
# Backend environment
cp server/.env.example server/.env

# Frontend environment
cp client/.env.example client/.env
```

### 6.4 Initialize Database Schema

```bash
# Run Prisma migrations and generate Prisma Client
npm run db:generate
# or:
npm run db:generate --workspace=server
npm run db:push --workspace=server
```

### 6.5 Launch Development Servers

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start individually:
npm run dev:api   # Runs backend on http://localhost:4000
npm run dev:web   # Runs frontend on http://localhost:5173
```

---

## 7. Verification and Testing

```bash
# Run all automated tests across workspaces
npm run test

# Run TypeScript typechecks
npm run typecheck

# Run ESLint across all packages
npm run lint

# Check code formatting with Prettier
npm run format:check
```

### Health Check Probes

- **Liveness Probe**: `GET http://localhost:4000/api/v1/health/live`
- **Readiness Probe**: `GET http://localhost:4000/api/v1/health/ready`

---

## 8. Development Status

- **Current Phase**: **Phase 0 (Project Foundation)** - Completed.
- **Next Phase**: **Phase 1 (Identity, Authentication & RBAC)**.
