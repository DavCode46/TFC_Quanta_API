import { Router } from "express";
import { getCryptoData } from "../controllers/crypto.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/data", authenticate, getCryptoData);

export default router;
