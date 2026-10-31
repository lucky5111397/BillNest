import { connectDatabase, disconnectDatabase } from '../config/database';
import { getOrCreateDefaultOrganization } from '../utils/organization';
import { User } from '../models/user.model';
import { hashPassword, validatePasswordStrength } from '../utils/security';

export async function bootstrapAdmin(): Promise<void> {
  console.log('--- BillNest Initial Administrator Bootstrap ---');

  const email = (process.env.INITIAL_ADMIN_EMAIL || 'admin@billnest.internal').trim().toLowerCase();
  const password = process.env.INITIAL_ADMIN_PASSWORD || 'BillNest@AdminMaster2026!';

  const strength = validatePasswordStrength(password);
  if (!strength.valid) {
    console.error(
      `[Security Failure] INITIAL_ADMIN_PASSWORD does not meet policy: ${strength.error}`,
    );
    process.exit(1);
  }

  await connectDatabase();
  const org = await getOrCreateDefaultOrganization();

  let adminUser = await User.findOne({ organizationId: org._id, email });

  if (adminUser) {
    console.log(`[Bootstrap] Admin user ${email} already exists. Updating role & credentials...`);
    adminUser.passwordHash = await hashPassword(password);
    adminUser.role = 'ADMIN';
    adminUser.status = 'ACTIVE';
    await adminUser.save();
  } else {
    console.log(`[Bootstrap] Creating initial administrator account: ${email}...`);
    const passwordHash = await hashPassword(password);
    adminUser = await User.create({
      organizationId: org._id,
      name: 'Executive Administrator',
      email,
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    });
  }

  console.log(
    `[SUCCESS] Administrator bootstrap completed: ${adminUser.email} (Role: ${adminUser.role})`,
  );
  await disconnectDatabase();
}

if (require.main === module) {
  bootstrapAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Bootstrap Error]:', err);
      process.exit(1);
    });
}
