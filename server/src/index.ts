import express from 'express';
import { connectToDatabase } from './connections/connection';
import userRouter from './routes/UserRoutes';
import AdminRouter from './routes/AdminRoutes';

import cors from 'cors';

const app = express();

const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

const startServer = async () => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
};

startServer();

app.use(express.json());
app.use('/user', userRouter);
app.use('/admin', AdminRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  
  console.log(`Server is running on port ${PORT}`);
});
