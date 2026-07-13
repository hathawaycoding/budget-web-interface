import { readDataStore } from '../services/data-store-service.js';
import {
  createExpenseTransaction,
  createIncomeTransaction,
  createTransferTransaction,
  updateTransactionRecord,
} from '../services/transaction-service.js';

export async function getTransactions(_request, response, next) {
  try {
    const data = await readDataStore();
    response.json(data.transactions);
  } catch (error) {
    next(error);
  }
}

export async function createExpense(request, response, next) {
  try {
    const result = await createExpenseTransaction(request.body);
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function createIncome(request, response, next) {
  try {
    const result = await createIncomeTransaction(request.body);
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function createTransfer(request, response, next) {
  try {
    const result = await createTransferTransaction(request.body);
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateTransaction(request, response, next) {
  try {
    const result = await updateTransactionRecord(request.params.id, request.body);
    response.json(result);
  } catch (error) {
    next(error);
  }
}
