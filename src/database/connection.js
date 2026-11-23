import mongoose from "mongoose";
import configService from "../config/config.service.js";
import { client } from "./redis.connection.js";

export const dbConnect = async () => {
    try {
        await mongoose.connect(configService.DB_URI);
        console.log("DB connected");
        await mongoose.syncIndexes();
        await client.connect();
        console.log("redis connected");
    } catch (e) {
        console.log(e.message);
        process.exit(1);
    }
};
