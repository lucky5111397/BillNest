import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import * as databaseModule from '../src/config/database';

describe('Health & Routing Endpoints', () => {
  it('GET /api/v1/health/live should return 200 OK with process uptime', async () => {
    const res = await request(app).get('/api/v1/health/live');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptimeSeconds).toBe('number');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /api/v1/health/ready should return 200 OK when database is connected', async () => {
    vi.spyOn(databaseModule, 'checkDatabaseConnection').mockResolvedValueOnce({
      connected: true,
      latencyMs: 5,
    });

    const res = await request(app).get('/api/v1/health/ready');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.dependencies.database.status).toBe('healthy');
  });

  it('GET /api/v1/health/ready should return 503 Service Unavailable when database is disconnected', async () => {
    vi.spyOn(databaseModule, 'checkDatabaseConnection').mockResolvedValueOnce({
      connected: false,
      error: 'Connection refused',
    });

    const res = await request(app).get('/api/v1/health/ready');

    expect(res.status).toBe(503);
    expect(res.body.status).toBe('degraded');
    expect(res.body.dependencies.database.status).toBe('down');
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
