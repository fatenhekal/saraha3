import {
    cacheKeys,
    cacheService,
    createTokens,
    emailEvents,
    EmailEventsEnum,
    exceptions,
    HashEnum,
    myCompare,
    myHash,
    ProviderEnum
} from "../../common/index.js";
import { encryption } from "../../common/security/encryption.js";
import configService from "../../config/config.service.js";
import ur from "../../database/repo/user.repo.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

export const signup = async (data) => {
    let exists = await ur.findOne({
        filter: { email: data.email },
        projection: { email: 1 }
    });
    if (exists) exceptions.ConflictException("user already exists");

    data.password = await myHash({ plaintext: data.password, lib: HashEnum.argon });
    data.phone = encryption(data.phone);
    let user = await ur.create({ data });

    let otp = Math.trunc(Math.random() * 10000).toString().padStart(4, "5");
    await cacheService.set({
        key: cacheKeys.userOtpKey({ userId: user._id.toString() }),
        value: otp,
        ttl: 600
    });

    emailEvents.emit(EmailEventsEnum.signup, {
        receivers: { to: user.email },
        otp
    });

    return user;
};

export const login = async ({ email, password }) => {
    let user = await ur.findOne({
        filter: { email },
        projection: { email: 1, password: 1, role: 1, confirmEmail: 1 },
        options: { lean: true }
    });
    if (!user) exceptions.NotFoundException("user not found");
    if (!user.confirmEmail) exceptions.ForbiddenException("user not confirmed");

    let matchPassword = await myCompare({ plaintext: password, encrypted: user.password, lib: HashEnum.argon });
    if (!matchPassword) exceptions.NotFoundException("user not found");

    let tokens = createTokens({
        options: { subject: user.id || user._id.toString(), issuer: "ali", audience: [user.role] },
        role: user.role
    });

    return tokens;
};

export const rotateToken = (user, payload) => {
    let accessIAT = payload.iat * 1000;
    let accessExpIn = configService.JWT_ACCESS_EXP * 1000;
    let accessExpAt = accessExpIn + accessIAT;
    let currTime = Date.now();

    if (currTime < accessExpAt)
        exceptions.ConflictException("access token still valid");

    let { accessToken, refreshToken } = createTokens({
        options: { subject: user.id, issuer: "ali", audience: [user.role] },
        role: user.role
    });

    return {
        accessToken,
        refreshToken
    };
};

export const loginWithGmail = async (data) => {
    const ticket = await client.verifyIdToken({
        idToken: data.idToken,
        audience: configService.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    let { email, email_verified, picture, name } = payload;
    if (!email_verified) exceptions.UnauthorizedException("this email is not verified");
    let status = 200;
    let user = await ur.findOne({ filter: { email } });

    if (!user) {
        user = await ur.create({
            data: {
                email,
                image: picture,
                userName: name,
                provider: ProviderEnum.google,
                confirmEmail: new Date()
            }
        });
        status = 201;
    }

    return {
        tokens: createTokens({
            options: { subject: user.id || user._id.toString(), issuer: "ali", audience: [user.role] },
            role: user.role
        }),
        status
    };
};

export const logout = async (payload) => {
    let { exp, jti, sub } = payload;
    let nowInSec = Math.ceil(Date.now() / 1000);
    let ttl = exp - nowInSec;
    await cacheService.set({
        key: cacheKeys.userRevokeKey({ userId: sub, jti }),
        value: jti,
        ttl
    });
    return { ...payload, nowInSec, ttl };
};

export const confirmEmail = async ({ email, otp }) => {
    let user = await ur.findOne({ filter: { email } });
    if (!user) exceptions.NotFoundException("user not found");

    let storedOtp = await cacheService.get(cacheKeys.userOtpKey({ userId: user._id.toString() }));
    if (otp != storedOtp) exceptions.BadRequestException("wrong otp");

    user.confirmEmail = new Date();
    await user.save();

    await cacheService.del([cacheKeys.userOtpKey({ userId: user._id.toString() })]);
};
