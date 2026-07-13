import { readDataStore, writeDataStore } from './data-store-service.js';

function createValidationError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function ensureDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) {
    throw createValidationError('Provide a valid date in YYYY-MM-DD format.');
  }

  return value;
}

function ensureMerchant(value, label = 'merchant') {
  const trimmedValue = String(value || '').trim();

  if (!trimmedValue) {
    throw createValidationError(`Provide a ${label}.`);
  }

  return trimmedValue;
}

function ensureCategory(value) {
  const trimmedValue = String(value || '').trim();

  if (!trimmedValue) {
    throw createValidationError('Provide a category.');
  }

  return trimmedValue;
}

function ensurePositiveAmount(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    throw createValidationError('Provide an amount greater than zero.');
  }

  return numericValue;
}

function ensureNonZeroAmount(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue === 0) {
    throw createValidationError('Provide an amount that is not zero.');
  }

  return numericValue;
}

function ensureAccount(data, accountId) {
  const numericAccountId = Number(accountId);
  const account = data.accounts.find((item) => item.id === numericAccountId);

  if (!account) {
    throw createValidationError('Select a valid account.');
  }

  return account;
}

function getBudgetItemByCategory(data, category) {
  return data.budget.find((item) => item.category === category);
}

function applyTransactionEffect(data, transaction, multiplier = 1) {
  const account = ensureAccount(data, transaction.accountId);
  const absoluteAmount = Math.abs(transaction.amount);

  if (transaction.amount < 0) {
    account.balance -= absoluteAmount * multiplier;
    data.dashboard.balance -= absoluteAmount * multiplier;
    data.dashboard.expenses += absoluteAmount * multiplier;

    const budgetItem = getBudgetItemByCategory(data, transaction.category);

    if (budgetItem) {
      budgetItem.spent += absoluteAmount * multiplier;
      data.dashboard.budgetRemaining -= absoluteAmount * multiplier;
    }

    return;
  }

  account.balance += transaction.amount * multiplier;
  data.dashboard.balance += transaction.amount * multiplier;
  data.dashboard.income += transaction.amount * multiplier;
}

function createTransactionRecord(data, fields) {
  const transaction = {
    id: data.meta.nextTransactionId++,
    date: ensureDate(fields.date),
    merchant: ensureMerchant(fields.merchant, 'merchant or source'),
    category: ensureCategory(fields.category),
    amount: Number(fields.amount),
    accountId: Number(fields.accountId || 1),
  };

  ensureAccount(data, transaction.accountId);
  return transaction;
}

async function persistData(data) {
  const savedData = await writeDataStore(data);

  return {
    dashboard: savedData.dashboard,
    accounts: savedData.accounts,
    transactions: savedData.transactions,
    budget: savedData.budget,
    goals: savedData.goals,
    bills: savedData.bills,
  };
}

export async function createExpenseTransaction(fields) {
  const data = await readDataStore();
  const transaction = createTransactionRecord(data, {
    ...fields,
    amount: -ensurePositiveAmount(fields.amount),
  });

  data.transactions.push(transaction);
  applyTransactionEffect(data, transaction);

  const snapshot = await persistData(data);
  return { transaction, ...snapshot };
}

export async function createIncomeTransaction(fields) {
  const data = await readDataStore();
  const transaction = createTransactionRecord(data, {
    ...fields,
    amount: ensurePositiveAmount(fields.amount),
  });

  data.transactions.push(transaction);
  applyTransactionEffect(data, transaction);

  const snapshot = await persistData(data);
  return { transaction, ...snapshot };
}

export async function createTransferTransaction(fields) {
  const data = await readDataStore();
  const amount = ensurePositiveAmount(fields.amount);
  const date = ensureDate(fields.date);
  const fromAccount = ensureAccount(data, fields.fromAccountId);
  const toAccount = ensureAccount(data, fields.toAccountId);

  if (fromAccount.id === toAccount.id) {
    throw createValidationError('Select two different accounts for a transfer.');
  }

  fromAccount.balance -= amount;
  toAccount.balance += amount;

  const outgoingTransaction = createTransactionRecord(data, {
    date,
    merchant: `Transfer to ${toAccount.name}`,
    category: 'Transfer',
    amount: -amount,
    accountId: fromAccount.id,
  });

  const incomingTransaction = createTransactionRecord(data, {
    date,
    merchant: `Transfer from ${fromAccount.name}`,
    category: 'Transfer',
    amount,
    accountId: toAccount.id,
  });

  data.transactions.push(outgoingTransaction, incomingTransaction);

  const snapshot = await persistData(data);
  return { createdTransactions: [outgoingTransaction, incomingTransaction], ...snapshot };
}

export async function updateTransactionRecord(id, fields) {
  const data = await readDataStore();
  const transaction = data.transactions.find((item) => item.id === Number(id));

  if (!transaction) {
    throw createValidationError('Transaction not found.', 404);
  }

  if (transaction.category === 'Transfer') {
    throw createValidationError('Transfer entries cannot be edited in this version.');
  }

  const nextAmount = ensureNonZeroAmount(fields.amount);

  applyTransactionEffect(data, transaction, -1);

  transaction.date = ensureDate(fields.date);
  transaction.merchant = ensureMerchant(fields.merchant, 'merchant or source');
  transaction.category = ensureCategory(fields.category);
  transaction.amount = nextAmount;
  transaction.accountId = Number(fields.accountId || transaction.accountId || 1);

  ensureAccount(data, transaction.accountId);
  applyTransactionEffect(data, transaction, 1);

  const snapshot = await persistData(data);
  return { transaction, ...snapshot };
}
