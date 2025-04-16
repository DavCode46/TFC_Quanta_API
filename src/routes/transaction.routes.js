import { Router } from 'express';
import * as transactionController from '../controllers/transaction.controller.js';
import authenticate from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/addMoney', authenticate, transactionController.addMoney)

export default router

