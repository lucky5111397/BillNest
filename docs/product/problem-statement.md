# Brightloop Product Problem Statement & Functional Requirements

## 1. Executive Summary

Brightloop is a specialized Subscription Management System designed to handle end-to-end recurring billing lifecycles, structured quotations, product catalog management, and manual payment reconciliation for modern businesses. The platform simplifies complex pricing models, supports varied recurring billing intervals, and provides fast operational visibility into subscription metrics.

---

## 2. Problem Statement

Growing B2B and SaaS businesses often struggle with fragmented billing workflows:

- Disconnected quoting, invoicing, and subscription tracking tools.
- Rigid billing engines unable to support hybrid pricing (fixed plans + variable usage/variants) across diverse intervals (daily, weekly, monthly, yearly).
- Inflexible payment collection environments requiring manual recording and bank reconciliation alongside automated systems.
- Sluggish dashboards and analytical lag that hinder day-to-day operational decisions.

Brightloop solves these pain points by offering a unified, high-performance modular subscription platform.

---

## 3. Core Requirements (Brief Alignment)

### 3.1 Role-Based Access Control (RBAC)

- Multi-user administrative access with granular permissions.
- Distinct roles: Super Admin, Billing Manager, Sales Representative, Support Agent, and Customer Viewer.
- Audit logs for financial actions and status transitions.

### 3.2 Product and Variant Catalog

- Centralized management of products, services, and add-ons.
- Support for multi-dimensional variants (e.g., tier, storage capacity, seats, geographic region).
- Base price overrides per variant.

### 3.3 Flexible Recurring Billing Plans

- Interval frequencies supported natively: **Daily, Weekly, Monthly, and Yearly**.
- Trial periods, setup fees, and renewal grace periods.
- Plan upgrade, downgrade, pause, resume, and cancellation mechanics.

### 3.4 Quotation Templates and Lifecycle

- Standardized and customizable quotation templates.
- Configurable line items referencing catalog products, custom terms, discounts, and applicable taxes.
- Multi-state quotation lifecycle: `Draft` -> `Sent` -> `Accepted` -> `Converted to Subscription` or `Declined` / `Expired`.

### 3.5 Subscription Lifecycle Management

- Automated recurring billing calculations based on the selected plan cadence.
- Pro-rata calculations for mid-cycle plan changes.
- Churn and lifecycle tracking (`Active`, `Past Due`, `Paused`, `Cancelled`, `Expired`).

### 3.6 Invoices, Taxes, and Discounts

- Recurring invoice generation tied to active subscriptions.
- Tax engine supporting multiple tax rates, jurisdictions, and inclusive/exclusive calculations.
- Discount engine supporting percentage-based, fixed-amount, and time-limited promo codes.
- Invoice states: `Draft`, `Issued`, `Paid`, `Partially Paid`, `Void`, and `Overdue`.

### 3.7 Manual Payment Recording and Reconciliation

- Recording of off-platform payments (wire transfers, checks, direct bank deposits, physical cash, POS receipts).
- Transaction ledger capturing payment reference, date, amount, currency, and recorded-by user.
- Partial payment allocations across one or more open invoices.

### 3.8 Performance and Analytics Standards

- Operational requirement: All core operational queries, dashboard summaries, and report generation must render in **under two (2.0) seconds**.
- Core metrics tracked: Monthly Recurring Revenue (MRR), Annual Recurring Revenue (ARR), Churn Rate, Average Revenue Per Account (ARPU), and Outstanding Receivables.

---

## 4. Requirements vs. Implementation Assumptions

| Dimension             | Mandatory Brief Requirement                  | Phase 0 / Implementation Assumption                                                                        |
| :-------------------- | :------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| **Architecture**      | High performance (<2s response time)         | Modular monolith architecture built with Node.js/Express, PostgreSQL, and Prisma                           |
| **Payment Gateways**  | Manual payment recording                     | External gateways (Stripe, Razorpay, etc.) are future optional connectors, NOT Phase 0 dependencies        |
| **Billing Scheduler** | Automated recurring invoices                 | Background worker queue (e.g., BullMQ + Redis) will be introduced in the billing engine phase, not Phase 0 |
| **Frontend UI**       | Clean, fast, accessible management interface | React + Vite + Tailwind CSS + shadcn/ui shell with TanStack Query for caching and caching invalidation     |
