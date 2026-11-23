import nodemailer from "nodemailer";
import configService from "../../config/config.service.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: configService.EMAIL_USER,
        pass: configService.EMAIL_PASS,
    },
});

export const sendMail = async ({
    receivers: { to, cc, bcc },
    subject,
    text,
    html,
    attachments
}) => {
    try {
        const info = await transporter.sendMail({
            from: configService.EMAIL_USER,
            to,
            cc,
            bcc,
            subject,
            text,
            html,
            attachments
        });
        return info;
    } catch (error) {
        console.error(error);
    }
};
