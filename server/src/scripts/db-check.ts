import { envConfig } from '../config/env';
import {
  connectDatabase,
  disconnectDatabase,
  checkDatabaseConnection,
  classifyDatabaseError,
} from '../config/database';

async function runDatabaseCheck(): Promise<void> {
  console.log('='.repeat(60));
  console.log('BillNest — MongoDB Atlas Connection Diagnostic Tool');
  console.log('='.repeat(60));

  if (!envConfig.MONGODB_URI) {
    console.error('\n[ERROR] Configuration Missing:');
    console.error('  MONGODB_URI is not set in your environment or server/.env file.');
    console.error('  To fix: Add a valid MongoDB connection string to server/.env:');
    console.error(
      '    MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/billnest',
    );
    console.log('='.repeat(60));
    process.exit(1);
  }

  console.log('\n[INFO] MONGODB_URI is configured (URI string masked for security).');
  console.log('[INFO] Initiating connection to MongoDB Atlas...');

  try {
    await connectDatabase(envConfig.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('[SUCCESS] Cluster connection and TLS handshake established.');

    console.log('[INFO] Executing database ping command...');
    const checkResult = await checkDatabaseConnection();

    if (checkResult.connected) {
      console.log(`[SUCCESS] Database ping succeeded! (Latency: ${checkResult.latencyMs}ms)`);
      console.log('[STATUS] Database is HEALTHY and ready for operations.');
    } else {
      console.error(`[FAILURE] Database ping failed: ${checkResult.error}`);
      await disconnectDatabase();
      console.log('='.repeat(60));
      process.exit(1);
    }

    await disconnectDatabase();
    console.log('[INFO] Database connection cleanly closed.');
    console.log('='.repeat(60));
    process.exit(0);
  } catch (err: unknown) {
    const classified = classifyDatabaseError(err);
    console.error('\n[FAILURE] Connection to MongoDB failed:');
    console.error(`  Category: ${classified.category}`);
    console.error(`  Details:  ${classified.message}`);
    console.error('\nTroubleshooting suggestions:');
    if (classified.category === 'AUTHENTICATION_FAILED') {
      console.error('  - Verify the username and password in your connection string.');
      console.error('  - Ensure password special characters are URL-encoded if applicable.');
    } else if (
      classified.category === 'TIMEOUT' ||
      classified.category === 'NETWORK_OR_DNS_ERROR'
    ) {
      console.error(
        '  - Verify your MongoDB Atlas Network Access IP Whitelist allows your current IP.',
      );
      console.error('  - Check your local DNS resolution and firewall rules.');
    }
    console.log('='.repeat(60));

    try {
      await disconnectDatabase();
    } catch {
      // ignore
    }
    process.exit(1);
  }
}

runDatabaseCheck();
