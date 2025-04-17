import { Router } from "express";

import * as userController from "../controllers/user.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.patch("/update", authenticate, userController.updateUserInfo);
router.get("/me/:email", authenticate, userController.getUserByEmail);

export default router;
