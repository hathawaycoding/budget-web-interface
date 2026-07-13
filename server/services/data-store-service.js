import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  accountsData,
  billsData,
  budgetData,
  dashboardData,
  goalsData,
  transactionsData,
} from '../data/sample-data.js';

function clone(value) {
  return structuredClone(value);
}

function getDefaultDataFilePath() {
  return path.resolve(process.cwd(), 'server/data/budget-planner.json');
}

function getDataFilePath() {
  return process.env.BUDGET_DATA_FILE || getDefaultDataFilePath();
}

function buildInitialState() {
  const transactions = clone(transactionsData).map((transaction) => ({
    ...transaction,
    accountId: Number(transaction.accountId || 1),
  }));

  return {
    dashboard: clone(dashboardData),
    accounts: clone(accountsData),
    transactions,
    budget: clone(budgetData),
    goals: clone(goalsData),
    bills: clone(billsData),
    meta: {
      nextTransactionId: transactions.reduce((highestId, transaction) => Math.max(highestId, transaction.id), 0) + 1,
    },
  };
}

function normalizeState(data) {
  return {
    dashboard: clone(data.dashboard || dashboardData),
    accounts: clone(data.accounts || accountsData),
    transactions: clone(data.transactions || transactionsData).map((transaction) => ({
      ...transaction,
      accountId: Number(transaction.accountId || 1),
    })),
    budget: clone(data.budget || budgetData),
    goals: clone(data.goals || goalsData),
    bills: clone(data.bills || billsData),
    meta: {
      nextTransactionId: Number(data.meta?.nextTransactionId)
        || clone(data.transactions || transactionsData).reduce((highestId, transaction) => Math.max(highestId, transaction.id), 0) + 1,
    },
  };
}

export async function readDataStore() {
  const filePath = getDataFilePath();

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return normalizeState(JSON.parse(fileContents));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return buildInitialState();
    }

    throw error;
  }
}

export async function writeDataStore(data) {
  const filePath = getDataFilePath();
  const directoryPath = path.dirname(filePath);
  const tempFilePath = `${filePath}.tmp`;
  const normalizedData = normalizeState(data);

  await fs.mkdir(directoryPath, { recursive: true });
  await fs.writeFile(tempFilePath, JSON.stringify(normalizedData, null, 2), 'utf8');
  await fs.rename(tempFilePath, filePath);

  return clone(normalizedData);
}

export function getDataFileForTests() {
  return getDataFilePath();
}
