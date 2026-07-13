import { createBudgetCard } from '../components/budget-card.js';
import { createEmptyState } from '../components/empty-state.js';
import { createSkeletonGrid } from '../components/skeleton.js';
import { getBudgetData } from '../services/budget-service.js';

export async function renderBudgetPage(container) {
  container.innerHTML = createSkeletonGrid(3);

  const budgetItems = await getBudgetData();

  if (!budgetItems.length) {
    container.innerHTML = createEmptyState('No budget categories', 'Create categories to start tracking planned versus actual spending.');
    return;
  }

  container.innerHTML = `
    <div class="page-stack">
      <section class="section-heading">
        <div>
          <h3>Monthly budget</h3>
          <p>Use category cards to compare planned amounts, actual spend, and remaining room.</p>
        </div>
      </section>
      <section class="list-grid">${budgetItems.map(createBudgetCard).join('')}</section>
    </div>
  `;
}
