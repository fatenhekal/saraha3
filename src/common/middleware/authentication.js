import ur from "../../database/repo/user.repo.js";
import { AuthEnum, cacheKeys, cacheService, exceptions, myCompare, TokenTypeEnum } from "../index.js";
import { verifyToken } from "../security/jwt.js";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../utils/exceptions.js";

export const auth = ({ tokenType = TokenTypeEnum.ACCESS } = {}) => {
    return async (req, res, next) => {
        if (!req.headers.authorization)
            exceptions.BadRequestException("token not provided");

        let [prefix, token] = req.headers.authorization.split(" ");
        if (!token)
            exceptions.BadRequestException("token not provided");

        switch (prefix) {
            case AuthEnum.Basic: {
                let data = Buffer.from(token, "base64").toString();
                let [email, password] = data.split(":");
                let user = await ur.findOne({ filter: { email } });

                if (!user) NotFoundException("user not found");

                let correctPassword = await myCompare({ plaintext: password, encrypted: user.password });

                if (!correctPassword) NotFoundException("user not found");
                req.user = user;
                next();
                break;
            }

            case AuthEnum.Bearer: {
                let payload = verifyToken({
                    token,
                    tokenType
                });

                if (payload.jti) {
                    let isRevoked = await cacheService.get(
                        cacheKeys.userRevokeKey({ userId: payload.sub, jti: payload.jti })
                    );
                    if (isRevoked) UnauthorizedException("token is revoked");
                }

                req.user = await ur.findById({ id: payload.sub });
                if (!req.user) NotFoundException("user not found");
                req.payload = payload;
                next();
                break;
            }

            default:
                BadRequestException("invalid auth method");
        }
    };
};
