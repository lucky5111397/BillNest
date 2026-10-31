import { connectDatabase, disconnectDatabase } from '../config/database';
import { getOrCreateDefaultOrganization } from '../utils/organization';
import { Product } from '../models/product.model';
import { Plan } from '../models/plan.model';
import { TaxRule } from '../models/tax-rule.model';
import { DiscountRule } from '../models/discount-rule.model';
import { Customer } from '../models/customer.model';
import { Quotation } from '../models/quotation.model';
import { Subscription } from '../models/subscription.model';
import { Invoice } from '../models/invoice.model';
import { Payment } from '../models/payment.model';
import { BankTransaction } from '../models/bank-transaction.model';
import { toMinorUnits } from '../utils/money';

export async function seedDemoData(): Promise<void> {
  console.log('--- Seeding BillNest Demo Workspace & Reference Ledgers ---');

  await connectDatabase();
  const org = await getOrCreateDefaultOrganization();
  const orgId = org._id;

  console.log(`[Seed] Using Organization: ${org.name} (${org.slug})`);

  // 1. Products & Variants
  const erpBasePrice = toMinorUnits(2000); // Base product price = 2000
  const odooAdjustment = toMinorUnits(560); // Odoo variant adjustment = 560 -> Final price = 2560

  const productErp = await Product.findOneAndUpdate(
    { organizationId: orgId, SKU: 'SKU-ERP-CORE' },
    {
      organizationId: orgId,
      name: 'Brightloop ERP Suite',
      SKU: 'SKU-ERP-CORE',
      type: 'SOFTWARE',
      description: 'Unified enterprise subscription & financial ledger operating system.',
      salesPrice: erpBasePrice,
      costPrice: toMinorUnits(450),
      currency: 'USD',
      status: 'ACTIVE',
      variants: [
        {
          name: 'Odoo Native Connector',
          brand: 'Odoo Engine',
          SKU: 'VAR-ERP-ODOO',
          priceAdjustment: odooAdjustment,
          active: true,
        },
        {
          name: 'SAP Enterprise Bridge',
          brand: 'SAP NetWeaver',
          SKU: 'VAR-ERP-SAP',
          priceAdjustment: toMinorUnits(1200),
          active: true,
        },
        {
          name: 'NetSuite Direct Sync',
          brand: 'Oracle NetSuite',
          SKU: 'VAR-ERP-NETSUITE',
          priceAdjustment: toMinorUnits(850),
          active: true,
        },
      ],
    },
    { upsert: true, new: true },
  );

  const productCloud = await Product.findOneAndUpdate(
    { organizationId: orgId, SKU: 'SKU-CLOUD-INFRA' },
    {
      organizationId: orgId,
      name: 'Cloud Infrastructure Platform',
      SKU: 'SKU-CLOUD-INFRA',
      type: 'SOFTWARE',
      description: 'Distributed microservice container and edge compute platform.',
      salesPrice: toMinorUnits(1500),
      costPrice: toMinorUnits(300),
      currency: 'USD',
      status: 'ACTIVE',
      variants: [
        {
          name: 'Multi-Region High Availability',
          brand: 'Anycast Grid',
          SKU: 'VAR-CLOUD-GEO',
          priceAdjustment: toMinorUnits(400),
          active: true,
        },
      ],
    },
    { upsert: true, new: true },
  );

  const productAi = await Product.findOneAndUpdate(
    { organizationId: orgId, SKU: 'SKU-AI-ANALYTICS' },
    {
      organizationId: orgId,
      name: 'AI Analytics & Copilot Add-on',
      SKU: 'SKU-AI-ANALYTICS',
      type: 'SERVICE',
      description: 'Autonomous financial anomaly detection and bank matching intelligence.',
      salesPrice: toMinorUnits(1500),
      costPrice: toMinorUnits(200),
      currency: 'USD',
      status: 'ACTIVE',
      variants: [],
    },
    { upsert: true, new: true },
  );

  const productSupport = await Product.findOneAndUpdate(
    { organizationId: orgId, SKU: 'SKU-SUPPORT-PRIORITY' },
    {
      organizationId: orgId,
      name: 'Dedicated Priority Support',
      SKU: 'SKU-SUPPORT-PRIORITY',
      type: 'SERVICE',
      description: '24/7/365 15-minute SLA dedicated technical account management.',
      salesPrice: toMinorUnits(498),
      costPrice: toMinorUnits(100),
      currency: 'USD',
      status: 'ACTIVE',
      variants: [],
    },
    { upsert: true, new: true },
  );

  console.log('[Seed] Products & Variants seeded.');

  // 2. Plans
  const planYearly = await Plan.findOneAndUpdate(
    { organizationId: orgId, name: 'Enterprise Yearly' },
    {
      organizationId: orgId,
      name: 'Enterprise Yearly',
      productId: productErp._id,
      pricing: erpBasePrice + odooAdjustment, // $2,560.00
      currency: 'USD',
      billingInterval: 'YEARLY',
      intervalCount: 1,
      minimumQuantity: 1,
      autoClose: false,
      allowEarlyClose: true,
      allowPause: true,
      allowRenewal: true,
      active: true,
    },
    { upsert: true, new: true },
  );

  const planMonthly = await Plan.findOneAndUpdate(
    { organizationId: orgId, name: 'Monthly Pro Plan' },
    {
      organizationId: orgId,
      name: 'Monthly Pro Plan',
      productId: productErp._id,
      pricing: toMinorUnits(1760), // $1,760.00 per seat/mo
      currency: 'USD',
      billingInterval: 'MONTHLY',
      intervalCount: 1,
      minimumQuantity: 5,
      autoClose: false,
      allowEarlyClose: true,
      allowPause: true,
      allowRenewal: true,
      active: true,
    },
    { upsert: true, new: true },
  );

  await Plan.findOneAndUpdate(
    { organizationId: orgId, name: 'Cloud Startup Monthly' },
    {
      organizationId: orgId,
      name: 'Cloud Startup Monthly',
      productId: productCloud._id,
      pricing: toMinorUnits(990),
      currency: 'USD',
      billingInterval: 'MONTHLY',
      intervalCount: 1,
      minimumQuantity: 1,
      active: true,
    },
    { upsert: true, new: true },
  );

  await Plan.findOneAndUpdate(
    { organizationId: orgId, name: 'Micro Daily Compute' },
    {
      organizationId: orgId,
      name: 'Micro Daily Compute',
      productId: productCloud._id,
      pricing: toMinorUnits(15),
      currency: 'USD',
      billingInterval: 'DAILY',
      intervalCount: 1,
      minimumQuantity: 1,
      active: true,
    },
    { upsert: true, new: true },
  );

  await Plan.findOneAndUpdate(
    { organizationId: orgId, name: 'Weekly Maintenance Sprint' },
    {
      organizationId: orgId,
      name: 'Weekly Maintenance Sprint',
      productId: productSupport._id,
      pricing: toMinorUnits(250),
      currency: 'USD',
      billingInterval: 'WEEKLY',
      intervalCount: 1,
      minimumQuantity: 1,
      active: true,
    },
    { upsert: true, new: true },
  );

  console.log('[Seed] Plans seeded (Daily, Weekly, Monthly, Yearly).');

  // 3. Tax Rules
  await TaxRule.findOneAndUpdate(
    { organizationId: orgId, jurisdiction: 'US-CA' },
    {
      organizationId: orgId,
      name: 'California SaaS Sales Tax',
      rate: 7.25,
      jurisdiction: 'US-CA',
      inclusive: false,
      active: true,
    },
    { upsert: true, new: true },
  );

  await TaxRule.findOneAndUpdate(
    { organizationId: orgId, jurisdiction: 'IN-KA' },
    {
      organizationId: orgId,
      name: 'India GST Software Rate',
      rate: 18.0,
      jurisdiction: 'IN-KA',
      inclusive: false,
      active: true,
    },
    { upsert: true, new: true },
  );

  // 4. Discount Rules
  await DiscountRule.findOneAndUpdate(
    { organizationId: orgId, code: 'ENTERPRISE-2026' },
    {
      organizationId: orgId,
      name: 'Enterprise Contract 15% Waiver',
      code: 'ENTERPRISE-2026',
      type: 'PERCENTAGE',
      value: 15,
      minimumPurchase: toMinorUnits(1000),
      minimumQuantity: 1,
      usageLimit: 100,
      usedCount: 14,
      status: 'ACTIVE',
    },
    { upsert: true, new: true },
  );

  await DiscountRule.findOneAndUpdate(
    { organizationId: orgId, code: 'STARTUP500' },
    {
      organizationId: orgId,
      name: 'Startup Grant Flat Credit',
      code: 'STARTUP500',
      type: 'FIXED_AMOUNT',
      value: toMinorUnits(500),
      minimumPurchase: toMinorUnits(2000),
      minimumQuantity: 1,
      usageLimit: 50,
      usedCount: 8,
      status: 'ACTIVE',
    },
    { upsert: true, new: true },
  );

  console.log('[Seed] Tax & Discount Rules seeded.');

  // 5. Customers
  const customerAcme = await Customer.findOneAndUpdate(
    { organizationId: orgId, customerNumber: 'CUST-2026-0001' },
    {
      organizationId: orgId,
      customerNumber: 'CUST-2026-0001',
      businessName: 'Acme Logistics Ltd.',
      contactName: 'Marcus Vance',
      email: 'ops@acmelogistics.com',
      phone: '+1 (555) 234-8901',
      billingAddress: {
        street: '450 Lexington Ave, Fl 18',
        city: 'New York',
        state: 'NY',
        postalCode: '10017',
        country: 'USA',
      },
      status: 'ACTIVE',
    },
    { upsert: true, new: true },
  );

  const customerNova = await Customer.findOneAndUpdate(
    { organizationId: orgId, customerNumber: 'CUST-2026-0002' },
    {
      organizationId: orgId,
      customerNumber: 'CUST-2026-0002',
      businessName: 'Nova Systems LLC',
      contactName: 'Elena Rostova',
      email: 'billing@novasystems.io',
      phone: '+1 (555) 872-3319',
      billingAddress: {
        street: '800 Congress Ave',
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        country: 'USA',
      },
      status: 'ACTIVE',
    },
    { upsert: true, new: true },
  );

  const customerCloudnest = await Customer.findOneAndUpdate(
    { organizationId: orgId, customerNumber: 'CUST-2026-0003' },
    {
      organizationId: orgId,
      customerNumber: 'CUST-2026-0003',
      businessName: 'Cloudnest Infrastructure',
      contactName: 'David Kim',
      email: 'fin@cloudnest.net',
      phone: '+1 (555) 901-4422',
      billingAddress: {
        street: '1201 3rd Ave',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        country: 'USA',
      },
      status: 'ACTIVE',
    },
    { upsert: true, new: true },
  );

  const customerStratos = await Customer.findOneAndUpdate(
    { organizationId: orgId, customerNumber: 'CUST-2026-0004' },
    {
      organizationId: orgId,
      customerNumber: 'CUST-2026-0004',
      businessName: 'Stratos Dynamics Inc.',
      contactName: 'Sarah Chen',
      email: 'accounts@stratosdynamics.com',
      phone: '+1 (555) 782-9910',
      billingAddress: {
        street: '555 Mission St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'USA',
      },
      status: 'ACTIVE',
    },
    { upsert: true, new: true },
  );

  const customerVertex = await Customer.findOneAndUpdate(
    { organizationId: orgId, customerNumber: 'CUST-2026-0005' },
    {
      organizationId: orgId,
      customerNumber: 'CUST-2026-0005',
      businessName: 'Vertex AI Labs',
      contactName: 'Alex Thorne',
      email: 'treasury@vertexlabs.ai',
      phone: '+1 (555) 612-4401',
      billingAddress: {
        street: '100 Main St',
        city: 'Cambridge',
        state: 'MA',
        postalCode: '02142',
        country: 'USA',
      },
      status: 'ACTIVE',
    },
    { upsert: true, new: true },
  );

  console.log('[Seed] Customers seeded.');

  // 6. Quotation (Screen 6 self-service pending proposal)
  await Quotation.findOneAndUpdate(
    { organizationId: orgId, quoteNumber: 'QUOTE-2026-0099' },
    {
      organizationId: orgId,
      quoteNumber: 'QUOTE-2026-0099',
      customerId: customerAcme._id,
      items: [
        {
          productId: productErp._id,
          planId: planYearly._id,
          description: 'Enterprise Yearly License Addendum — 15 Additional Deployed Seats',
          unitPrice: toMinorUnits(2300),
          quantity: 15,
          subtotal: toMinorUnits(34500),
          discount: 0,
          tax: 0,
          total: toMinorUnits(34500),
        },
      ],
      subtotal: toMinorUnits(34500),
      discountTotal: 0,
      taxTotal: 0,
      total: toMinorUnits(34500),
      currency: 'USD',
      issueDate: new Date(),
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      paymentTerms: 'NET_30',
      status: 'QUOTATION',
      notes: 'Special Q4 Commercial Addendum with locked-in renewal tariff.',
    },
    { upsert: true, new: true },
  );

  // 7. Subscriptions
  // Subscription 1 for Acme Logistics: 10 seats @ $1,760/mo + Add-ons = $19,598/mo
  const subAcme = await Subscription.findOneAndUpdate(
    { organizationId: orgId, subscriptionNumber: 'SUB-2026-0084' },
    {
      organizationId: orgId,
      subscriptionNumber: 'SUB-2026-0084',
      customerId: customerAcme._id,
      planId: planMonthly._id,
      items: [
        {
          productId: productErp._id,
          name: 'Monthly Pro Plan — Enterprise Core',
          unitPrice: toMinorUnits(1760),
          quantity: 10,
          subtotal: toMinorUnits(17600),
        },
        {
          productId: productAi._id,
          name: 'AI Analytics & Copilot Add-on',
          unitPrice: toMinorUnits(1500),
          quantity: 1,
          subtotal: toMinorUnits(1500),
        },
        {
          productId: productSupport._id,
          name: 'Dedicated Priority Support',
          unitPrice: toMinorUnits(498),
          quantity: 1,
          subtotal: toMinorUnits(498),
        },
      ],
      startDate: new Date('2026-10-01T00:00:00Z'),
      nextBillingAt: new Date('2026-11-01T00:00:00Z'),
      billingInterval: 'MONTHLY',
      intervalCount: 1,
      paymentTerms: 'NET_30',
      quantity: 10,
      unitPrice: toMinorUnits(1760),
      currency: 'USD',
      priceSnapshots: {
        basePrice: toMinorUnits(1760),
        variantAdjustment: 0,
        calculatedUnitPrice: toMinorUnits(1760),
      },
      status: 'ACTIVE',
      lifecyclePolicies: {
        autoClose: false,
        allowEarlyClose: true,
        allowPause: true,
        allowRenewal: true,
      },
    },
    { upsert: true, new: true },
  );

  // Subscription 2 for Stratos Dynamics: SUB-2026-8841
  await Subscription.findOneAndUpdate(
    { organizationId: orgId, subscriptionNumber: 'SUB-2026-8841' },
    {
      organizationId: orgId,
      subscriptionNumber: 'SUB-2026-8841',
      customerId: customerStratos._id,
      planId: planYearly._id,
      items: [
        {
          productId: productErp._id,
          name: 'Enterprise Yearly — Odoo Integration',
          unitPrice: erpBasePrice + odooAdjustment,
          quantity: 5,
          subtotal: (erpBasePrice + odooAdjustment) * 5,
        },
      ],
      startDate: new Date('2026-01-01T00:00:00Z'),
      nextBillingAt: new Date('2027-01-01T00:00:00Z'),
      billingInterval: 'YEARLY',
      intervalCount: 1,
      paymentTerms: 'NET_30',
      quantity: 5,
      unitPrice: erpBasePrice + odooAdjustment,
      currency: 'USD',
      priceSnapshots: {
        basePrice: erpBasePrice,
        variantAdjustment: odooAdjustment,
        calculatedUnitPrice: erpBasePrice + odooAdjustment,
      },
      status: 'ACTIVE',
      lifecyclePolicies: {
        autoClose: false,
        allowEarlyClose: true,
        allowPause: true,
        allowRenewal: true,
      },
    },
    { upsert: true, new: true },
  );

  // Subscription 3 for Nova Systems: Paused
  await Subscription.findOneAndUpdate(
    { organizationId: orgId, subscriptionNumber: 'SUB-2026-1092' },
    {
      organizationId: orgId,
      subscriptionNumber: 'SUB-2026-1092',
      customerId: customerNova._id,
      planId: planMonthly._id,
      items: [
        {
          productId: productErp._id,
          name: 'Monthly Pro Plan',
          unitPrice: toMinorUnits(1760),
          quantity: 2,
          subtotal: toMinorUnits(3520),
        },
      ],
      startDate: new Date('2026-06-01T00:00:00Z'),
      nextBillingAt: new Date('2026-11-01T00:00:00Z'),
      billingInterval: 'MONTHLY',
      intervalCount: 1,
      paymentTerms: 'NET_30',
      quantity: 2,
      unitPrice: toMinorUnits(1760),
      currency: 'USD',
      priceSnapshots: {
        basePrice: toMinorUnits(1760),
        variantAdjustment: 0,
        calculatedUnitPrice: toMinorUnits(1760),
      },
      status: 'PAUSED',
      lifecyclePolicies: {
        autoClose: false,
        allowEarlyClose: true,
        allowPause: true,
        allowRenewal: true,
      },
    },
    { upsert: true, new: true },
  );

  console.log('[Seed] Subscriptions seeded.');

  // 8. Invoices
  // Settled invoice for Acme Logistics
  const invAcme = await Invoice.findOneAndUpdate(
    { organizationId: orgId, invoiceNumber: 'INV-2026-1094' },
    {
      organizationId: orgId,
      invoiceNumber: 'INV-2026-1094',
      customerId: customerAcme._id,
      subscriptionId: subAcme._id,
      billingPeriodStart: new Date('2026-10-01T00:00:00Z'),
      billingPeriodEnd: new Date('2026-10-31T23:59:59Z'),
      issueDate: new Date('2026-10-01T00:00:00Z'),
      dueDate: new Date('2026-10-15T00:00:00Z'),
      itemSnapshots: [
        {
          productId: productErp._id,
          name: 'Monthly Pro Plan (10 seats)',
          unitPrice: toMinorUnits(1760),
          quantity: 10,
          subtotal: toMinorUnits(17600),
          tax: 0,
          discount: 0,
          total: toMinorUnits(17600),
        },
        {
          productId: productAi._id,
          name: 'AI Analytics Add-on',
          unitPrice: toMinorUnits(1500),
          quantity: 1,
          subtotal: toMinorUnits(1500),
          tax: 0,
          discount: 0,
          total: toMinorUnits(1500),
        },
        {
          productId: productSupport._id,
          name: 'Dedicated Priority Support',
          unitPrice: toMinorUnits(498),
          quantity: 1,
          subtotal: toMinorUnits(498),
          tax: 0,
          discount: 0,
          total: toMinorUnits(498),
        },
      ],
      subtotal: toMinorUnits(19598),
      taxTotal: 0,
      discountTotal: 0,
      total: toMinorUnits(19598),
      paidAmount: toMinorUnits(19598),
      outstandingBalance: 0,
      currency: 'USD',
      status: 'PAID',
      paidAt: new Date('2026-10-02T14:22:00Z'),
    },
    { upsert: true, new: true },
  );

  // Overdue Invoices (from Screen 1 & Screen 3)
  await Invoice.findOneAndUpdate(
    { organizationId: orgId, invoiceNumber: 'INV-2026-1089' },
    {
      organizationId: orgId,
      invoiceNumber: 'INV-2026-1089',
      customerId: customerNova._id,
      issueDate: new Date('2026-09-15T00:00:00Z'),
      dueDate: new Date('2026-10-09T00:00:00Z'),
      itemSnapshots: [
        {
          name: 'Enterprise Cloud Platform Core',
          unitPrice: toMinorUnits(4200),
          quantity: 1,
          subtotal: toMinorUnits(4200),
          tax: 0,
          discount: 0,
          total: toMinorUnits(4200),
        },
      ],
      subtotal: toMinorUnits(4200),
      taxTotal: 0,
      discountTotal: 0,
      total: toMinorUnits(4200),
      paidAmount: 0,
      outstandingBalance: toMinorUnits(4200),
      currency: 'USD',
      status: 'OVERDUE',
    },
    { upsert: true, new: true },
  );

  await Invoice.findOneAndUpdate(
    { organizationId: orgId, invoiceNumber: 'INV-2026-1092' },
    {
      organizationId: orgId,
      invoiceNumber: 'INV-2026-1092',
      customerId: customerCloudnest._id,
      issueDate: new Date('2026-09-20T00:00:00Z'),
      dueDate: new Date('2026-10-13T00:00:00Z'),
      itemSnapshots: [
        {
          name: 'Storage Tier Overages',
          unitPrice: toMinorUnits(2850),
          quantity: 1,
          subtotal: toMinorUnits(2850),
          tax: 0,
          discount: 0,
          total: toMinorUnits(2850),
        },
      ],
      subtotal: toMinorUnits(2850),
      taxTotal: 0,
      discountTotal: 0,
      total: toMinorUnits(2850),
      paidAmount: 0,
      outstandingBalance: toMinorUnits(2850),
      currency: 'USD',
      status: 'OVERDUE',
    },
    { upsert: true, new: true },
  );

  await Invoice.findOneAndUpdate(
    { organizationId: orgId, invoiceNumber: 'INV-2026-1098' },
    {
      organizationId: orgId,
      invoiceNumber: 'INV-2026-1098',
      customerId: customerVertex._id,
      issueDate: new Date('2026-09-25T00:00:00Z'),
      dueDate: new Date('2026-10-22T00:00:00Z'),
      itemSnapshots: [
        {
          name: 'AI Model Inference Compute Pack',
          unitPrice: toMinorUnits(3100),
          quantity: 1,
          subtotal: toMinorUnits(3100),
          tax: 0,
          discount: 0,
          total: toMinorUnits(3100),
        },
      ],
      subtotal: toMinorUnits(3100),
      taxTotal: 0,
      discountTotal: 0,
      total: toMinorUnits(3100),
      paidAmount: 0,
      outstandingBalance: toMinorUnits(3100),
      currency: 'USD',
      status: 'OVERDUE',
    },
    { upsert: true, new: true },
  );

  // 9. Payment for Acme Invoice
  await Payment.findOneAndUpdate(
    { organizationId: orgId, paymentNumber: 'PAY-2026-1094' },
    {
      organizationId: orgId,
      paymentNumber: 'PAY-2026-1094',
      invoiceId: invAcme._id,
      customerId: customerAcme._id,
      amount: toMinorUnits(19598),
      method: 'BANK_TRANSFER',
      reference: 'ACH-DIRECT-8841',
      paidAt: new Date('2026-10-02T14:22:00Z'),
      note: 'Auto-Debit cleared via Silicon Valley Bank ACH clearing.',
      status: 'SUCCESS',
      allocations: [{ invoiceId: invAcme._id, amount: toMinorUnits(19598) }],
      createdBy: 'ACH_ENGINE',
    },
    { upsert: true, new: true },
  );

  // 10. Bank Transactions (for Screen 4 Matcher)
  await BankTransaction.findOneAndUpdate(
    { organizationId: orgId, rawImportHash: 'HASH-WF-WIRE-9921' },
    {
      organizationId: orgId,
      source: 'Wells Fargo Wire Inflow',
      externalReference: 'WF-WIRE-9921',
      transactionDate: new Date('2026-10-30T10:15:00Z'),
      description: 'Incoming Federal Wire Transfer REF: STRATOS DYNAMICS INC',
      amount: toMinorUnits(12850),
      currency: 'USD',
      direction: 'INBOUND',
      rawImportHash: 'HASH-WF-WIRE-9921',
      matchingStatus: 'UNMATCHED',
      confidence: 98,
      notes: 'Matches Invoice INV-2026-1095 amount and customer account title.',
    },
    { upsert: true, new: true },
  );

  await BankTransaction.findOneAndUpdate(
    { organizationId: orgId, rawImportHash: 'HASH-SVB-ACH-4412' },
    {
      organizationId: orgId,
      source: 'SVB Inbound ACH Credit',
      externalReference: 'SVB-ACH-4412',
      transactionDate: new Date('2026-10-29T14:30:00Z'),
      description: 'PPD ACH CREDIT NOVA SYSTEMS LLC',
      amount: toMinorUnits(4200),
      currency: 'USD',
      direction: 'INBOUND',
      rawImportHash: 'HASH-SVB-ACH-4412',
      matchingStatus: 'UNMATCHED',
      confidence: 94,
      notes: 'Exact match with Overdue Invoice INV-2026-1089.',
    },
    { upsert: true, new: true },
  );

  await BankTransaction.findOneAndUpdate(
    { organizationId: orgId, rawImportHash: 'HASH-BARC-SWIFT-0081' },
    {
      organizationId: orgId,
      source: 'Barclays SWIFT Cross-Border',
      externalReference: 'BARC-SWIFT-0081',
      transactionDate: new Date('2026-10-28T09:00:00Z'),
      description: 'SWIFT MT103 INTL SETTLEMENT REF: VERTEX AI EUR EQUIV',
      amount: toMinorUnits(18400),
      currency: 'USD',
      direction: 'INBOUND',
      rawImportHash: 'HASH-BARC-SWIFT-0081',
      matchingStatus: 'UNMATCHED',
      confidence: 82,
      notes: 'Cross-border wire settlement requiring FX rate verification.',
    },
    { upsert: true, new: true },
  );

  console.log('[Seed] Invoices, Payments, and Bank Transactions seeded successfully.');
  console.log('--- Seeding Complete: Demo environment ready ---');
  await disconnectDatabase();
}

// Allow direct CLI execution: tsx src/scripts/seed.ts
if (require.main === module) {
  seedDemoData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed Error]:', err);
      process.exit(1);
    });
}
