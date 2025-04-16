import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import accountRoutes from './routes/account.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      console.log("Request from:", origin);
      if (!origin) {
        // ✅ permitir peticiones sin origin (React Native, Postman, etc.)
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);


app.use('/api/users', userRoutes)
app.use('/api/accounts', accountRoutes)
app.use('/api/transactions',transactionRoutes)

mongoose.connect(process.env.MONGODB_URI)
  .then(
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  ).catch((error) => console.error(error))
