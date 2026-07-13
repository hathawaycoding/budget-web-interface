import { createTransactionsTable } from './transaction-table.js';

describe('createTransactionsTable', () => {
  it('renders merchant, category, and formatted values', () => {
    const markup = createTransactionsTable([
      {
        id: 1,
        date: '2026-07-10',
        merchant: 'Amazon',
        category: 'Shopping',
        amount: -53.22,
      },
    ]);

    document.body.innerHTML = markup;

    expect(document.querySelector('table')).not.toBeNull();
    expect(document.body.textContent).toContain('Amazon');
    expect(document.body.textContent).toContain('Shopping');
    expect(document.body.textContent).toContain('$53.22');
  });
});
