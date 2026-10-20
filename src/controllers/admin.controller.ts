import {
    Request,
    Response,
} from 'express';

export const adminDashBoard = (
    _req: Request,
    res: Response
):void => {
    res.status(200).json({
        success: true,
        message: "Welcome to admin dashboard"
    })
}