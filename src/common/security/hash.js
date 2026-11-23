import { hash, compare, genSalt } from "bcrypt";
import configService from "../../config/config.service.js";
import { HashEnum } from "../index.js";
import argon2 from "argon2";

export const myHash = async ({ plaintext, minor = 'b', lib = HashEnum.argon }) => {
    switch (lib) {
        case HashEnum.bcrypt: {
            let salt = await genSalt(configService.SALT, minor);
            let result = await hash(plaintext, salt);
            return result;
        }
        case HashEnum.argon:
            return await argon2.hash(plaintext);
    }
};

export const myCompare = async ({ plaintext, encrypted, lib = HashEnum.argon }) => {
    switch (lib) {
        case HashEnum.bcrypt:
            return await compare(plaintext, encrypted);
        case HashEnum.argon:
            return await argon2.verify(encrypted, plaintext);
    }
};
