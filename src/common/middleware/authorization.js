import { UnauthorizedException } from "../utils/exceptions.js";

export const authorization = (acceptedRoles = []) => {
    return (req, res, next) => {
        let role = req.user.role;
        if (!acceptedRoles.includes(role))
            UnauthorizedException();

        next();
    };
};
