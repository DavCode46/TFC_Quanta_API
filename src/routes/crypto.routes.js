import { Router } from "express";
import {
  getCompleteCryptoDataById,
  getCompleteCryptosData,
  getCryptoData,
  getCryptoDataById,
} from "../controllers/crypto.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/data", authenticate, getCryptoData);
router.get("/complete-data", authenticate, getCompleteCryptosData);
router.get("/data/:id", authenticate, getCryptoDataById);
router.get("/complete-data/:id", authenticate, getCompleteCryptoDataById);

export default router;
