import { formatCurrency, formatPercent } from '../utils/formatters.js';

export function createGoalCard(goal) {
  const percent = Math.round((goal.current / goal.target) * 100);

  return `
    <article class="card">
      <div class="row-between">
        <h3 class="card__title">${goal.name}</h3>
        <span class="status-badge">${formatPercent(percent)}</span>
      </div>
      <div class="progress-track" aria-hidden="true">
        <div class="progress-fill" style="width: ${Math.min(percent, 100)}%"></div>
      </div>
      <div class="row-between card__meta">
        <span>Saved ${formatCurrency(goal.current)}</span>
        <span>Target ${formatCurrency(goal.target)}</span>
      </div>
    </article>
  `;
}
