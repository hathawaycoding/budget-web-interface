const { baseSnapshot } = vi.hoisted(() => ({
  baseSnapshot: {
    dashboard: {
      balance: 1000,
      income: 500,
      expenses: 200,
      savings: 100,
      budgetRemaining: 300,
    },
    accounts: [
      { id: 1, name: 'Checking', balance: 700 },
      { id: 2, name: 'Savings', balance: 300 },
    ],
    transactions: [
      { id: 1, date: '2026-07-10', merchant: 'Store', category: 'Food', amount: -50, accountId: 1 },
    ],
    budget: [
      { category: 'Food', budget: 200, spent: 80 },
    ],
    goals: [],
    bills: [],
  },
}));

function clone(value) {
  return structuredClone(value);
}

vi.mock('../api/api.js', () => ({
  api: {
    getDashboard: vi.fn().mockImplementation(() => Promise.resolve(clone(baseSnapshot.dashboard))),
    getAccounts: vi.fn().mockImplementation(() => Promise.resolve(clone(baseSnapshot.accounts))),
    getTransactions: vi.fn().mockImplementation(() => Promise.resolve(clone(baseSnapshot.transactions))),
    getBudget: vi.fn().mockImplementation(() => Promise.resolve(clone(baseSnapshot.budget))),
    getGoals: vi.fn().mockResolvedValue([]),
    getBills: vi.fn().mockResolvedValue([]),
    createExpense: vi.fn().mockImplementation(async (fields) => ({
      ...clone(baseSnapshot),
      dashboard: {
        ...baseSnapshot.dashboard,
        balance: 980,
        expenses: 220,
        budgetRemaining: 280,
      },
      accounts: [
        { id: 1, name: 'Checking', balance: 680 },
        { id: 2, name: 'Savings', balance: 300 },
      ],
      transactions: [
        { id: 2, date: fields.date, merchant: fields.merchant, category: fields.category, amount: -20, accountId: 1 },
        ...clone(baseSnapshot.transactions),
      ],
      budget: [
        { category: 'Food', budget: 200, spent: 100 },
      ],
      transaction: { id: 2, date: fields.date, merchant: fields.merchant, category: fields.category, amount: -20, accountId: 1 },
    })),
    createIncome: vi.fn().mockImplementation(async (fields) => ({
      ...clone(baseSnapshot),
      dashboard: {
        ...baseSnapshot.dashboard,
        balance: 1250,
        income: 750,
      },
      accounts: [
        { id: 1, name: 'Checking', balance: 950 },
        { id: 2, name: 'Savings', balance: 300 },
      ],
      transactions: [
        { id: 2, date: fields.date, merchant: fields.merchant, category: fields.category, amount: 250, accountId: 1 },
        ...clone(baseSnapshot.transactions),
      ],
      transaction: { id: 2, date: fields.date, merchant: fields.merchant, category: fields.category, amount: 250, accountId: 1 },
    })),
    createTransfer: vi.fn().mockResolvedValue({
      ...clone(baseSnapshot),
      accounts: [
        { id: 1, name: 'Checking', balance: 650 },
        { id: 2, name: 'Savings', balance: 350 },
      ],
      transactions: [
        { id: 2, date: '2026-07-12', merchant: 'Transfer to Savings', category: 'Transfer', amount: -50, accountId: 1 },
        { id: 3, date: '2026-07-12', merchant: 'Transfer from Checking', category: 'Transfer', amount: 50, accountId: 2 },
        ...clone(baseSnapshot.transactions),
      ],
      createdTransactions: [
        { id: 2, date: '2026-07-12', merchant: 'Transfer to Savings', category: 'Transfer', amount: -50, accountId: 1 },
        { id: 3, date: '2026-07-12', merchant: 'Transfer from Checking', category: 'Transfer', amount: 50, accountId: 2 },
      ],
    }),
    updateTransaction: vi.fn().mockImplementation(async (_id, fields) => ({
      ...clone(baseSnapshot),
      dashboard: {
        ...baseSnapshot.dashboard,
        balance: 970,
        expenses: 230,
        budgetRemaining: 270,
      },
      accounts: [
        { id: 1, name: 'Checking', balance: 670 },
        { id: 2, name: 'Savings', balance: 300 },
      ],
      transactions: [
        { id: 1, date: fields.date, merchant: fields.merchant, category: fields.category, amount: Number(fields.amount), accountId: 1 },
      ],
      budget: [
        { category: 'Food', budget: 200, spent: 110 },
      ],
      transaction: { id: 1, date: fields.date, merchant: fields.merchant, category: fields.category, amount: Number(fields.amount), accountId: 1 },
    })),
  },
}));

