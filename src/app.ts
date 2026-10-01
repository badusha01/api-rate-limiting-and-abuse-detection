import express, { urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import healthRoutes from './routes/health.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(morgan("dev"))

app.get("/", (_req, res) => {
    res.json({
        message: "Abuse detection Platform API"
    });
});

app.use("/api/v1/health", healthRoutes);

app.use(errorHandler);

export default app;