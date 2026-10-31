# BillNest Database Design & Domain Model

## 1. Overview and Data Integrity Principles

BillNest operates as a core subscription management and financial billing system of record. The persistence layer is powered by **MongoDB Atlas** with **Mongoose 9.x** as the Object Document Mapper (ODM).

Although MongoDB is a document-oriented database, financial systems require strict transactional guarantees and data integrity:

1. **Document Modeling & Embeddings**: High-cohesion sub-entities (such as `InvoiceLineItem` within `Invoice` and `QuotationLineItem` within `Quotation`) are modeled as embedded subdocuments to ensure atomic single-document writes.
2. **Multi-Document ACID Transactions**: MongoDB Atlas clusters run natively as replica sets, providing multi-document ACID transactions via Mongoose client sessions (`session.withTransaction()`). This guarantees atomicity across subscription state updates, invoice creation, and payment allocations.
3. **Exact Currency Representation**: All monetary values are strictly stored as integers representing the smallest currency unit (e.g., cents, paise) to eliminate floating-point rounding errors.
4. **Immutable Financial Records**: Invoices, transactions, and payment allocations maintain immutable audit trails once finalized; statuses are tracked via state enums rather than hard deletions.
5. **Auditing**: Every Mongoose schema enforces `{ timestamps: true }`, capturing `createdAt` and `updatedAt`.
6. **Connection Pool Management**: Configured with sensible connection pool defaults (`maxPoolSize: 10`, `minPoolSize: 0`, `serverSelectionTimeoutMS: 5000`, `maxIdleTimeMS: 30000`).

---

## 2. Conceptual Domain Entities & Collections

```mermaid
erDiagram
    ORGANIZATION ||--o{ USER : contains
    ORGANIZATION ||--o{ CUSTOMER : owns
    ORGANIZATION ||--o{ PRODUCT : catalogs
    PRODUCT ||--o{ PRODUCT_VARIANT : has
    PRODUCT_VARIANT ||--o{ PLAN : prices
    CUSTOMER ||--o{ SUBSCRIPTION : holds
    PLAN ||--o{ SUBSCRIPTION : defines
    SUBSCRIPTION ||--o{ INVOICE : generates
    INVOICE ||--|{ INVOICE_LINE_ITEM : embeds
    INVOICE ||--o{ PAYMENT_ALLOCATION : receives
    PAYMENT ||--o{ PAYMENT_ALLOCATION : settles
    CUSTOMER ||--o{ PAYMENT : makes
    ORGANIZATION ||--o{ QUOTATION : issues
    QUOTATION ||--|{ QUOTATION_LINE_ITEM : embeds
```

### 2.1 Entity Responsibilities

- **organizations**: Multi-tenant namespace isolating customer data, product catalogs, and financial accounts.
- **users**: Administrative identities with hashed passwords, session tracking, and granular RBAC role assignments.
- **customers**: Billing identities, contact details, currency preferences, and billing addresses.
- **products & product_variants**: Catalog items representing tiers, add-ons, or services with dimensional price overrides.
- **plans**: Pricing rules binding a product/variant to recurrence intervals (`DAILY`, `WEEKLY`, `MONTHLY`, `YEARLY`).
- **quotations**: Formal price quotes with embedded line items for customer review before converting into subscriptions.
- **subscriptions**: Active recurring contracts governing renewal cadences, current state (`ACTIVE`, `PAST_DUE`, `PAUSED`, `CANCELLED`), and renewal dates.
- **invoices**: Itemized bills containing embedded `InvoiceLineItem` subdocuments.
- **payments & payment_allocations**: Manual or automated payment transactions mapped to invoices.
- **tax_rates & discounts**: Tax rules and promotional codes applied to line items and totals.

---

## 3. Implementation Boundary (Phase 0.5 Database Migration)

> [!IMPORTANT]
> In Phase 0.5, the database infrastructure was fully migrated from PostgreSQL/Prisma to **MongoDB Atlas + Mongoose**. No business domain collections have been created yet; schemas will be introduced incrementally across subsequent phases:

- **Phase 0.5 Scope (Completed)**:
  - Centralized Mongoose connection manager in `server/src/config/database.ts`.
  - Non-blocking connection lifecycle with connection promise reuse and event monitoring.
  - Safe error classification (`AUTHENTICATION_FAILED`, `TIMEOUT`, `NETWORK_OR_DNS_ERROR`).
  - Liveness (`/health/live`) and readiness (`/health/ready`) probes executing `{ ping: 1 }` against the database.
  - Verification diagnostic CLI script (`npm run db:check --workspace=server`).
  - Safe Zod environment parsing for `MONGODB_URI` with degraded startup support in development.
- **Deferred to Phase 1 (Auth & Users)**:
  - `User`, `Organization`, `RefreshToken`, `AuditLog`.
- **Deferred to Phase 2 (Catalog & Pricing)**:
  - `Product`, `ProductVariant`, `Plan`, `TaxRate`, `Discount`.
- **Deferred to Phase 3 (Subscriptions & Billing Engine)**:
  - `Customer`, `Quotation`, `Subscription`, `Invoice`, `Payment`.

---

## 4. Connection Verification and Atlas Configuration

To test and verify MongoDB Atlas connectivity:

1. Configure `MONGODB_URI` in `server/.env`:
   ```bash
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/billnest?retryWrites=true&w=majority
   ```
2. Verify Network Access in the MongoDB Atlas Console:
   - Ensure the IP address of the deployment host is included in the cluster's **Network Access IP Access List**.
   - Note: Never configure `0.0.0.0/0` in production environments; use specific IP addresses or VPC peering.
3. Run the non-destructive connection diagnostic tool:
   ```bash
   npm run db:check --workspace=server
   ```

_Note: Actual live Atlas connectivity remains unverified until a valid MONGODB_URI is configured and network whitelist access is confirmed._
