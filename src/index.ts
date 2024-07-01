import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
import userRouter from './routes/userRoutes';
import videoRouter from './routes/videoRoutes';
import checkAuth from './middleware/checkAuth';

dotenv.config();

const app = express();
app.use(express.json());

const whitelist = [process.env.FRONTEND_URL];
const corsOptions: CorsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}
app.use(cors(corsOptions));

app.use('/api/users', userRouter)
app.use('/api/videos', videoRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
