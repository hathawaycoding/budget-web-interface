import { formatCurrency, formatDate } from '../utils/formatters.js';

export function createBillList(bills) {
  return `
    <div class="data-list">
      ${bills.map((bill) => `
        <div class="data-list__item">
          <div class="row-between">
            <h3 class="card__title">${bill.merchant}</h3>
            <span class="status-badge">${bill.status}</span>
          </div>
          <div class="row-between card__meta">
            <span>Due ${formatDate(bill.dueDate)}</span>
            <span>${formatCurrency(bill.amount)}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
