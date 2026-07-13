import { Router } from 'express';
import { getGoals } from '../controllers/goals-controller.js';

const router = Router();

router.get('/', getGoals);

export default router;
