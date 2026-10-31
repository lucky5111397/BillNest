# ADR 0002: Migration to MongoDB Atlas and Mongoose

## Status

Accepted

## Context

In the initial Phase 0 foundation, PostgreSQL with Prisma ORM was selected as the persistence tier. However, as the domain requirements for subscription management and pricing catalogs evolved, the following operational and architectural factors prompted a re-evaluation:

1. **Flexible Catalog & Variant Schemas**: Subscription products, variant attributes (seats, bandwidth, storage, geographic tiers), and custom quotation structures benefit significantly from document-based representations and embedded subdocuments.
2. **Operational Simplicity**: Managed MongoDB Atlas cloud clusters provide built-in high availability, automated scaling, and replica set topology without requiring developers to manage local database container volumes or run manual SQL migration scripts.
3. **Transaction Support**: Modern MongoDB Atlas deployments operate as replica sets, providing full multi-document ACID transactions via client sessions (`session.withTransaction()`). This satisfies all consistency requirements for financial invoice generation and payment allocations.

## Decision

We migrate the persistence layer from PostgreSQL + Prisma to **MongoDB Atlas** with **Mongoose 9.x** as the sole Object Document Mapper (ODM).

### Key Architectural Guidelines:

1. **Sole ODM**: Mongoose is the only data mapper. Prisma and `@prisma/client` are completely removed from the backend.
2. **Centralized Connection Manager**: All Mongoose interactions flow through a singleton connection manager (`server/src/config/database.ts`). Connections are not created per-request.
3. **Connection Pooling**: Configured with standard enterprise defaults:
   - `maxPoolSize`: 10
   - `minPoolSize`: 0
   - `serverSelectionTimeoutMS`: 5000
   - `maxIdleTimeMS`: 30000
   - `autoIndex`: Disabled in production environments.
4. **Offline Testability**: Unit and integration test suites run entirely without requiring network access to private MongoDB Atlas clusters. Mocks and state stubs isolate the test suite, ensuring CI pipelines remain deterministic and secret-free.
5. **Safe Diagnostics**: A safe verification tool (`npm run db:check --workspace=server`) performs TCP handshake, cluster authentication, and ping verification without exposing connection credentials or printing raw URIs.

## Consequences & Trade-offs

### Positive:

- Eliminates schema migration compilation overhead (`prisma generate`) in CI and local workflows.
- High write performance with embedded subdocuments for high-cohesion entities (`InvoiceLineItem` in `Invoice`, `QuotationLineItem` in `Quotation`).
- Streamlined environment setup: zero local container requirements when connecting directly to Atlas dev clusters.
- Safe error classification prevents credential leaks in application logs.

### Negative / Mitigations:

- **Local Multi-Document Transactions**: If developers run offline local MongoDB instances instead of Atlas, they must configure a replica set (`--replSet rs0`); standalone MongoDB instances do not support multi-document transactions.
  - _Mitigation_: Documented in `compose.yaml` and architecture guides that MongoDB Atlas is the primary database tier.
- **Relational Integrity Guarantees**: MongoDB does not enforce relational database-level foreign key constraints.
  - _Mitigation_: Mongoose schema validation, domain service layer orchestration, and Mongoose population references enforce referential integrity at the application boundary.
