import { readDataStore } from '../services/data-store-service.js';

export async function getBudget(_request, response, next) {
  try {
    const data = await readDataStore();
    response.json(data.budget);
  } catch (error) {
    next(error);
  }
}
