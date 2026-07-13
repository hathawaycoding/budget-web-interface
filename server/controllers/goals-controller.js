import { readDataStore } from '../services/data-store-service.js';

export async function getGoals(_request, response, next) {
  try {
    const data = await readDataStore();
    response.json(data.goals);
  } catch (error) {
    next(error);
  }
}
