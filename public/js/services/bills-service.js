import { getBillsSnapshot } from './session-data-service.js';

export async function getBillsData() {
  return getBillsSnapshot();
}
