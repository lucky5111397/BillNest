import { Organization, IOrganization } from '../models/organization.model';

export const DEFAULT_ORG_SLUG = 'brightloop-hq';

let cachedOrg: IOrganization | null = null;

export async function getOrCreateDefaultOrganization(): Promise<IOrganization> {
  if (cachedOrg) {
    return cachedOrg;
  }

  let org = await Organization.findOne({ slug: DEFAULT_ORG_SLUG });

  if (!org) {
    org = await Organization.create({
      name: 'Brightloop Technologies Inc.',
      slug: DEFAULT_ORG_SLUG,
      currency: 'USD',
      timezone: 'America/New_York',
      settings: {
        allowOverdueGraceDays: 7,
        autoDunningEnabled: true,
        defaultPaymentTerms: 'NET_30',
      },
      taxConfig: {
        defaultTaxJurisdiction: 'US-FED',
        inclusiveTax: false,
      },
      status: 'active',
    });
  }

  cachedOrg = org;
  return org;
}

