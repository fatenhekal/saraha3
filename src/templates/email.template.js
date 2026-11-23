export const emailTemplate = ({ title, message, otp, expiresIn }) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 24px; border: 1px solid #e1e4e8;">
        <h2 style="color: #1e3a5f; margin-top: 0;">${title}</h2>
        <p style="color: #333333; font-size: 15px;">${message}</p>
        <div style="margin: 20px 0; padding: 14px; background-color: #f0f4f8; border-radius: 6px; text-align: center; font-size: 26px; font-weight: bold; letter-spacing: 6px; color: #0f4c81;">
            ${otp}
        </div>
        <p style="color: #666666; font-size: 13px;">This code will expire in ${expiresIn}.</p>
    </div>
</body>
</html>`;
};
