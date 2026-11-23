import { client } from "../../database/redis.connection.js";

export const set = async ({ key, value, ttl }) => {
    if (typeof value !== "string") {
        value = JSON.stringify(value);
    }
    return await client.set(key, value, ttl ? { EX: ttl } : undefined);
};

export const get = async (key) => {
    let data = await client.get(key);
    try {
        return JSON.parse(data);
    } catch (error) {
        return data;
    }
};

export const ttl = async (key) => {
    return await client.ttl(key);
};

export const expire = async (key, ttl) => {
    return await client.expire(key, ttl);
};

export const exists = async (key) => {
    return await client.exists(key);
};

export const keys = async (prefix) => {
    return await client.keys(`${prefix}*`);
};

export const del = async (keys) => {
    return await client.del(keys);
};

export const delByPrefix = async (prefix) => {
    const matchedKeys = await keys(prefix);
    if (matchedKeys.length) {
        return await client.del(matchedKeys);
    }
};

export const incr = async (key, incr = 1) => {
    return await client.incrBy(key, incr);
};
