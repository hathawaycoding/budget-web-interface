import { getBudgetSnapshot } from './session-data-service.js';

export async function getBudgetData() {
  return getBudgetSnapshot();
}
