import { Router } from 'express';

import { 
    register,
    login,
    refresh,
    logout
} from '../controllers/auth.controller';

import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { loginSchema, refreshTokenSchema, registerSchema } from '../validators/auth.validator';

import { ipRateLimiter } from '../config/rate-limit';

const router = Router();

router.post("/register", ipRateLimiter, validate(registerSchema), register);
router.post("/refresh", ipRateLimiter, validate(refreshTokenSchema), refresh);
router.post("/login", ipRateLimiter, validate(loginSchema), login);
router.post("/logout", ipRateLimiter, authenticate, logout);

export default router;