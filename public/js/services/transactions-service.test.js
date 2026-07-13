import { filterTransactions, sortTransactions } from './transactions-service.js';

const transactions = [
  { id: 1, date: '2026-07-10', merchant: 'Amazon', category: 'Shopping', amount: -53.22 },
  { id: 2, date: '2026-07-08', merchant: 'Payroll', category: 'Payroll', amount: 3200 },
  { id: 3, date: '2026-07-12', merchant: 'Netflix', category: 'Subscriptions', amount: -18.99 },
];

describe('transactions-service', () => {
  it('filters by search term, category, and date range', () => {
    const result = filterTransactions(transactions, {
      searchTerm: 'net',
      category: 'Subscriptions',
      dateFrom: '2026-07-11',
      dateTo: '2026-07-12',
      sortBy: 'date-desc',
    });

    expect(result).toHaveLength(1);
    expect(result[0].merchant).toBe('Netflix');
  });

  it('sorts by merchant ascending', () => {
    const sorted = [...transactions].sort((left, right) => sortTransactions(left, right, 'merchant-asc'));

    expect(sorted.map((item) => item.merchant)).toEqual(['Amazon', 'Netflix', 'Payroll']);
  });
});
