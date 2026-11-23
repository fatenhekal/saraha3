import { EventEmitter } from "node:events";
import { EmailEventsEnum } from "../enums/index.js";
import { sendMail } from "./mail.service.js";
import { emailTemplate } from "../../templates/email.template.js";

export const emailEvents = new EventEmitter();

emailEvents.on(EmailEventsEnum.signup, async (data) => {
    try {
        let { receivers, otp } = data;
        await sendMail({
            receivers,
            subject: "confirm email",
            html: emailTemplate({
                title: "confirm email",
                message: "confirm your email",
                otp,
                expiresIn: "10 minutes"
            })
        });
    } catch (error) {
        console.error(error);
    }
});