import {
  createExpense,
  createIncome,
  createTransfer,
  getAccountsSnapshot,
  getDashboardSnapshot,
  getTransactionsSnapshot,
  updateTransaction,
} from './session-data-service.js';
import { appState } from '../utils/state.js';

function resetState() {
  appState.data.isLoaded = false;
  appState.data.dashboard = null;
  appState.data.accounts = [];
  appState.data.transactions = [];
  appState.data.budget = [];
  appState.data.goals = [];
  appState.data.bills = [];
  appState.data.nextTransactionId = 1;
}

describe('session-data-service', () => {
  beforeEach(() => {
    resetState();
  });

  it('creates an expense from the server response snapshot and emits an update event', async () => {
    const onDataChanged = vi.fn();
    window.addEventListener('app:data-changed', onDataChanged);

    await createExpense({
      date: '2026-07-11',
      merchant: 'Coffee Shop',
      category: 'Food',
      amount: '20',
      accountId: '1',
    });

    const dashboard = await getDashboardSnapshot();
    const accounts = await getAccountsSnapshot();
    const transactions = await getTransactionsSnapshot();

    expect(dashboard.balance).toBe(980);
    expect(dashboard.expenses).toBe(220);
    expect(dashboard.budgetRemaining).toBe(280);
    expect(accounts[0].balance).toBe(680);
    expect(transactions[0].merchant).toBe('Coffee Shop');
    expect(onDataChanged).toHaveBeenCalledTimes(1);

    window.removeEventListener('app:data-changed', onDataChanged);
  });

  it('creates income through the API response snapshot', async () => {
    await createIncome({
      date: '2026-07-11',
      merchant: 'Client Payment',
      category: 'Freelance',
      amount: '250',
      accountId: '1',
    });

    const dashboard = await getDashboardSnapshot();
    const accounts = await getAccountsSnapshot();

    expect(dashboard.balance).toBe(1250);
    expect(dashboard.income).toBe(750);
    expect(accounts[0].balance).toBe(950);
  });

  it('creates a transfer without changing dashboard total balance', async () => {
    await createTransfer({
      date: '2026-07-12',
      fromAccountId: '1',
      toAccountId: '2',
      amount: '50',
    });

    const dashboard = await getDashboardSnapshot();
    const accounts = await getAccountsSnapshot();
    const transactions = await getTransactionsSnapshot();

    expect(dashboard.balance).toBe(1000);
    expect(accounts[0].balance).toBe(650);
    expect(accounts[1].balance).toBe(350);
    expect(transactions[0].category).toBe('Transfer');
  });

  it('updates an existing transaction and reapplies totals from the server response snapshot', async () => {
    await updateTransaction(1, {
      date: '2026-07-10',
      merchant: 'Grocer',
      category: 'Food',
      amount: -80,
      accountId: 1,
    });

    const dashboard = await getDashboardSnapshot();
    const accounts = await getAccountsSnapshot();

    expect(dashboard.balance).toBe(970);
    expect(dashboard.expenses).toBe(230);
    expect(accounts[0].balance).toBe(670);
  });
});
