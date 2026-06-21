import request from 'supertest';
import app from '../src/app';

describe('API Endpoints', () => {
  it('GET /api/home - should return 200', async () => {
    const res = await request(app).get('/api/home');
    expect(res.status).toBe(200);
  });
  
  it('GET /api/search without query - should return 400', async () => {
    const res = await request(app).get('/api/search');
    expect(res.status).toBe(400);
  });
});
