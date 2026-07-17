import { formatCurrency, formatDate } from '../utils/formatters.js';

export function createTransactionsTable(transactions, options = {}) {
  const showActions = Boolean(options.showActions);
  const getAccountName = options.getAccountName || (() => 'Checking');
  const mobileCards = transactions.map((transaction) => `
      <article class="transaction-mobile-card">
        <div class="transaction-mobile-card__header">
          <div>
            <h4 class="transaction-mobile-card__merchant">${transaction.merchant}</h4>
            <p class="card__meta">${formatDate(transaction.date)}</p>
          </div>
          <span class="transaction-mobile-card__amount ${transaction.amount >= 0 ? 'amount-positive' : 'amount-negative'}">${formatCurrency(transaction.amount)}</span>
        </div>
        <div class="transaction-mobile-card__row">
          <span>Category</span>
          <span>${transaction.category}</span>
        </div>
        <div class="transaction-mobile-card__row">
          <span>Account</span>
          <span>${getAccountName(transaction.accountId)}</span>
        </div>
        ${showActions ? `
          <div class="transaction-mobile-card__footer">
            <span class="status-pill">${transaction.category === 'Transfer' ? 'Read only' : 'Editable'}</span>
            <button class="button-secondary" type="button" data-edit-transaction="${transaction.id}" ${transaction.category === 'Transfer' ? 'disabled' : ''}>Edit transaction</button>
          </div>
        ` : ''}
      </article>
    `).join('');
  const rows = transactions.map((transaction) => `
      <tr>
        <td>${formatDate(transaction.date)}</td>
        <td>${transaction.merchant}</td>
        <td>${transaction.category}</td>
        <td>${getAccountName(transaction.accountId)}</td>
        <td class="${transaction.amount >= 0 ? 'amount-positive' : 'amount-negative'}">${formatCurrency(transaction.amount)}</td>
        ${showActions ? `<td><button class="button-secondary" type="button" data-edit-transaction="${transaction.id}" ${transaction.category === 'Transfer' ? 'disabled' : ''}>Edit</button></td>` : ''}
      </tr>
    `).join('');

  return `
    <div class="transaction-mobile-list">${mobileCards}</div>
    <div class="table-wrap table-wrap--desktop">
      <table class="transactions-table">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Merchant</th>
            <th scope="col">Category</th>
            <th scope="col">Account</th>
            <th scope="col">Amount</th>
            ${showActions ? '<th scope="col">Actions</th>' : ''}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}
