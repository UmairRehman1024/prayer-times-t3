import { Redis } from "@upstash/redis";
import { env } from "~/env.mjs";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});


export const prayerRouter = createTRPCRouter({
  getPrayerTimes: publicProcedure.query(async () => {
    const prayers: unknown[] = [];
    await redis.get("fajr").then((value) => prayers.push(value));
    await redis.get("sunrise").then((value) => prayers.push(value));
    await redis.get("dhuhr").then((value) => prayers.push(value));
    await redis.get("asr").then((value) => prayers.push(value));
    await redis.get("maghrib").then((value) => prayers.push(value));
    await redis.get("isha").then((value) => prayers.push(value));
    return prayers as number[];
  }),

});

