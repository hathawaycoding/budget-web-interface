import { formatCurrency, formatPercent } from '../utils/formatters.js';

function getProgressTone(percent) {
  if (percent > 100) {
    return 'is-danger';
  }

  if (percent >= 80) {
    return 'is-warning';
  }

  return '';
}

export function createBudgetCard(item) {
  const percent = Math.round((item.spent / item.budget) * 100);
  const remaining = item.budget - item.spent;
  const toneClass = getProgressTone(percent);

  return `
    <article class="card">
      <div class="row-between">
        <h3 class="card__title">${item.category}</h3>
        <span class="status-badge">${formatPercent(percent)}</span>
      </div>
      <div class="progress-track" aria-hidden="true">
        <div class="progress-fill ${toneClass}" style="width: ${Math.min(percent, 100)}%"></div>
      </div>
      <div class="row-between card__meta">
        <span>Budget ${formatCurrency(item.budget)}</span>
        <span>Spent ${formatCurrency(item.spent)}</span>
      </div>
      <p class="metric-trend ${remaining < 0 ? 'metric-trend--negative' : 'metric-trend--positive'}">${remaining < 0 ? 'Over by' : 'Remaining'} ${formatCurrency(Math.abs(remaining))}</p>
    </article>
  `;
}
