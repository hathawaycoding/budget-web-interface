import { Router } from 'express';
import { getAccounts } from '../controllers/accounts-controller.js';

const router = Router();

router.get('/', getAccounts);

export default router;
