import { renderDashboardPage } from './pages/dashboard-page.js';
import { renderAccountsPage } from './pages/accounts-page.js';
import { renderTransactionsPage } from './pages/transactions-page.js';
import { renderBudgetPage } from './pages/budget-page.js';
import { renderGoalsPage } from './pages/goals-page.js';
import { renderBillsPage } from './pages/bills-page.js';
import { closeModal, openModal } from './components/modal.js';
import { showToast } from './components/toast.js';
import { getElement, setHidden } from './utils/dom.js';
import { PAGE_TITLES } from './utils/constants.js';
import { appState } from './utils/state.js';
import {
  createExpense,
  createIncome,
  createTransfer,
  getAccountsSnapshot,
  getBudgetSnapshot,
  getTransactionsSnapshot,
  updateTransaction,
} from './services/session-data-service.js';

const pages = {
  dashboard: renderDashboardPage,
  accounts: renderAccountsPage,
  transactions: renderTransactionsPage,
  budget: renderBudgetPage,
  goals: renderGoalsPage,
  bills: renderBillsPage,
};

function setActiveNav(page) {
  document.querySelectorAll('.nav-link').forEach((link) => {
    const isActive = link.dataset.page === page;
    link.classList.toggle('is-active', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'page');
      return;
    }

    link.removeAttribute('aria-current');
  });
}

function setSidebarOpen(isOpen) {
  const sidebar = getElement('#sidebar');
  const backdrop = getElement('#sidebar-backdrop');

  appState.isSidebarOpen = isOpen;
  sidebar?.classList.toggle('is-open', isOpen);
  setHidden(backdrop, !isOpen);
}

async function renderPage(page) {
  const container = getElement('#page-content');
  const title = getElement('#page-title');
  const renderer = pages[page] || pages.dashboard;

  if (!container) {
    return;
  }

  appState.currentPage = page;
  setActiveNav(page);

  if (title) {
    title.textContent = PAGE_TITLES[page] || PAGE_TITLES.dashboard;
  }

  try {
    await renderer(container);
  } catch (error) {
    console.error(error);
    container.innerHTML = `
      <div class="card error-state">
        <h3>We could not load this section.</h3>
        <p class="card__meta">Please retry the request. This demo uses static JSON endpoints, so failures usually mean the local server is unavailable.</p>
        <div>
          <button class="button" type="button" data-retry-page="${page}">Retry</button>
        </div>
      </div>
    `;
    showToast('Unable to load data. Try again.');
  }
}

function navigateToPage(page) {
  const nextHash = `#${page}`;

  if (window.location.hash === nextHash) {
    renderPage(page);
    return;
  }

  window.location.hash = page;
}

function getTodayValue() {
  return new Date().toISOString().slice(0, 10);
}

function createOptions(items, selectedValue) {
  return items.map((item) => `
    <option value="${item.value}" ${String(item.value) === String(selectedValue) ? 'selected' : ''}>${item.label}</option>
  `).join('');
}

function createActionForm({ action, description, fields }) {
  return `
    <p class="card__meta">${description}</p>
    <form class="form-grid" data-modal-action="${action}">
      ${fields.join('')}
      <div class="row-between">
        <button class="button-secondary" type="button" data-close-modal>Cancel</button>
        <button class="button" type="submit">Save</button>
      </div>
    </form>
  `;
}

