import { getAccountsSnapshot } from './session-data-service.js';

export async function getAccountsData() {
  return getAccountsSnapshot();
}
