import { Router } from 'express';
import {
  createExpense,
  createIncome,
  createTransfer,
  getTransactions,
  updateTransaction,
} from '../controllers/transactions-controller.js';

const router = Router();

router.get('/', getTransactions);
router.post('/expenses', createExpense);
router.post('/income', createIncome);
router.post('/transfers', createTransfer);
router.put('/:id', updateTransaction);

export default router;