async function openQuickActionModal(action) {
  if (action === 'view-transactions') {
    navigateToPage('transactions');
    return;
  }

  const [accounts, budget] = await Promise.all([getAccountsSnapshot(), getBudgetSnapshot()]);
  const accountOptions = accounts.map((account) => ({ value: account.id, label: account.name }));
  const expenseCategories = budget.map((item) => ({ value: item.category, label: item.category }));

  if (action === 'add-expense') {
    openModal({
      title: 'Add expense',
      eyebrow: 'Record spending',
      content: createActionForm({
        action,
        description: 'Create a new expense entry and immediately reflect it in your dashboard, transaction ledger, and budget totals for this session.',
        fields: [
          `<div class="field"><label for="expense-date">Date</label><input id="expense-date" name="date" type="date" value="${getTodayValue()}" required /></div>`,
          `<div class="field"><label for="expense-merchant">Merchant</label><input id="expense-merchant" name="merchant" type="text" placeholder="Merchant name" required /></div>`,
          `<div class="field"><label for="expense-category">Category</label><select id="expense-category" name="category" required>${createOptions(expenseCategories, expenseCategories[0]?.value)}</select></div>`,
          `<div class="field"><label for="expense-account">Account</label><select id="expense-account" name="accountId" required>${createOptions(accountOptions, accountOptions[0]?.value)}</select></div>`,
          `<div class="field"><label for="expense-amount">Amount</label><input id="expense-amount" name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required /></div>`,
        ],
      }),
    });
    return;
  }

  if (action === 'add-income') {
    openModal({
      title: 'Add income',
      eyebrow: 'Record inflow',
      content: createActionForm({
        action,
        description: 'Create a new income entry and update account balance, total income, and current balance for this session.',
        fields: [
          `<div class="field"><label for="income-date">Date</label><input id="income-date" name="date" type="date" value="${getTodayValue()}" required /></div>`,
          `<div class="field"><label for="income-source">Source</label><input id="income-source" name="merchant" type="text" placeholder="Payroll or client" required /></div>`,
          `<div class="field"><label for="income-category">Category</label><select id="income-category" name="category" required>${createOptions([
            { value: 'Payroll', label: 'Payroll' },
            { value: 'Freelance', label: 'Freelance' },
            { value: 'Refund', label: 'Refund' },
            { value: 'Interest', label: 'Interest' },
          ], 'Payroll')}</select></div>`,
          `<div class="field"><label for="income-account">Account</label><select id="income-account" name="accountId" required>${createOptions(accountOptions, accountOptions[0]?.value)}</select></div>`,
          `<div class="field"><label for="income-amount">Amount</label><input id="income-amount" name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required /></div>`,
        ],
      }),
    });
    return;
  }

  if (action === 'transfer') {
    openModal({
      title: 'Transfer funds',
      eyebrow: 'Move balance',
      content: createActionForm({
        action,
        description: 'Move money between two accounts and create paired transfer entries in the transaction ledger for this session.',
        fields: [
          `<div class="field"><label for="transfer-date">Date</label><input id="transfer-date" name="date" type="date" value="${getTodayValue()}" required /></div>`,
          `<div class="field"><label for="transfer-from">From account</label><select id="transfer-from" name="fromAccountId" required>${createOptions(accountOptions, accountOptions[0]?.value)}</select></div>`,
          `<div class="field"><label for="transfer-to">To account</label><select id="transfer-to" name="toAccountId" required>${createOptions(accountOptions, accountOptions[1]?.value || accountOptions[0]?.value)}</select></div>`,
          `<div class="field"><label for="transfer-amount">Amount</label><input id="transfer-amount" name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required /></div>`,
        ],
      }),
    });
  }
}

