import {
    Request,
    Response,
    NextFunction
} from 'express';

import { verifyAccessToken } from '../utils/token.utils';
import { UserRole } from '../models/user.model';

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authorization = req.headers.authorization;
        if(!authorization) {
            res.status(401).json({
                success: false,
                message: "Authentication required"
            });

            return;
        }

        if(!authorization.startsWith("Bearer ")) {
            res.status(401).json({
                status: false,
                message: "Invalid authorization format"
            });

            return;
        }

        const token = authorization.split(" ")[1];
        if(!token) {
            res.status(401).json({
                success: false,
                message: 'Access token missing'
            });
            return;

        }

        const decoded = verifyAccessToken(token);

        req.user = {
            userId: decoded.userId,
            role: decoded.role as UserRole
        };

        next();

    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        })
    }
}