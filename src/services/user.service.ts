import User from "../models/user.model";

export const getUserById = async(
    userId: string
) => {
    const user = await User.findById(userId).select("_id name email role isActive createdAt updatedAt");

    if(!user) {
        throw new Error("USER_NOT_FOUND")
    }

    return user;

}