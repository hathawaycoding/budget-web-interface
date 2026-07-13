import { api } from '../api/api.js';
import { appState } from '../utils/state.js';

function clone(value) {
  return structuredClone(value);
}

function getStore() {
  return appState.data;
}

function dispatchDataChanged(detail) {
  window.dispatchEvent(new CustomEvent('app:data-changed', { detail }));
}

function applyServerSnapshot(snapshot) {
  const store = getStore();
  store.dashboard = clone(snapshot.dashboard);
  store.accounts = clone(snapshot.accounts);
  store.transactions = clone(snapshot.transactions).map((transaction) => ({
    ...transaction,
    accountId: Number(transaction.accountId || 1),
  }));
  store.budget = clone(snapshot.budget);
  store.goals = clone(snapshot.goals);
  store.bills = clone(snapshot.bills);
  store.nextTransactionId = store.transactions.reduce((highestId, transaction) => Math.max(highestId, transaction.id), 0) + 1;
  store.isLoaded = true;
}

async function loadSessionData() {
  const store = getStore();

  if (store.isLoaded) {
    return;
  }

  const [dashboard, accounts, transactions, budget, goals, bills] = await Promise.all([
    api.getDashboard(),
    api.getAccounts(),
    api.getTransactions(),
    api.getBudget(),
    api.getGoals(),
    api.getBills(),
  ]);

  applyServerSnapshot({ dashboard, accounts, transactions, budget, goals, bills });
}

export async function ensureSessionDataLoaded() {
  await loadSessionData();
}

export async function refreshSessionData() {
  getStore().isLoaded = false;
  await loadSessionData();
}

export async function getDashboardSnapshot() {
  await loadSessionData();
  return clone(getStore().dashboard);
}

export async function getAccountsSnapshot() {
  await loadSessionData();
  return clone(getStore().accounts);
}

export async function getTransactionsSnapshot() {
  await loadSessionData();
  return clone(getStore().transactions).sort((left, right) => new Date(right.date) - new Date(left.date) || right.id - left.id);
}

export async function getBudgetSnapshot() {
  await loadSessionData();
  return clone(getStore().budget);
}

export async function getGoalsSnapshot() {
  await loadSessionData();
  return clone(getStore().goals);
}

export async function getBillsSnapshot() {
  await loadSessionData();
  return clone(getStore().bills);
}

export async function createExpense(fields) {
  const response = await api.createExpense(fields);
  applyServerSnapshot(response);
  dispatchDataChanged({ type: 'expense-created', transactionId: response.transaction.id });

  return clone(response.transaction);
}

export async function createIncome(fields) {
  const response = await api.createIncome(fields);
  applyServerSnapshot(response);
  dispatchDataChanged({ type: 'income-created', transactionId: response.transaction.id });

  return clone(response.transaction);
}

export async function createTransfer(fields) {
  const response = await api.createTransfer(fields);
  applyServerSnapshot(response);
  dispatchDataChanged({ type: 'transfer-created', transactionIds: response.createdTransactions.map((transaction) => transaction.id) });

  return clone(response.createdTransactions);
}

export async function updateTransaction(id, fields) {
  const response = await api.updateTransaction(id, fields);
  applyServerSnapshot(response);
  dispatchDataChanged({ type: 'transaction-updated', transactionId: response.transaction.id });

  return clone(response.transaction);
}

export function getAccountName(accountId) {
  const account = getStore().accounts.find((item) => item.id === Number(accountId));
  return account?.name || 'Checking';
}
