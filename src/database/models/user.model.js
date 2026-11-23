import mongoose from "mongoose";
import { GenderEnum } from "../../common/enums/gender.enum.js";
import { RoleEnum } from "../../common/enums/role.enum.js";
import { ProviderEnum } from "../../common/enums/provider.enum.js";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        maxLength: 50,
        minLength: 2,
        required: true
    },
    lastName: {
        type: String,
        maxLength: 50,
        minLength: 2,
        required: true
    },
    email: {
        type: String,
        maxLength: 50,
        minLength: 2,
        required: true,
        unique: true
    },
    gender: {
        type: Number,
        enum: Object.values(GenderEnum),
        default: GenderEnum.male
    },
    password: {
        type: String,
        required: function () {
            return this.provider == ProviderEnum.system;
        }
    },
    phone: {
        type: String
    },
    role: {
        type: Number,
        enum: Object.values(RoleEnum),
        default: RoleEnum.user
    },
    provider: {
        type: Number,
        enum: Object.values(ProviderEnum),
        default: ProviderEnum.system
    },
    image: String,
    confirmEmail: {
        type: Date
    }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    autoIndex: true
});

userSchema.virtual("userName").set(function (value) {
    let [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
}).get(function () {
    return `${this.firstName} ${this.lastName}`;
});

export const userModel = mongoose.model("User", userSchema);
