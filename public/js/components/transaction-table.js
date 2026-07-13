import { formatCurrency, formatDate } from '../utils/formatters.js';

export function createTransactionsTable(transactions, options = {}) {
  const showActions = Boolean(options.showActions);
  const getAccountName = options.getAccountName || (() => 'Checking');
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
    <div class="table-wrap">
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
