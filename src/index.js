import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import userRoutes from './routes/user.routes.js';

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', userRoutes)

mongoose.connect(process.env.MONGODB_URI)
  .then(
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  ).catch((error) => console.error(error))
