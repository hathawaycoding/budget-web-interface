export function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

export function ensureNumber(value) {
  return typeof value === 'number' ? value : 0;
}
