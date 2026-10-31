import { CheckCircle2, Layers, Shield, Clock, Database, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Brightloop Subscription Management System
            </h2>
            <Badge variant="default" className="bg-blue-600 text-white">
              Phase 0 Foundation
            </Badge>
          </div>
          <p className="text-sm text-slate-600">
            Professional modular monolith architecture for automated recurring billing, quoting, and
            manual payment reconciliation.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-700 hover:underline font-medium flex items-center gap-1"
          >
            Repository Docs <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Foundational Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Modular Monolith</CardTitle>
              <Layers className="h-5 w-5 text-blue-600" />
            </div>
            <CardDescription>Domain-partitioned backend</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Express + TypeScript modular architecture. Modules maintain isolated domain boundaries
              and communicate through typed interfaces.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-700 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Strict service isolation</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Persistence Layer</CardTitle>
              <Database className="h-5 w-5 text-indigo-600" />
            </div>
            <CardDescription>PostgreSQL + Prisma ORM</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Local Docker PostgreSQL container with strict localhost binding, automated
              healthchecks, and type-safe migrations.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-700 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>ACID relational guarantees</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Quality & Security</CardTitle>
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
            <CardDescription>Pre-configured verification</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Strict TypeScript typechecking, Vitest test suites, Supertest API tests, and automated
              GitHub Actions CI pipeline.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-700 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Zero fabricated metrics</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Development Roadmap & Status Notice */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>System Roadmap & Implementation Boundary</CardTitle>
              <CardDescription>
                Phase 0 establishes foundational architecture only. Business features will unlock
                sequentially upon approval.
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-amber-500" />
              Awaiting Phase 1 Sign-Off
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border border-border bg-muted/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Phase 0
                </span>
                <Badge variant="success">Active</Badge>
              </div>
              <h4 className="font-semibold text-sm">Project Foundation</h4>
              <p className="text-xs text-muted-foreground">
                Workspaces, Tailwind + shadcn shell, Express API, health probes, Docker compose, CI
                gates.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-dashed border-border bg-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Phase 1
                </span>
                <Badge variant="outline">Planned</Badge>
              </div>
              <h4 className="font-semibold text-sm">Auth & RBAC</h4>
              <p className="text-xs text-muted-foreground">
                User models, secure sessions, password hashing, roles (Admin, Sales, Support), route
                guards.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-dashed border-border bg-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Phase 2
                </span>
                <Badge variant="outline">Planned</Badge>
              </div>
              <h4 className="font-semibold text-sm">Catalog & Pricing</h4>
              <p className="text-xs text-muted-foreground">
                Products, multi-variant pricing, daily/weekly/monthly/yearly plans, taxes &
                discounts.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-dashed border-border bg-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Phase 3
                </span>
                <Badge variant="outline">Planned</Badge>
              </div>
              <h4 className="font-semibold text-sm">Subscriptions & Billing</h4>
              <p className="text-xs text-muted-foreground">
                Quotes lifecycle, recurring billing engine, invoices, manual payment ledger,
                receipts.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-amber-50/50 border border-amber-200 text-xs text-amber-800 flex items-start justify-between">
            <div>
              <p className="font-semibold">Notice regarding operational analytics:</p>
              <p className="text-amber-700 mt-0.5">
                Financial metrics (MRR, ARR, active subscriber churn) are deliberately omitted
                during Phase 0 to ensure zero fabricated or placeholder numbers. Real-time metrics
                will render once Phase 3 billing data is live.
              </p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 bg-white hover:bg-amber-100/50">
              View Architecture Spec
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
