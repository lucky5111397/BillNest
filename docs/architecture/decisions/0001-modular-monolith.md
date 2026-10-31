# ADR 0001: Modular Monolith Architecture Selection

## Status

Accepted

## Context

Brightloop is a full-featured subscription management and billing system. Key functional modules include Identity & Access, Customer Accounts, Product Catalogs, Quotations, Subscription Lifecycles, Invoicing, Manual Payments, Taxes, and Analytics.

When designing the foundational architecture, we evaluated two architectural paradigms:

1. **Microservices Architecture**: Multiple independently deployed services for Auth, Catalog, Billing, Payments, and Reports communicating over gRPC or HTTP.
2. **Modular Monolith**: A unified codebase partitioned into strictly isolated domain modules sharing a relational database with clear service boundaries.

## Decision

We chose the **Modular Monolith** architecture for Brightloop.

### Rationale:

1. **Transaction Integrity**: Subscription creation, invoice generation, and payment ledger updates often require atomic ACID guarantees. In a microservices architecture, maintaining eventual consistency across distributed services requires complex saga patterns, two-phase commits, or distributed event buses, which drastically increases operational complexity and failure modes.
2. **Performance SLA (< 2 seconds)**: The product requirements mandate sub-two-second response times across core queries and analytical summaries. A modular monolith eliminates cross-network RPC latency and serialization overhead between modules.
3. **Developer Velocity**: In a hackathon and high-velocity team setting, a single repository with unified TypeScript types, centralized testing, and straightforward local container orchestration provides unmatched velocity.
4. **Refactoring Flexibility**: Early-stage domain boundaries are frequently refined. Refactoring module boundaries within a single codebase is orders of magnitude safer and faster than refactoring across disparate microservices.

## Consequences & Trade-offs

### Positive:

- Simplified CI/CD pipeline (single build and test pipeline).
- Straightforward local developer setup with a single Docker Compose PostgreSQL service.
- End-to-end type safety spanning backend domain models and frontend consumers.
- Native SQL relational joins and database transactions where strictly necessary.

### Negative / Mitigations:

- **Risk of coupling**: Developers might inadvertently couple modules by importing internal files across domain boundaries.
  - _Mitigation_: Strict architectural convention where modules only expose public API service interfaces (`modules/<module>/index.ts`).
- **Single Point of Deployment**: A defect in one module could impact the entire API server.
  - _Mitigation_: Comprehensive automated test suites, central error boundary middleware, and isolated health checks.

## Conditions for Future Service Extraction

A module may be extracted into an independent microservice only when:

1. **Distinct Scaling Dimension**: The module exhibits wildly different compute or memory scaling profiles (e.g., dedicated PDF invoice generation or high-throughput batch billing schedulers).
2. **Team Autonomy**: Dedicated engineering teams are formed around specific domains requiring isolated release cycles.
3. **Data Isolation**: The module's data can be cleanly separated into an isolated database without requiring distributed distributed transactions with the core ledger.
