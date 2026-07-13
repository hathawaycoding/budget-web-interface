import { readDataStore } from '../services/data-store-service.js';

export async function getBills(_request, response, next) {
  try {
    const data = await readDataStore();
    response.json(data.bills);
  } catch (error) {
    next(error);
  }
}
