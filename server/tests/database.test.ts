import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import {
  connectDatabase,
  disconnectDatabase,
  checkDatabaseConnection,
  classifyDatabaseError,
  getDatabaseStatus,
  DEFAULT_MONGOOSE_OPTIONS,
} from '../src/config/database';

function setMockReadyState(state: number) {
  Object.defineProperty(mongoose.connection, 'readyState', {
    value: state,
    configurable: true,
    writable: true,
  });
}

function resetMockReadyState() {
  // @ts-expect-error Resetting overridden property
  delete mongoose.connection.readyState;
}

describe('Mongoose Database Module', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetMockReadyState();
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    resetMockReadyState();
  });

  describe('classifyDatabaseError', () => {
    it('should classify authentication errors correctly', () => {
      const authErr = new Error('Authentication failed for user admin');
      expect(classifyDatabaseError(authErr).category).toBe('AUTHENTICATION_FAILED');

      const code18Err = { code: 18, message: 'bad auth' };
      expect(classifyDatabaseError(code18Err).category).toBe('AUTHENTICATION_FAILED');
    });

    it('should classify timeout and server selection errors correctly', () => {
      const timeoutErr = new Error('connection timed out');
      expect(classifyDatabaseError(timeoutErr).category).toBe('TIMEOUT');

      const serverSelErr = new Error('server selection timed out');
      serverSelErr.name = 'MongooseServerSelectionError';
      expect(classifyDatabaseError(serverSelErr).category).toBe('TIMEOUT');
    });

    it('should classify network and DNS resolution failures', () => {
      const dnsErr = new Error('getaddrinfo ENOTFOUND cluster0.mongodb.net');
      expect(classifyDatabaseError(dnsErr).category).toBe('NETWORK_OR_DNS_ERROR');

      const connRefused = new Error('connect ECONNREFUSED 127.0.0.1:27017');
      expect(classifyDatabaseError(connRefused).category).toBe('NETWORK_OR_DNS_ERROR');
    });

    it('should handle unknown or generic errors without leaking sensitive data', () => {
      const genericErr = new Error('Some unexpected internal error with mongodb://user:pass@host');
      const classified = classifyDatabaseError(genericErr);

      expect(classified.category).toBe('UNKNOWN');
      expect(classified.message).not.toContain('mongodb://');
      expect(classified.message).not.toContain('pass');
    });
  });

  describe('getDatabaseStatus', () => {
    it('should reflect disconnected state when readyState is 0', () => {
      setMockReadyState(0);

      const status = getDatabaseStatus();
      expect(status.readyState).toBe(0);
      expect(status.stateText).toBe('disconnected');
      expect(status.isConnected).toBe(false);
    });

    it('should reflect connected state when readyState is 1', () => {
      setMockReadyState(1);

      const status = getDatabaseStatus();
      expect(status.readyState).toBe(1);
      expect(status.stateText).toBe('connected');
      expect(status.isConnected).toBe(true);
    });
  });

  describe('connectDatabase', () => {
    it('should throw an error when no URI is provided or configured', async () => {
      await expect(connectDatabase('')).rejects.toThrow(
        /MONGODB_URI is not provided or configured in environment/,
      );
    });

    it('should reuse existing connection when readyState is 1', async () => {
      setMockReadyState(1);
      const connectSpy = vi.spyOn(mongoose, 'connect');

      const conn = await connectDatabase('mongodb://localhost:27017/test');

      expect(conn).toBe(mongoose);
      expect(connectSpy).not.toHaveBeenCalled();
    });

    it('should call mongoose.connect with pool settings when disconnected', async () => {
      setMockReadyState(0);
      const connectSpy = vi.spyOn(mongoose, 'connect').mockResolvedValueOnce(mongoose);

      const testUri = 'mongodb://localhost:27017/billnest_test';
      const conn = await connectDatabase(testUri);

      expect(conn).toBe(mongoose);
      expect(connectSpy).toHaveBeenCalledWith(
        testUri,
        expect.objectContaining({
          maxPoolSize: DEFAULT_MONGOOSE_OPTIONS.maxPoolSize,
          minPoolSize: DEFAULT_MONGOOSE_OPTIONS.minPoolSize,
          serverSelectionTimeoutMS: DEFAULT_MONGOOSE_OPTIONS.serverSelectionTimeoutMS,
          maxIdleTimeMS: DEFAULT_MONGOOSE_OPTIONS.maxIdleTimeMS,
        }),
      );
    });
  });

  describe('checkDatabaseConnection', () => {
    it('should return down status when connection is not ready', async () => {
      setMockReadyState(0);

      const result = await checkDatabaseConnection();

      expect(result.connected).toBe(false);
      expect(result.status).toBe('down');
      expect(result.readyState).toBe(0);
      expect(result.error).toBe('Database is not connected');
    });

    it('should return healthy status when ping command succeeds', async () => {
      setMockReadyState(1);
      // @ts-expect-error Mocking db object
      mongoose.connection.db = {
        command: vi.fn().mockResolvedValueOnce({ ok: 1 }),
      };

      const result = await checkDatabaseConnection();

      expect(result.connected).toBe(true);
      expect(result.status).toBe('healthy');
      expect(typeof result.latencyMs).toBe('number');
      expect(result.readyState).toBe(1);
    });

    it('should return down status when ping command throws', async () => {
      setMockReadyState(1);
      // @ts-expect-error Mocking db object
      mongoose.connection.db = {
        command: vi.fn().mockRejectedValueOnce(new Error('Connection timed out during ping')),
      };

      const result = await checkDatabaseConnection();

      expect(result.connected).toBe(false);
      expect(result.status).toBe('down');
      expect(result.category).toBe('TIMEOUT');
      expect(typeof result.latencyMs).toBe('number');
    });
  });

  describe('disconnectDatabase', () => {
    it('should call mongoose.disconnect when connection is open', async () => {
      setMockReadyState(1);
      const disconnectSpy = vi.spyOn(mongoose, 'disconnect').mockResolvedValueOnce();

      await disconnectDatabase();

      expect(disconnectSpy).toHaveBeenCalledTimes(1);
    });

    it('should skip mongoose.disconnect when already disconnected', async () => {
      setMockReadyState(0);
      const disconnectSpy = vi.spyOn(mongoose, 'disconnect');

      await disconnectDatabase();

      expect(disconnectSpy).not.toHaveBeenCalled();
    });
  });
});
