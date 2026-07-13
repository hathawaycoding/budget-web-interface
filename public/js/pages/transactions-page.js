import { createTransactionsTable } from '../components/transaction-table.js';
import { createEmptyState } from '../components/empty-state.js';
import { createSkeletonGrid } from '../components/skeleton.js';
import { getTransactionCategories, getTransactionsData, filterTransactions } from '../services/transactions-service.js';
import { getAccountsSnapshot, getAccountName } from '../services/session-data-service.js';

function renderTransactionsSection(transactions, categories, accounts) {
  return `
    <div class="page-stack">
      <article class="card section-stack">
        <div class="section-heading">
          <div>
            <h3>Transactions</h3>
            <p>Filter by merchant, category, date range, or sort order to inspect recent spending patterns.</p>
          </div>
        </div>
        <form class="filters" id="transaction-filters">
          <div class="field">
            <label for="transaction-search">Search</label>
            <input id="transaction-search" name="search" type="search" placeholder="Search merchant or category" />
          </div>
          <div class="field">
            <label for="transaction-category">Category</label>
            <select id="transaction-category" name="category">
              <option value="all">All categories</option>
              ${categories.map((category) => `<option value="${category}">${category}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label for="transaction-date-from">From date</label>
            <input id="transaction-date-from" name="dateFrom" type="date" />
          </div>
          <div class="field">
            <label for="transaction-date-to">To date</label>
            <input id="transaction-date-to" name="dateTo" type="date" />
          </div>
          <div class="field">
            <label for="transaction-sort">Sort by</label>
            <select id="transaction-sort" name="sortBy">
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="amount-desc">Amount high to low</option>
              <option value="amount-asc">Amount low to high</option>
              <option value="merchant-asc">Merchant A-Z</option>
            </select>
          </div>
        </form>
        <div class="section-heading">
          <p id="transactions-count">${transactions.length} transactions</p>
        </div>
        <div id="transactions-results">${createTransactionsTable(transactions, { showActions: true, getAccountName })}</div>
      </article>
      <article class="card section-stack">
        <div class="section-heading">
          <div>
            <h3>Editable entries</h3>
            <p>Expense and income rows can be edited. Transfer entries remain read-only so paired balances stay in sync.</p>
          </div>
        </div>
        <div class="pill-row">
          ${accounts.map((account) => `<span class="status-pill">${account.name}: ${account.balance >= 0 ? 'Available' : 'Card balance'}</span>`).join('')}
        </div>
      </article>
    </div>
  `;
}

export async function renderTransactionsPage(container) {
  container.innerHTML = createSkeletonGrid(2);

  const [transactions, accounts] = await Promise.all([getTransactionsData(), getAccountsSnapshot()]);

  if (!transactions.length) {
    container.innerHTML = createEmptyState('No transactions found', 'Recent spending and deposits will appear here once transaction data is available.');
    return;
  }

  const categories = getTransactionCategories(transactions);
  container.innerHTML = renderTransactionsSection(transactions, categories, accounts);

  const form = container.querySelector('#transaction-filters');
  const results = container.querySelector('#transactions-results');
  const count = container.querySelector('#transactions-count');

  const updateResults = () => {
    const formData = new FormData(form);
    const filtered = filterTransactions(transactions, {
      searchTerm: formData.get('search')?.toString() || '',
      category: formData.get('category')?.toString() || 'all',
      dateFrom: formData.get('dateFrom')?.toString() || '',
      dateTo: formData.get('dateTo')?.toString() || '',
      sortBy: formData.get('sortBy')?.toString() || 'date-desc',
    });

    if (count) {
      count.textContent = `${filtered.length} transaction${filtered.length === 1 ? '' : 's'}`;
    }

    results.innerHTML = filtered.length
      ? createTransactionsTable(filtered, { showActions: true, getAccountName })
      : createEmptyState('No matching transactions', 'Try a different search term, category, date range, or sort order.');
  };

  form?.addEventListener('input', () => {
    updateResults();
  });

  form?.addEventListener('change', () => {
    updateResults();
  });
}
