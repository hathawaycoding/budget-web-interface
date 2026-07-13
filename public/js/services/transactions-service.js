import { getTransactionsSnapshot } from './session-data-service.js';

export async function getTransactionsData() {
  return getTransactionsSnapshot();
}

export function filterTransactions(transactions, filters) {
  const searchTerm = filters.searchTerm?.toLowerCase() || '';
  const category = filters.category || 'all';
  const sortBy = filters.sortBy || 'date-desc';
  const dateFrom = filters.dateFrom || '';
  const dateTo = filters.dateTo || '';

  return transactions.filter((transaction) => {
    const matchesSearch = !searchTerm || [transaction.merchant, transaction.category].join(' ').toLowerCase().includes(searchTerm);
    const matchesCategory = !category || category === 'all' || transaction.category === category;
    const matchesDateFrom = !dateFrom || transaction.date >= dateFrom;
    const matchesDateTo = !dateTo || transaction.date <= dateTo;

    return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo;
  }).sort((left, right) => sortTransactions(left, right, sortBy));
}

export function getTransactionCategories(transactions) {
  return [...new Set(transactions.map((transaction) => transaction.category))].sort();
}

export function sortTransactions(left, right, sortBy) {
  if (sortBy === 'date-asc') {
    return new Date(left.date) - new Date(right.date) || left.id - right.id;
  }

  if (sortBy === 'amount-desc') {
    return right.amount - left.amount || new Date(right.date) - new Date(left.date);
  }

  if (sortBy === 'amount-asc') {
    return left.amount - right.amount || new Date(right.date) - new Date(left.date);
  }

  if (sortBy === 'merchant-asc') {
    return left.merchant.localeCompare(right.merchant) || new Date(right.date) - new Date(left.date);
  }

  return new Date(right.date) - new Date(left.date) || right.id - left.id;
}
