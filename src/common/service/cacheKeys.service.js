export const userRevokeKey = ({ userId, jti }) => {
    return `user${userId}:revoke:${jti}`;
};

export const userOtpKey = ({ userId }) => {
    return `user${userId}:OTP`;
};
