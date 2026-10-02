import jwt from 'jsonwebtoken';

interface AccessTokenPayload {
    userId: string;
    role: string;
}

interface RefreshTokenPayload {
    userId: string;
}

const getAccessSecret = (): string => {
    const secret = process.env.JWT_ACCESS_SECRET;
    
    if(!secret) {
        throw new Error("Access token not configured")
    }
    return secret;
};

const getRefreshSecret = (): string => {
    const secret = process.env.JWT_REFRESH_SECRET;

    if(!secret) {
        throw new Error("Refresh token not configured")
    }
    return secret;
}

export const generateAccessToken =(
    userId: string,
    role: string
): string => {
    return jwt.sign({
        userId,
        role
    },
    getAccessSecret(),
    {
        expiresIn:"30m"
    }
)
};


const generateRefreshToken = (
    userId: string
): string => {
    return jwt.sign(
        {
            userId
        },
        getRefreshSecret(),
        {
            expiresIn: "7d"
        }
    )
}

export const verifyAccessToken = (
    token: string
): AccessTokenPayload => {
    return jwt.verify(
        token,
        getAccessSecret()
    ) as AccessTokenPayload
};

export const verifyRefreshToken = (
    token: string,
): RefreshTokenPayload => {
    return jwt.verify(
        token,
        getRefreshSecret()
    ) as RefreshTokenPayload
}
