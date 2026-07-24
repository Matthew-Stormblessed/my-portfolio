import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export function getChatRateLimit() {
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(20, "10 m"),
    analytics: true,
    prefix: "portfolio-chat",
  });
}
