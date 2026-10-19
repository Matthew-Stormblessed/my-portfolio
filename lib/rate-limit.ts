import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export function getChatRateLimit() {
  // Reuse one limiter instance per server process to avoid rebuilding Redis and analytics clients per request.
  globalThis.chatRateLimit ??= new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(20, "10 m"),
    analytics: true,
    prefix: "portfolio-chat",
  });
  return globalThis.chatRateLimit;
}

// Keep the lazy singleton typed across Next.js hot reloads without initializing Redis at import time.
declare global {
  var chatRateLimit: Ratelimit | undefined;
}
