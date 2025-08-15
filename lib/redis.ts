import Redis from "ioredis"

// Create Redis client instance
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

// Handle Redis connection events
redis.on("connect", () => {
  console.log("Redis connected")
})

redis.on("error", (error) => {
  console.error("Redis error:", error)
})

redis.on("close", () => {
  console.log("Redis connection closed")
})

export default redis
