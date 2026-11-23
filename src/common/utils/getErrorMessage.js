import { LangEnum } from "../enums/index.js";

export default (code, lang) => {
    let langString = lang == LangEnum.ar ? "ar" : "en";
    return messages[code][langString];
};

let messages = {
    shortPassword: {
        ar: "كلمة السر قصيرة جدا", en: "password is too short"
    },
    invalidEmail: {
        ar: "ايميل غير صالح", en: "invalid email"
    }
};

export const keys = Object.keys(messages);
