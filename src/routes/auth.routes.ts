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


const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/refresh", validate(refreshTokenSchema), refresh);
router.post("/login", validate(loginSchema), login);
router.post("/logout", authenticate, logout);

export default router;