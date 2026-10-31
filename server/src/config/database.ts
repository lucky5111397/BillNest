import mongoose, { ConnectOptions } from 'mongoose';
import { envConfig } from './env';

export interface DatabaseCheckResult {
  connected: boolean;
  status: 'healthy' | 'down';
  latencyMs?: number;
  error?: string;
  category?: string;
  readyState: number;
}

export interface ClassifiedDatabaseError {
  category:
    | 'AUTHENTICATION_FAILED'
    | 'NETWORK_OR_DNS_ERROR'
    | 'TIMEOUT'
    | 'CONFIGURATION_ERROR'
    | 'UNKNOWN';
  message: string;
}

export const DEFAULT_MONGOOSE_OPTIONS: ConnectOptions = {
  maxPoolSize: 10,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 5000,
  maxIdleTimeMS: 30000,
  autoIndex: false,
};

let activeConnectionPromise: Promise<typeof mongoose> | null = null;
let listenersAttached = false;

export function classifyDatabaseError(err: unknown): ClassifiedDatabaseError {
  if (!err) {
    return { category: 'UNKNOWN', message: 'Unknown database error' };
  }

  const rawMessage = err instanceof Error ? err.message : String(err);
  const name = err instanceof Error ? err.name : '';
  const code = (err as { code?: number | string })?.code;

  if (
    code === 18 ||
    /auth/i.test(rawMessage) ||
    /AuthenticationFailed/i.test(rawMessage) ||
    /bad auth/i.test(rawMessage)
  ) {
    return {
      category: 'AUTHENTICATION_FAILED',
      message: 'MongoDB authentication failed. Verify database credentials and user permissions.',
    };
  }

  if (
    /timed out/i.test(rawMessage) ||
    /timeout/i.test(rawMessage) ||
    name === 'MongooseServerSelectionError'
  ) {
    return {
      category: 'TIMEOUT',
      message:
        'Server selection timed out. Verify network connectivity, firewall rules, and Atlas IP access list.',
    };
  }

  if (
    /ENOTFOUND/i.test(rawMessage) ||
    /ECONNREFUSED/i.test(rawMessage) ||
    /getaddrinfo/i.test(rawMessage)
  ) {
    return {
      category: 'NETWORK_OR_DNS_ERROR',
      message: 'Network or DNS resolution failure reaching MongoDB host.',
    };
  }

  return {
    category: 'UNKNOWN',
    message: 'An error occurred while communicating with the database.',
  };
}

function setupConnectionEventListeners(): void {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on('connected', () => {
    if (process.env.NODE_ENV !== 'test') {
      console.log('[Database] MongoDB connection established.');
    }
  });

  mongoose.connection.on('disconnected', () => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[Database] MongoDB disconnected.');
    }
  });

  mongoose.connection.on('reconnected', () => {
    if (process.env.NODE_ENV !== 'test') {
      console.log('[Database] MongoDB reconnected.');
    }
  });

  mongoose.connection.on('error', (err) => {
    if (process.env.NODE_ENV !== 'test') {
      const classified = classifyDatabaseError(err);
      console.error(
        `[Database] MongoDB connection error (${classified.category}): ${classified.message}`,
      );
    }
  });
}

export function getDatabaseStatus(): {
  readyState: number;
  stateText: 'disconnected' | 'connected' | 'connecting' | 'disconnecting';
  isConnected: boolean;
} {
  const readyState = mongoose.connection.readyState;
  const stateMap: Record<number, 'disconnected' | 'connected' | 'connecting' | 'disconnecting'> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    readyState,
    stateText: stateMap[readyState] ?? 'disconnected',
    isConnected: readyState === 1,
  };
}

export async function connectDatabase(
  uri?: string,
  options?: ConnectOptions,
): Promise<typeof mongoose> {
  const targetUri = uri !== undefined ? uri : envConfig.MONGODB_URI;

  if (!targetUri || targetUri.trim() === '') {
    throw new Error('MONGODB_URI is not provided or configured in environment');
  }

  // If already connected, reuse existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // If an initial connection attempt is already in flight, reuse the promise
  if (mongoose.connection.readyState === 2 && activeConnectionPromise) {
    return activeConnectionPromise;
  }

  setupConnectionEventListeners();

  const connectionOptions: ConnectOptions = {
    ...DEFAULT_MONGOOSE_OPTIONS,
    autoIndex: process.env.NODE_ENV !== 'production',
    ...options,
  };

  activeConnectionPromise = mongoose.connect(targetUri, connectionOptions);

  try {
    const conn = await activeConnectionPromise;
    return conn;
  } finally {
    activeConnectionPromise = null;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  activeConnectionPromise = null;
}

export async function checkDatabaseConnection(): Promise<DatabaseCheckResult> {
  const readyState = mongoose.connection.readyState;

  if (readyState !== 1 || !mongoose.connection.db) {
    return {
      connected: false,
      status: 'down',
      readyState,
      error: 'Database is not connected',
      category: 'DISCONNECTED',
    };
  }

  const start = Date.now();
  try {
    await mongoose.connection.db.command({ ping: 1 });
    const latencyMs = Date.now() - start;
    return {
      connected: true,
      status: 'healthy',
      latencyMs,
      readyState: 1,
    };
  } catch (err: unknown) {
    const classified = classifyDatabaseError(err);
    const latencyMs = Date.now() - start;
    return {
      connected: false,
      status: 'down',
      latencyMs,
      readyState: mongoose.connection.readyState,
      error: classified.message,
      category: classified.category,
    };
  }
}

export { mongoose };
