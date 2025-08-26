import Redis from "ioredis"

type RedisLike = {
  on: (event: string, handler: (...args: any[]) => void) => void
  get: (key: string) => Promise<string | null>
  set: (key: string, value: string) => Promise<"OK" | null>
  setex: (key: string, seconds: number, value: string) => Promise<"OK" | null>
  del: (key: string) => Promise<number>
  ping: () => Promise<string>
  quit: () => Promise<unknown>
  publish?: (channel: string, message: string) => Promise<number>
  subscribe?: (channel: string) => Promise<number>
}

const shouldStub = process.env.SKIP_REDIS === "1"

function createStubRedis(): RedisLike {
  const noop = () => {}
  const resolved = async <T>(val: T) => val
  return {
    on: noop,
    get: async () => null,
    set: async () => "OK",
    setex: async () => "OK",
    del: async () => 0,
    ping: async () => "PONG",
    quit: async () => undefined,
    publish: async () => 0,
    subscribe: async () => 0,
  }
}

let redis: Redis | RedisLike

if (shouldStub) {
  redis = createStubRedis()
} else {
  // Create Redis client instance
  const client = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

  // Handle Redis connection events
  client.on("connect", () => {
    console.log("Redis connected")
  })

  client.on("error", (error) => {
    console.error("Redis error:", error)
  })

  client.on("close", () => {
    console.log("Redis connection closed")
  })

  redis = client
}

export default redis as Redis & RedisLike
