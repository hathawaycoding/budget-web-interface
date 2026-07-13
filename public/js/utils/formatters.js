const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

export function formatCurrency(value) {
  return currencyFormatter.format(value);
}

export function formatDate(value) {
  return dateFormatter.format(new Date(value));
}

export function formatPercent(value) {
  return `${Math.round(value)}%`;
}
