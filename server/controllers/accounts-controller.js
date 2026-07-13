import { readDataStore } from '../services/data-store-service.js';

export async function getAccounts(_request, response, next) {
  try {
    const data = await readDataStore();
    response.json(data.accounts);
  } catch (error) {
    next(error);
  }
}
