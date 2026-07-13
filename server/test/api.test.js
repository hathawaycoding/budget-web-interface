import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import request from 'supertest';
import app from '../index.js';

describe('API endpoints', () => {
  let tempDirectory;
  let tempDataFile;

  beforeEach(async () => {
    tempDirectory = await mkdtemp(path.join(tmpdir(), 'budget-planner-api-'));
    tempDataFile = path.join(tempDirectory, 'budget-planner.json');
    process.env.BUDGET_DATA_FILE = tempDataFile;
  });

  afterEach(async () => {
    delete process.env.BUDGET_DATA_FILE;
    await rm(tempDirectory, { recursive: true, force: true });
  });

  it.each([
    ['/api/dashboard'],
    ['/api/accounts'],
    ['/api/transactions'],
    ['/api/budget'],
    ['/api/goals'],
    ['/api/bills'],
  ])('responds from %s', async (endpoint) => {
    const response = await request(app).get(endpoint);

    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });

  it('falls back to sample data when no persisted file exists', async () => {
    const response = await request(app).get('/api/transactions');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(15);
  });

  it('persists a created expense to the configured JSON file', async () => {
    const createResponse = await request(app)
      .post('/api/transactions/expenses')
      .send({
        date: '2026-07-18',
        merchant: 'Corner Cafe',
        category: 'Food',
        amount: 24.5,
        accountId: 1,
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.transaction.merchant).toBe('Corner Cafe');

    const savedFile = JSON.parse(await readFile(tempDataFile, 'utf8'));
    expect(savedFile.transactions.some((transaction) => transaction.merchant === 'Corner Cafe')).toBe(true);

    const listResponse = await request(app).get('/api/transactions');
    expect(listResponse.body.some((transaction) => transaction.merchant === 'Corner Cafe')).toBe(true);
  });

  it('updates an existing transaction through the persisted API', async () => {
    await request(app)
      .post('/api/transactions/expenses')
      .send({
        date: '2026-07-18',
        merchant: 'Original Merchant',
        category: 'Food',
        amount: 20,
        accountId: 1,
      });

    const transactionsResponse = await request(app).get('/api/transactions');
    const createdTransaction = transactionsResponse.body.find((transaction) => transaction.merchant === 'Original Merchant');

    const updateResponse = await request(app)
      .put(`/api/transactions/${createdTransaction.id}`)
      .send({
        date: '2026-07-19',
        merchant: 'Updated Merchant',
        category: 'Food',
        amount: -35,
        accountId: 1,
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.transaction.merchant).toBe('Updated Merchant');

    const savedFile = JSON.parse(await readFile(tempDataFile, 'utf8'));
    expect(savedFile.transactions.some((transaction) => transaction.merchant === 'Updated Merchant')).toBe(true);
  });

  it('creates paired persisted transfer entries', async () => {
    const response = await request(app)
      .post('/api/transactions/transfers')
      .send({
        date: '2026-07-20',
        fromAccountId: 1,
        toAccountId: 2,
        amount: 75,
      });

    expect(response.status).toBe(201);
    expect(response.body.createdTransactions).toHaveLength(2);

    const savedFile = JSON.parse(await readFile(tempDataFile, 'utf8'));
    expect(savedFile.transactions.some((transaction) => transaction.category === 'Transfer')).toBe(true);
  });

  it('rejects invalid transfer requests', async () => {
    const response = await request(app)
      .post('/api/transactions/transfers')
      .send({
        date: '2026-07-20',
        fromAccountId: 1,
        toAccountId: 1,
        amount: 75,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('different accounts');
  });

  it('returns index html for non-api routes', async () => {
    const response = await request(app).get('/budget');

    expect(response.status).toBe(200);
    expect(response.text).toContain('<!DOCTYPE html>');
  });
});
