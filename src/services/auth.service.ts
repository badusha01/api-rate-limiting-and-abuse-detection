import crypto from "crypto";

import User from '../models/user.model';

import {
    comparePassword,
    hashPassword
} from '../utils/password.util'

import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from '../utils/token.utils';

interface RegisterInput {
    name: string,
    email: string,
    password: string
}

interface LoginInput {
    email: string,
    password: string
}

const hashRefreshToken = (
    token: string,
): string => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

export const registerUser = async (
    input: RegisterInput
) => {
    const {name, email, password} = input;
    const existingUser = await User.findOne({ email });
    if(existingUser) {
        throw new Error("USER_ALREADY_EXISTS");
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
}

export const loginUser = async (
    input: LoginInput
) => {
    const {email, password} = input;
    const user = await User.findOne({
        email
    }).select("+password +refreshTokenHash")

    if(!user) {
        throw new Error("INVALID_CREDENTIALS")
    }

    if(!user.isActive) {
        throw new Error("USER_INACTIVE");
    }

    const passwordMatches = await comparePassword(password, user.password)

    if(!passwordMatches) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const accessToken = generateAccessToken(
        user._id.toString(),
        user.role
    );

    const refreshToken = generateRefreshToken(
        user._id.toString()
    );

    user.refreshTokenHash = hashRefreshToken(refreshToken)

    await user.save();

    return {
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    }
}

export const refreshAcessToken = async(refreshToken: string) => {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(
        decoded.userId
    ).select("+refreshTokenHash");

    if(!user) {
        throw new Error("User not found");
    }
    
    if(!user.isActive) {
        throw new Error("USER_INACTIVE")
    }

    if(!user.refreshTokenHash) {
        throw new Error("REFRESH_TOKEN_REVOKED");
    }

    const incomingHash = hashRefreshToken(refreshToken);

    if(incomingHash !== user.refreshTokenHash) {
        throw new Error("REFRESH_TOKEN_REVOKED")
    }

    const newAccessToken = generateAccessToken(user._id.toString(), user.role);

    const newRefreshToken = generateRefreshToken(user._id.toString());

    user.refreshTokenHash = hashRefreshToken(newRefreshToken);

    await user.save();

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    }
}

export const logoutUser = async(userId: string): Promise<void> => {
    await User.findByIdAndUpdate(
        userId, {
            $unset: {
                refreshTokenHash: 1
            }
        }
    )
}