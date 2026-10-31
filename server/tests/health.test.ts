import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import * as databaseModule from '../src/config/database';

describe('Health & Routing Endpoints', () => {
  it('GET /api/v1/health/live should return 200 OK without depending on database', async () => {
    const res = await request(app).get('/api/v1/health/live');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptimeSeconds).toBe('number');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /api/v1/health/ready should return 200 OK when MongoDB is connected', async () => {
    vi.spyOn(databaseModule, 'checkDatabaseConnection').mockResolvedValueOnce({
      connected: true,
      status: 'healthy',
      latencyMs: 5,
      readyState: 1,
    });

    const res = await request(app).get('/api/v1/health/ready');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.dependencies.database.status).toBe('healthy');
    expect(res.body.dependencies.database.latencyMs).toBe(5);
  });

  it('GET /api/v1/health/ready should return 503 Service Unavailable when MongoDB is disconnected', async () => {
    vi.spyOn(databaseModule, 'checkDatabaseConnection').mockResolvedValueOnce({
      connected: false,
      status: 'down',
      readyState: 0,
      error: 'MongoDB is not connected',
    });

    const res = await request(app).get('/api/v1/health/ready');

    expect(res.status).toBe(503);
    expect(res.body.status).toBe('degraded');
    expect(res.body.dependencies.database.status).toBe('down');
    expect(res.body.dependencies.database.error).toBe('MongoDB is not connected');
  });

  it('GET /api/v1 should return API metadata and endpoints', async () => {
    const res = await request(app).get('/api/v1');

    expect(res.status).toBe(200);
    expect(res.body.service).toBe('Brightloop API');
    expect(res.body.version).toBe('v1');
  });

  it('GET /unknown-route should return structured 404 JSON', async () => {
    const res = await request(app).get('/unknown-route');

    expect(res.status).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.statusCode).toBe(404);
    expect(res.body.message).toContain('Cannot GET /unknown-route');
  });
});
