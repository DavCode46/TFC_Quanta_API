import compression from "compression";
import cors from "cors";
import express from "express";
import upload from "express-fileupload";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import accountRoutes from "./routes/account.routes.js";
import cryptoRoutes from "./routes/crypto.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import resetRoutes from "./routes/resetPassword.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import userRoutes from "./routes/user.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    },
  })
);
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(upload());

app.use("/uploads", express.static(join(__dirname, "uploads")));

app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/cryptos", cryptoRoutes);
app.use("/api/password", resetRoutes);
app.use("/api/faq", faqRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

export default app;
