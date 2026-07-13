import { Router } from 'express';
import { getBills } from '../controllers/bills-controller.js';

const router = Router();

router.get('/', getBills);

export default router;
