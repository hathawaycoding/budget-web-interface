import { formatCurrency } from '../utils/formatters.js';

export function createSummaryCard({ label, value, tone, meta }) {
  return `
    <article class="card">
      <p class="card__label">${label}</p>
      <p class="metric-value">${formatCurrency(value)}</p>
      <p class="metric-trend ${tone ? `metric-trend--${tone}` : ''}">${meta}</p>
    </article>
  `;
}
