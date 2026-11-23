import { Router } from "express";
import * as us from "./user.service.js";
import { authorization, response, RoleEnum, TokenTypeEnum, validation, auth } from "../../common/index.js";
import { userProfileSchema } from "./user.validation.js";

export const userController = Router();

userController.get("/profile", auth({ tokenType: TokenTypeEnum.ACCESS }), async (req, res, next) => {
    response({
        res, data: req.user, message: "user fetched"
    });
});

userController.get("/admin-profile", auth({ tokenType: TokenTypeEnum.ACCESS }), authorization([RoleEnum.admin]), async (req, res, next) => {
    response({
        res, data: req.user, message: "user fetched"
    });
});

userController.get("/user-profile/:userId", validation(userProfileSchema), async (req, res, next) => {
    let user = await us.getUserProfile(req.validate.params.userId);
    response({
        res, data: user, message: "user fetched"
    });
});

userController.patch("/update-user", auth(), async (req, res, next) => {
    let user = await us.updateUser(req.user, req.body);
    response({
        res, data: user, message: "user updated in"
    });
});
