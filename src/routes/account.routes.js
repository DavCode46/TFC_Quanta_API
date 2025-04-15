import Router from 'express';

import * as accountController from '../controllers/account.controller.js';
import authenticate from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/create', accountController.createAccount);
router.delete('/delete',authenticate, accountController.deleteAccount);
router.get('/get', authenticate, accountController.getAccountByUserId);

export default router;
