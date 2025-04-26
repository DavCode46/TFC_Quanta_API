import { Router } from "express";

import * as resetController from "../controllers/resetPassword.controller.js";

const router = Router();

router.post("/reset-password", resetController.sendCode);

export default router;
