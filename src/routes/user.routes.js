import { Router } from 'express';

import * as userController from '../controllers/user.controller.js';

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', userController.getUserByEmail);

export default router;
