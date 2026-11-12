import { Router } from 'express';

import { getMe } from '../controllers/user.controller';

import { authenticate } from '../middleware/auth.middleware';

import { userRateLimiter } from '../config/rate-limit';

const router = Router();

router.get("/me", authenticate, userRateLimiter, getMe)

export default router;