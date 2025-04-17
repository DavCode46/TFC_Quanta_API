import { Router } from 'express';
import * as transactionController from '../controllers/transaction.controller.js';
import authenticate from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/add', authenticate, transactionController.addMoney)
router.post('/withdraw', authenticate, transactionController.withdrawMoney)
router.post('/transfer', authenticate, transactionController.transferMoney)
router.get('/account/:email', authenticate, transactionController.getTransactionsByUser)

export default router

