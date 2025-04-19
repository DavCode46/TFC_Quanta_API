import { Router } from "express";
import {
  getCompleteCryptosData,
  getCryptoData,
} from "../controllers/crypto.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/data", authenticate, getCryptoData);
router.get("/complete-data", authenticate, getCompleteCryptosData);

export default router;
