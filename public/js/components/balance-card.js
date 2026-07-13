import { formatCurrency } from '../utils/formatters.js';

export function createBalanceCard(summary) {
  return `
    <article class="card card--hero hero-grid">
      <div class="section-heading">
        <div>
          <p class="card__label">Current balance</p>
          <h3 class="balance-card__value">${formatCurrency(summary.balance)}</h3>
        </div>
        <span class="status-pill">Available funds</span>
      </div>
      <p class="hero-copy">See your current cash position first, then move through spending, goals, and bills in the order that matters most when making a budget decision.</p>
      <div class="balance-card__footer">
        <span class="metric-trend metric-trend--positive">Income is covering spending this month</span>
        <span class="card__meta">Static data demo, API-ready structure</span>
      </div>
    </article>
  `;
}
