import dotenv from 'dotenv';

dotenv.config();

import app from './app';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
    try {
        await connectDatabase();
        await connectRedis();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    } catch (error) {
        console.error("Server startup failed", error);
        process.exit(1)
    }

};

startServer();