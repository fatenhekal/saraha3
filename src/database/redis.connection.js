import { createClient } from "redis";
import configService from "../config/config.service.js";

export const client = createClient({
    url: configService.REDIS_URI
});

client.on("error", (err) => {
    console.log("Redis Client Error", err);
});
