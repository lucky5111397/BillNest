import { Request, Response, NextFunction } from 'express';
import { Customer } from '../../models/customer.model';
import { Subscription } from '../../models/subscription.model';
import { Quotation } from '../../models/quotation.model';
import { Invoice } from '../../models/invoice.model';
import { Product } from '../../models/product.model';
import { getOrCreateDefaultOrganization } from '../../utils/organization';

/**
 * Resolves current customer context.
 * In production post-auth: resolved from authenticated req.user.customerId.
 * In dev/demo: resolves the primary demo customer Acme Logistics Ltd.
 */
async function resolveCustomerContext(req: Request) {
  const org = await getOrCreateDefaultOrganization();
  const customerId = (req as unknown as { user?: { customerId?: string } }).user?.customerId;

  if (customerId) {
    const customer = await Customer.findOne({ _id: customerId, organizationId: org._id });
    if (customer) return customer;
  }

  // Fallback to default demo customer: Acme Logistics Ltd.
  let customer = await Customer.findOne({
    organizationId: org._id,
    customerNumber: 'CUST-2026-0001',
  });

  if (!customer) {
    customer = await Customer.findOne({ organizationId: org._id });
  }

  return customer;
}

export async function getPortalOverview(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const customer = await resolveCustomerContext(req);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Portal customer profile not found' });
      return;
    }

    const [subscriptions, quotations, invoices] = await Promise.all([
      Subscription.find({ customerId: customer._id, status: 'ACTIVE' })
        .populate('planId', 'name billingInterval pricing')
        .lean(),
      Quotation.find({ customerId: customer._id, status: 'QUOTATION' }).lean(),
      Invoice.find({ customerId: customer._id }).sort({ issueDate: -1 }).limit(5).lean(),
    ]);

    res.json({
      success: true,
      data: {
        customer: {
          id: customer._id,
          businessName: customer.businessName,
          contactName: customer.contactName,
          email: customer.email,
          phone: customer.phone,
          customerNumber: customer.customerNumber,
          billingAddress: customer.billingAddress,
        },
        subscriptions,
        quotations,
        recentInvoices: invoices,
        notice:
          'DEVELOPMENT PREVIEW: Customer portal demonstration interface. End-to-end authentication, customer isolation, and SSO will be enabled in the final authentication phase.',
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getPortalSubscriptions(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const customer = await resolveCustomerContext(req);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer profile not found' });
      return;
    }

    const subscriptions = await Subscription.find({ customerId: customer._id })
      .populate('planId')
      .populate('items.productId')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: subscriptions });
  } catch (err) {
    next(err);
  }
}

export async function updatePortalSeats(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const customer = await resolveCustomerContext(req);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer profile not found' });
      return;
    }

    const { id } = req.params;
    const { seats } = req.body;

    if (typeof seats !== 'number' || seats < 1) {
      res.status(400).json({ success: false, message: 'Valid positive seat count required' });
      return;
    }

    const subscription = await Subscription.findOne({ _id: id, customerId: customer._id });
    if (!subscription) {
      res.status(404).json({ success: false, message: 'Subscription not found for this customer' });
      return;
    }

    subscription.quantity = seats;
    if (subscription.items && subscription.items[0]) {
      subscription.items[0].quantity = seats;
      subscription.items[0].subtotal = subscription.items[0].unitPrice * seats;
    }
    await subscription.save();

    res.json({
      success: true,
      data: subscription,
      message: `Seats updated to ${seats}. Monthly billing adjusted.`,
    });
  } catch (err) {
    next(err);
  }
}

export async function togglePortalAddon(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const customer = await resolveCustomerContext(req);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer profile not found' });
      return;
    }

    const { id } = req.params;
    const { addonSku, enabled } = req.body;

    const subscription = await Subscription.findOne({ _id: id, customerId: customer._id });
    if (!subscription) {
      res.status(404).json({ success: false, message: 'Subscription not found' });
      return;
    }

    const org = await getOrCreateDefaultOrganization();
    const product = await Product.findOne({ organizationId: org._id, SKU: addonSku });

    if (!product) {
      res.status(404).json({ success: false, message: `Add-on with SKU ${addonSku} not found` });
      return;
    }

    if (enabled) {
      // Add add-on line item if not already present
      const existing = subscription.items.find(
        (i) => i.productId.toString() === product._id.toString(),
      );
      if (!existing) {
        subscription.items.push({
          productId: product._id,
          name: product.name,
          unitPrice: product.salesPrice,
          quantity: 1,
          subtotal: product.salesPrice,
        });
      }
    } else {
      // Remove add-on line item
      subscription.items = subscription.items.filter(
        (i) => i.productId.toString() !== product._id.toString(),
      );
    }

    await subscription.save();

    res.json({
      success: true,
      data: subscription,
      message: `${product.name} ${enabled ? 'activated' : 'removed'} on subscription.`,
    });
  } catch (err) {
    next(err);
  }
}

export async function getPortalQuotations(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const customer = await resolveCustomerContext(req);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer profile not found' });
      return;
    }

    const quotations = await Quotation.find({ customerId: customer._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: quotations });
  } catch (err) {
    next(err);
  }
}

export async function acceptPortalQuotation(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const customer = await resolveCustomerContext(req);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer profile not found' });
      return;
    }

    const { id } = req.params;
    const quotation = await Quotation.findOne({ _id: id, customerId: customer._id });

    if (!quotation) {
      res.status(404).json({ success: false, message: 'Quotation not found' });
      return;
    }

    quotation.status = 'CONFIRMED';
    await quotation.save();

    res.json({
      success: true,
      data: quotation,
      message: `Quotation ${quotation.quoteNumber} accepted and confirmed!`,
    });
  } catch (err) {
    next(err);
  }
}

export async function getPortalInvoices(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const customer = await resolveCustomerContext(req);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer profile not found' });
      return;
    }

    const invoices = await Invoice.find({ customerId: customer._id })
      .sort({ issueDate: -1 })
      .lean();
    res.json({ success: true, data: invoices });
  } catch (err) {
    next(err);
  }
}
