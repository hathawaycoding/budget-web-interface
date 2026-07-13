import { readDataStore } from '../services/data-store-service.js';

export async function getDashboard(_request, response, next) {
  try {
    const data = await readDataStore();
    response.json(data.dashboard);
  } catch (error) {
    next(error);
  }
}