async function openEditTransactionModal(transactionId) {
  const [transactions, accounts, budget] = await Promise.all([
    getTransactionsSnapshot(),
    getAccountsSnapshot(),
    getBudgetSnapshot(),
  ]);
  const transaction = transactions.find((item) => item.id === Number(transactionId));

  if (!transaction) {
    showToast('Transaction not found.');
    return;
  }

  const categories = [...new Set([...budget.map((item) => item.category), ...transactions.map((item) => item.category)])]
    .filter((category) => category !== 'Transfer')
    .sort()
    .map((category) => ({ value: category, label: category }));

  openModal({
    title: 'Edit transaction',
    eyebrow: 'Update entry',
    content: createActionForm({
      action: 'edit-transaction',
      description: 'Adjust the core transaction details. Transfer entries stay locked so both account balances remain consistent.',
      fields: [
        `<input name="transactionId" type="hidden" value="${transaction.id}" />`,
        `<div class="field"><label for="edit-date">Date</label><input id="edit-date" name="date" type="date" value="${transaction.date}" required /></div>`,
        `<div class="field"><label for="edit-merchant">Merchant</label><input id="edit-merchant" name="merchant" type="text" value="${transaction.merchant}" required /></div>`,
        `<div class="field"><label for="edit-category">Category</label><select id="edit-category" name="category" required>${createOptions(categories, transaction.category)}</select></div>`,
        `<div class="field"><label for="edit-account">Account</label><select id="edit-account" name="accountId" required>${createOptions(accounts.map((account) => ({ value: account.id, label: account.name })), transaction.accountId)}</select></div>`,
        `<div class="field"><label for="edit-amount">Amount</label><input id="edit-amount" name="amount" type="number" step="0.01" value="${transaction.amount}" required /></div>`,
      ],
    }),
  });
}

async function submitModalAction(form) {
  const formData = new FormData(form);
  const action = form.dataset.modalAction;

  if (action === 'add-expense') {
    await createExpense(Object.fromEntries(formData.entries()));
    closeModal();
    showToast('Expense added.');
    return;
  }

  if (action === 'add-income') {
    await createIncome(Object.fromEntries(formData.entries()));
    closeModal();
    showToast('Income added.');
    return;
  }

  if (action === 'transfer') {
    await createTransfer(Object.fromEntries(formData.entries()));
    closeModal();
    showToast('Transfer recorded.');
    return;
  }

  if (action === 'edit-transaction') {
    const entries = Object.fromEntries(formData.entries());
    await updateTransaction(entries.transactionId, {
      date: entries.date,
      merchant: entries.merchant,
      category: entries.category,
      amount: Number(entries.amount),
      accountId: entries.accountId,
    });
    closeModal();
    showToast('Transaction updated.');
  }
}

function bindEvents() {
  document.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const navLink = target.closest('.nav-link');

    if (navLink instanceof HTMLElement) {
      event.preventDefault();
      const nextPage = navLink.dataset.page || 'dashboard';
      setSidebarOpen(false);
      navigateToPage(nextPage);
      return;
    }

    if (target.id === 'mobile-menu-toggle' || target.closest('#mobile-menu-toggle')) {
      setSidebarOpen(!appState.isSidebarOpen);
      return;
    }

    if (target.id === 'sidebar-backdrop') {
      setSidebarOpen(false);
      return;
    }

    if (target.dataset.closeModal !== undefined) {
      closeModal();
      return;
    }

    if (target.dataset.quickAction) {
      openQuickActionModal(target.dataset.quickAction).catch((error) => {
        console.error(error);
        showToast(error.message || 'Unable to open action.');
      });
      return;
    }

    if (target.dataset.editTransaction) {
      openEditTransactionModal(target.dataset.editTransaction).catch((error) => {
        console.error(error);
        showToast(error.message || 'Unable to open editor.');
      });
      return;
    }

    if (target.dataset.retryPage) {
      renderPage(target.dataset.retryPage);
    }
  });

  document.addEventListener('submit', (event) => {
    const form = event.target;

    if (!(form instanceof HTMLFormElement) || !form.dataset.modalAction) {
      return;
    }

    event.preventDefault();
    submitModalAction(form).catch((error) => {
      console.error(error);
      showToast(error.message || 'Unable to save changes.');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
      setSidebarOpen(false);
    }
  });
}

function getInitialPage() {
  const hash = window.location.hash.replace('#', '');
  return PAGE_TITLES[hash] ? hash : 'dashboard';
}

bindEvents();
window.addEventListener('app:data-changed', () => {
  renderPage(appState.currentPage);
});
window.addEventListener('hashchange', () => {
  renderPage(getInitialPage());
});
renderPage(getInitialPage());
