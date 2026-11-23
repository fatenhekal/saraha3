import { NotFoundException } from "../../common/utils/exceptions.js";
import ur from "../../database/repo/user.repo.js";

export const updateUser = async (userData, data) => {
    let user = await ur.findByIdAndUpdate({ id: userData._id, update: data });
    return user;
};

export const getUserProfile = async (userId) => {
    let user = await ur.findById({
        id: userId,
        projection: { password: 0, __v: 0, updatedAt: 0, createdAt: 0, role: 0 }
    });
    if (!user) NotFoundException("user not found");

    return user;
};
