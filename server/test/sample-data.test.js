import * as data from '../data/sample-data.js';

describe('sample-data.js', () => {
  it('exports all 6 data keys', () => {
    expect(data).toHaveProperty('dashboardData');
    expect(data).toHaveProperty('accountsData');
    expect(data).toHaveProperty('transactionsData');
    expect(data).toHaveProperty('budgetData');
    expect(data).toHaveProperty('goalsData');
    expect(data).toHaveProperty('billsData');
  });

  it('dashboardData has correct shape', () => {
    expect(data.dashboardData).toMatchObject({
      balance: expect.any(Number),
      income: expect.any(Number),
      expenses: expect.any(Number),
      savings: expect.any(Number),
      budgetRemaining: expect.any(Number),
    });
  });

  it('accountsData has 3 accounts with id, name, balance', () => {
    expect(data.accountsData).toHaveLength(3);
    data.accountsData.forEach((account) => {
      expect(account).toHaveProperty('id');
      expect(account).toHaveProperty('name');
      expect(account).toHaveProperty('balance');
    });
  });

  it('transactionsData has 15+ transactions with required fields', () => {
    expect(data.transactionsData.length).toBeGreaterThanOrEqual(15);
    data.transactionsData.forEach((transaction) => {
      expect(transaction).toHaveProperty('id');
      expect(transaction).toHaveProperty('date');
      expect(transaction).toHaveProperty('merchant');
      expect(transaction).toHaveProperty('category');
      expect(transaction).toHaveProperty('amount');
    });
  });

  it('budgetData has 6 categories with required fields', () => {
    expect(data.budgetData).toHaveLength(6);
    data.budgetData.forEach((item) => {
      expect(item).toHaveProperty('category');
      expect(item).toHaveProperty('budget');
      expect(item).toHaveProperty('spent');
    });
  });

  it('goalsData has 3 goals with required fields', () => {
    expect(data.goalsData).toHaveLength(3);
    data.goalsData.forEach((goal) => {
      expect(goal).toHaveProperty('name');
      expect(goal).toHaveProperty('current');
      expect(goal).toHaveProperty('target');
    });
  });

  it('billsData has 5 bills with required fields', () => {
    expect(data.billsData).toHaveLength(5);
    data.billsData.forEach((bill) => {
      expect(bill).toHaveProperty('id');
      expect(bill).toHaveProperty('merchant');
      expect(bill).toHaveProperty('amount');
      expect(bill).toHaveProperty('dueDate');
      expect(bill).toHaveProperty('status');
    });
  });
});
