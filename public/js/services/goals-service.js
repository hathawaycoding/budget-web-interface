import { getGoalsSnapshot } from './session-data-service.js';

export async function getGoalsData() {
  return getGoalsSnapshot();
}
