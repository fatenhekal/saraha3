import { z } from "zod";
import { GenderEnum, gf } from "../../common/index.js";
import getErrorMessage from "../../common/utils/getErrorMessage.js";

export const loginSchema = (lang) => z.object({
    body: z.strictObject({
        email: z.email({ error: getErrorMessage("invalidEmail", lang) }),
        password: gf.password(lang)
    })
});

export const signupSchema = (lang) => z.object({
    body: loginSchema(lang).shape.body.safeExtend({
        userName: z.string({ error: "not a string" }).min(5, { error: "minimum is 5" }),
        confirmPassword: z.string(),
        phone: z.e164({ pattern: /^01[0-25]\d{8}$/ }),
        gender: z.enum(GenderEnum)
    }).superRefine(({ password, confirmPassword, userName, email }, ctx) => {
        if (password != confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword", "password"],
                message: "confirm password don't match password"
            });
        }

        if (!userName.includes(" ")) {
            ctx.addIssue({
                code: "custom",
                path: ["userName"],
                message: "userName must include space"
            });
        }

        if (!email.endsWith("@gmail.com")) {
            ctx.addIssue({
                code: "custom",
                path: ["email"],
                message: "email must include @gmail.com"
            });
        }
    })
});

export const confirmEmailSchema = (lang) => z.object({
    body: z.strictObject({
        email: z.email({ error: getErrorMessage("invalidEmail", lang) }),
        otp: z.string().length(4)
    })
});
