import { createGoalCard } from '../components/goal-card.js';
import { createEmptyState } from '../components/empty-state.js';
import { createSkeletonGrid } from '../components/skeleton.js';
import { getGoalsData } from '../services/goals-service.js';

export async function renderGoalsPage(container) {
  container.innerHTML = createSkeletonGrid(3);

  const goals = await getGoalsData();

  if (!goals.length) {
    container.innerHTML = createEmptyState('No savings goals', 'Add a savings target to start measuring progress over time.');
    return;
  }

  container.innerHTML = `
    <div class="page-stack">
      <section class="section-heading">
        <div>
          <h3>Goals</h3>
          <p>Track long-term savings targets without losing sight of month-to-month cash flow.</p>
        </div>
      </section>
      <section class="list-grid">${goals.map(createGoalCard).join('')}</section>
    </div>
  `;
}
