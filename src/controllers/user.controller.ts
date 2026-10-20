import {
    Request,
    Response
} from "express"

import { getUserById } from "../services/user.service"

export const getMe = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        if(!req.user) {
            res.status(401).json({
                success: false,
                message: "Authentication required"
            });
            return;
        } 
        const user = await getUserById(req.user.userId)
        res.status(200).json({
            success: true,
            user
        })
    } catch(error) {
        if(
            error instanceof Error &&
            error.message === "USER_NOT_FOUND"
        ) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        throw error;
    }
}