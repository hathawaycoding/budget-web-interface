import { getDashboardSnapshot } from './session-data-service.js';

export async function getDashboardSummary() {
  return getDashboardSnapshot();
}
