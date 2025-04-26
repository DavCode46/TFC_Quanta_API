import { Router } from "express";

import * as resetController from "../controllers/resetPassword.controller.js";

const router = Router();

router.post("/forgot", resetController.sendCode);
router.post("/reset", resetController.resetPassword);

export default router;
