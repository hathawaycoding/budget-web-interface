import { createBalanceCard } from '../components/balance-card.js';
import { createSummaryCard } from '../components/summary-card.js';
import { createBudgetCard } from '../components/budget-card.js';
import { createGoalCard } from '../components/goal-card.js';
import { createTransactionsTable } from '../components/transaction-table.js';
import { createBillList } from '../components/bill-list.js';
import { createSkeletonGrid } from '../components/skeleton.js';
import { createEmptyState } from '../components/empty-state.js';
import { getDashboardSummary } from '../services/dashboard-service.js';
import { getTransactionsData } from '../services/transactions-service.js';
import { getBudgetData } from '../services/budget-service.js';
import { getGoalsData } from '../services/goals-service.js';
import { getBillsData } from '../services/bills-service.js';
import { QUICK_ACTIONS } from '../utils/constants.js';
import { formatCurrency } from '../utils/formatters.js';

function createSectionErrorState(message) {
  return `
    <div class="error-state card">
      <p class="card__title">Section unavailable</p>
      <p class="card__meta">${message}</p>
    </div>
  `;
}

function getSpendingBreakdown(transactions) {
  const totals = transactions.reduce((categories, transaction) => {
    if (transaction.amount >= 0) {
      return categories;
    }

    const currentTotal = categories.get(transaction.category) || 0;
    categories.set(transaction.category, currentTotal + Math.abs(transaction.amount));
    return categories;
  }, new Map());

  return [...totals.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)
    .map(([category, total]) => ({ category, total }));
}

function createSpendingBreakdownList(items) {
  return `
    <div class="data-list">
      ${items.map((item) => `
        <div class="data-list__item">
          <div class="row-between">
            <h3 class="card__title">${item.category}</h3>
            <span>${formatCurrency(item.total)}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

export async function renderDashboardPage(container) {
  container.innerHTML = createSkeletonGrid(4);

  const [summaryResult, transactionsResult, budgetResult, goalsResult, billsResult] = await Promise.allSettled([
    getDashboardSummary(),
    getTransactionsData(),
    getBudgetData(),
    getGoalsData(),
    getBillsData(),
  ]);

  if (summaryResult.status !== 'fulfilled') {
    throw summaryResult.reason;
  }

  const summary = summaryResult.value;
  const transactions = transactionsResult.status === 'fulfilled' ? transactionsResult.value : [];
  const budget = budgetResult.status === 'fulfilled' ? budgetResult.value : [];
  const goals = goalsResult.status === 'fulfilled' ? goalsResult.value : [];
  const bills = billsResult.status === 'fulfilled' ? billsResult.value : [];

  const recentTransactions = transactions.slice(0, 6);
  const budgetPreview = budget.slice(0, 3);
  const goalsPreview = goals.slice(0, 3);
  const billsPreview = bills.slice(0, 3);
  const spendingBreakdown = getSpendingBreakdown(transactions);

  container.innerHTML = `
    <div class="page-stack">
      ${createBalanceCard(summary)}
      <section class="summary-grid">
        ${createSummaryCard({ label: 'Monthly income', value: summary.income, tone: 'positive', meta: 'Cash coming in this month' })}
        ${createSummaryCard({ label: 'Monthly expenses', value: summary.expenses, tone: 'negative', meta: 'Committed and recent spending' })}
        ${createSummaryCard({ label: 'Savings', value: summary.savings, tone: 'positive', meta: 'Money set aside for future goals' })}
        ${createSummaryCard({ label: 'Budget remaining', value: summary.budgetRemaining, tone: 'warning', meta: 'Available room across active budgets' })}
      </section>

      <section class="spotlight-grid">
        <article class="card section-stack">
          <div class="section-heading">
            <div>
              <h3>Recent transactions</h3>
              <p>Latest account activity across income and spending.</p>
            </div>
          </div>
          ${transactionsResult.status !== 'fulfilled'
            ? createSectionErrorState('Recent transactions could not be loaded right now.')
            : recentTransactions.length
              ? createTransactionsTable(recentTransactions)
              : createEmptyState('No transactions yet', 'Recent activity will appear here once data is available.')}
        </article>

        <article class="card section-stack">
          <div class="section-heading">
            <div>
              <h3>Upcoming bills</h3>
              <p>Payments you should keep in view this cycle.</p>
            </div>
          </div>
          ${billsResult.status !== 'fulfilled'
            ? createSectionErrorState('Upcoming bills could not be loaded right now.')
            : billsPreview.length
              ? createBillList(billsPreview)
              : createEmptyState('No upcoming bills', 'Scheduled bills will appear here once they are added.')}
        </article>
      </section>

      <section class="content-grid">
        <article class="card section-stack">
          <div class="section-heading">
            <div>
              <h3>Monthly budget</h3>
              <p>Categories closest to their spending limits.</p>
            </div>
          </div>
          ${budgetResult.status !== 'fulfilled'
            ? createSectionErrorState('Budget categories could not be loaded right now.')
            : `<div class="list-grid">${budgetPreview.map(createBudgetCard).join('')}</div>`}
        </article>

        <article class="card section-stack">
          <div class="section-heading">
            <div>
              <h3>Goals</h3>
              <p>Longer-term savings progress at a glance.</p>
            </div>
          </div>
          ${goalsResult.status !== 'fulfilled'
            ? createSectionErrorState('Goals could not be loaded right now.')
            : `<div class="section-stack">${goalsPreview.map(createGoalCard).join('')}</div>`}
        </article>
      </section>

      <section class="content-grid">
        <article class="card section-stack">
          <div class="section-heading">
            <div>
              <h3>Spending breakdown</h3>
              <p>Your largest expense categories this month, based on posted outflows.</p>
            </div>
          </div>
          ${transactionsResult.status !== 'fulfilled'
            ? createSectionErrorState('Spending breakdown could not be calculated right now.')
            : spendingBreakdown.length
              ? createSpendingBreakdownList(spendingBreakdown)
              : createEmptyState('No expense categories yet', 'Expense categories will appear here after transactions are available.')}
        </article>

        <article class="card section-stack">
          <div class="section-heading">
            <div>
              <h3>Budget posture</h3>
              <p>Use remaining budget and bill timing together when deciding what is safe to spend next.</p>
            </div>
          </div>
          <div class="pill-row">
            <span class="status-pill">Budget left ${formatCurrency(summary.budgetRemaining)}</span>
            <span class="status-pill">Bills tracked ${bills.length}</span>
            <span class="status-pill">Goals active ${goals.length}</span>
          </div>
        </article>
      </section>

      <section class="card section-stack">
        <div class="section-heading">
          <div>
            <h3>Quick actions</h3>
            <p>Preview the common budget actions planned for a persistent version.</p>
          </div>
        </div>
        <div class="quick-actions-grid">
          ${QUICK_ACTIONS.map((action) => `<button class="button-secondary" type="button" data-quick-action="${action.key}">${action.label}</button>`).join('')}
        </div>
      </section>
    </div>
  `;
}
