import { z } from "zod";
import getErrorMessage from "./getErrorMessage.js";

export default {
    password: (lang) => z.string().min(5, { error: getErrorMessage("shortPassword", lang) }).max(20),
    id: (lang) => z.string().length(24)
};
