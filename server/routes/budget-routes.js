import { Router } from 'express';
import { getBudget } from '../controllers/budget-controller.js';

const router = Router();

router.get('/', getBudget);

export default router;
