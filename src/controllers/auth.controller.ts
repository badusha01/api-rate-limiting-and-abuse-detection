import { Request, Response } from 'express';

import { 
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser
} from '../services/auth.service';

export const register = async (
    req: Request,
    res: Response,

): Promise<void> => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        })
    } catch (error) {
        if(error instanceof Error && error.message == "USER_ALREADY_EXISTS") {
            res.status(409).json({
                success: false,
                message: "User with this mail already exists"
            });
            return;
        }
        throw error
    }
}     

export const login = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const result = await loginUser(req.body);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            ...result
        });
    } catch (error) {
        if(error instanceof Error && error.message === "USER_INACTIVE") {
            res.status(403).json({
                success: false,
                message: "User account inactive"
            })
            return;
        }
        throw error;
    }
};

export const refresh = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const result = await refreshAccessToken(req.body.refreshToken);
        res.status(200).json({
            success: true,
            ...result
        });
        
    } catch {
        res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token"
        })
    }
}

export const logout = async(
    req: Request,
    res: Response,
):Promise<void> => {
    try {
        if(!req.user) {
            res.status(401).json({
                success: false,
                message: "Authentication required"
            });

            return;
        }

        await logoutUser(req.user.userId);

        res.status(200).json({
            success: true,
            message: "Logout successful"
        })
    } catch {
        res.status(500).json({
            success: false,
            message: "Logout failed"
        })
    }
}

