async function fetchJson(endpoint, options = {}) {
  const response = await fetch(endpoint, options);

  if (!response.ok) {
    let message = `Request failed for ${endpoint}`;

    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
    } catch {
      // Ignore body parsing failures and use the fallback message.
    }

    throw new Error(message);
  }

  return response.json();
}

function sendJson(endpoint, method, body) {
  return fetchJson(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export const api = {
  getDashboard() {
    return fetchJson('/api/dashboard');
  },
  getAccounts() {
    return fetchJson('/api/accounts');
  },
  getTransactions() {
    return fetchJson('/api/transactions');
  },
  getBudget() {
    return fetchJson('/api/budget');
  },
  getGoals() {
    return fetchJson('/api/goals');
  },
  getBills() {
    return fetchJson('/api/bills');
  },
  createExpense(fields) {
    return sendJson('/api/transactions/expenses', 'POST', fields);
  },
  createIncome(fields) {
    return sendJson('/api/transactions/income', 'POST', fields);
  },
  createTransfer(fields) {
    return sendJson('/api/transactions/transfers', 'POST', fields);
  },
  updateTransaction(id, fields) {
    return sendJson(`/api/transactions/${id}`, 'PUT', fields);
  },
};
