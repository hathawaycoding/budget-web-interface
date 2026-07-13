import { renderTransactionsPage } from './transactions-page.js';

vi.mock('../services/transactions-service.js', () => ({
  getTransactionsData: vi.fn().mockResolvedValue([
    { id: 1, date: '2026-07-10', merchant: 'Amazon', category: 'Shopping', amount: -53.22, accountId: 1 },
    { id: 2, date: '2026-07-12', merchant: 'Netflix', category: 'Subscriptions', amount: -18.99, accountId: 1 },
  ]),
  getTransactionCategories: vi.fn().mockReturnValue(['Shopping', 'Subscriptions']),
  filterTransactions: vi.fn((transactions, filters) => transactions.filter((transaction) => {
    if (filters.searchTerm) {
      return transaction.merchant.toLowerCase().includes(filters.searchTerm.toLowerCase());
    }

    return true;
  })),
}));

vi.mock('../services/session-data-service.js', () => ({
  getAccountsSnapshot: vi.fn().mockResolvedValue([
    { id: 1, name: 'Checking', balance: 1000 },
  ]),
  getAccountName: vi.fn().mockImplementation((accountId) => accountId === 1 ? 'Checking' : 'Unknown'),
}));

describe('renderTransactionsPage', () => {
  it('renders transactions and filters results on input', async () => {
    document.body.innerHTML = '<div id="target"></div>';
    const container = document.querySelector('#target');

    await renderTransactionsPage(container);

    expect(container.textContent).toContain('Amazon');
    expect(container.textContent).toContain('Netflix');

    const input = container.querySelector('#transaction-search');
    input.value = 'net';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(container.textContent).toContain('Netflix');
    expect(container.textContent).not.toContain('Amazon');
    expect(container.querySelector('#transactions-count')?.textContent).toBe('1 transaction');
  });
});
