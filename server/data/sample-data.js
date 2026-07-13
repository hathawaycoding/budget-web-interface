export const dashboardData = {
  balance: 7435.21,
  income: 5200,
  expenses: 3120,
  savings: 2080,
  budgetRemaining: 1150,
};

export const accountsData = [
  { id: 1, name: 'Checking', balance: 5431.12 },
  { id: 2, name: 'Savings', balance: 2004.09 },
  { id: 3, name: 'Credit Card', balance: -345.88 },
];

export const transactionsData = [
  { id: 1, date: '2026-07-02', merchant: 'City Payroll', category: 'Payroll', amount: 3200 },
  { id: 2, date: '2026-07-03', merchant: 'Fresh Market', category: 'Food', amount: -82.44 },
  { id: 3, date: '2026-07-04', merchant: 'Metro Transit', category: 'Transportation', amount: -28.5 },
  { id: 4, date: '2026-07-05', merchant: 'Netflix', category: 'Subscriptions', amount: -18.99 },
  { id: 5, date: '2026-07-06', merchant: 'Amazon', category: 'Shopping', amount: -53.22 },
  { id: 6, date: '2026-07-07', merchant: 'Luna Studio', category: 'Freelance', amount: 850 },
  { id: 7, date: '2026-07-08', merchant: 'Shell', category: 'Transportation', amount: -46.17 },
  { id: 8, date: '2026-07-09', merchant: 'Walmart', category: 'Shopping', amount: -94.3 },
  { id: 9, date: '2026-07-10', merchant: 'Starbucks', category: 'Food', amount: -14.75 },
  { id: 10, date: '2026-07-11', merchant: 'Spotify', category: 'Subscriptions', amount: -11.99 },
  { id: 11, date: '2026-07-12', merchant: 'Electric Company', category: 'Utilities', amount: -120 },
  { id: 12, date: '2026-07-13', merchant: 'Cineplex', category: 'Entertainment', amount: -34 },
  { id: 13, date: '2026-07-14', merchant: 'Whole Foods', category: 'Food', amount: -71.28 },
  { id: 14, date: '2026-07-15', merchant: 'Internet Provider', category: 'Utilities', amount: -80 },
  { id: 15, date: '2026-07-16', merchant: 'Apple Store', category: 'Shopping', amount: -129.99 },
  { id: 16, date: '2026-07-17', merchant: 'Side Gig Client', category: 'Freelance', amount: 300 },
];

export const budgetData = [
  { category: 'Food', budget: 600, spent: 420 },
  { category: 'Transportation', budget: 300, spent: 210 },
  { category: 'Entertainment', budget: 200, spent: 120 },
  { category: 'Utilities', budget: 400, spent: 300 },
  { category: 'Shopping', budget: 500, spent: 380 },
  { category: 'Subscriptions', budget: 150, spent: 95 },
];

export const goalsData = [
  { name: 'Vacation', current: 1300, target: 2000 },
  { name: 'Emergency Fund', current: 8000, target: 10000 },
  { name: 'New Laptop', current: 2400, target: 6000 },
];

export const billsData = [
  { id: 1, merchant: 'Electric Company', amount: 120, dueDate: '2026-07-20', status: 'upcoming' },
  { id: 2, merchant: 'Phone Provider', amount: 65, dueDate: '2026-07-25', status: 'upcoming' },
  { id: 3, merchant: 'Mortgage', amount: 1800, dueDate: '2026-08-01', status: 'scheduled' },
  { id: 4, merchant: 'Internet Provider', amount: 80, dueDate: '2026-07-28', status: 'upcoming' },
  { id: 5, merchant: 'Car Insurance', amount: 150, dueDate: '2026-08-05', status: 'scheduled' },
];
