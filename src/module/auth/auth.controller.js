import { Router } from "express";
import * as as from "./auth.service.js";
import { response, TokenTypeEnum, validation, auth } from "../../common/index.js";
import { confirmEmailSchema, loginSchema, signupSchema } from "./auth.validation.js";

export const authController = Router();

authController.post("/signup", validation(signupSchema), async (req, res, next) => {
    let user = await as.signup(req.validate.body);
    response({
        res, data: user, status: 201, message: "user created"
    });
});

authController.post("/login", validation(loginSchema), async (req, res, next) => {
    let user = await as.login(req.validate.body);
    response({
        res, data: user, message: "user logged in"
    });
});

authController.post("/rotate-token", auth({ tokenType: TokenTypeEnum.REFRESH }), async (req, res, next) => {
    let tokens = await as.rotateToken(req.user, req.payload);
    response({
        res, data: tokens, message: "token rotated"
    });
});

authController.post("/loginWithGmail", async (req, res, next) => {
    let { tokens, status } = await as.loginWithGmail(req.body);
    response({
        res, data: tokens, status, message: status == 200 ? "user logged in" : "user created"
    });
});

authController.post("/logout", auth({ tokenType: TokenTypeEnum.REFRESH }), async (req, res, next) => {
    let data = await as.logout(req.payload);
    response({
        res,
        data
    });
});

authController.post("/confirm-email", validation(confirmEmailSchema), async (req, res, next) => {
    let data = await as.confirmEmail(req.validate.body);
    response({
        res,
        data,
        message: "your email is confirmed"
    });
});
