import { createSkeletonGrid } from '../components/skeleton.js';
import { createSummaryCard } from '../components/summary-card.js';
import { createEmptyState } from '../components/empty-state.js';
import { getAccountsData } from '../services/accounts-service.js';

export async function renderAccountsPage(container) {
  container.innerHTML = createSkeletonGrid(3);

  const accounts = await getAccountsData();

  if (!accounts.length) {
    container.innerHTML = createEmptyState('No accounts yet', 'Account balances will appear once account data is available.');
    return;
  }

  container.innerHTML = `
    <div class="page-stack">
      <section class="section-heading">
        <div>
          <h3>Accounts</h3>
          <p>Each account is shown as a separate balance surface for fast scanning.</p>
        </div>
      </section>
      <section class="summary-grid">
        ${accounts.map((account) => createSummaryCard({
          label: account.name,
          value: account.balance,
          tone: account.balance >= 0 ? 'positive' : 'negative',
          meta: account.balance >= 0 ? 'Available balance' : 'Outstanding card balance',
        })).join('')}
      </section>
    </div>
  `;
}
