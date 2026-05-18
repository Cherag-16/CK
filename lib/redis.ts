import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

const redisConfig = {
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  password: process.env.REDIS_PASSWORD || undefined,
  database: parseInt(process.env.REDIS_DB || '0'),
};

let redisClient: ReturnType<typeof createClient> | null = null;
let connectionError: Error | null = null;

/**
 * Initialize Redis connection
 */
async function initializeRedis() {
  if (redisClient) {
    return redisClient;
  }

  try {
    const client = createClient({
      socket: {
        host: redisConfig.socket.host,
        port: redisConfig.socket.port,
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('Redis reconnection failed after 10 attempts');
            return new Error('Redis max retries exceeded');
          }
          return retries * 100;
        },
      },
      password: redisConfig.password,
      database: redisConfig.database,
    });

    client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      connectionError = err;
    });

    client.on('connect', () => {
      console.log('Connected to Redis');
      connectionError = null;
    });

    client.on('reconnecting', () => {
      console.log('Reconnecting to Redis...');
    });

    await client.connect();
    redisClient = client;
    return client;
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    throw error;
  }
}

/**
 * Get Redis client instance
 */
export async function getRedisClient() {
  if (!redisClient) {
    await initializeRedis();
  }
  return redisClient!;
}

/**
 * Get value by key
 */
export async function redisGet<T = string>(key: string): Promise<T | null> {
  try {
    const client = await getRedisClient();
    const value = await client.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  } catch (error) {
    console.error(`Error getting key ${key}:`, error);
    throw error;
  }
}

/**
 * Set value with optional expiration (in seconds)
 */
export async function redisSet<T = any>(
  key: string,
  value: T,
  expirationSeconds?: number
): Promise<void> {
  try {
    const client = await getRedisClient();
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);

    if (expirationSeconds) {
      await client.setEx(key, expirationSeconds, serializedValue);
    } else {
      await client.set(key, serializedValue);
    }
  } catch (error) {
    console.error(`Error setting key ${key}:`, error);
    throw error;
  }
}

/**
 * Delete key(s)
 */
export async function redisDel(keys: string | string[]): Promise<number> {
  try {
    const client = await getRedisClient();
    const keyArray = Array.isArray(keys) ? keys : [keys];
    return await client.del(keyArray);
  } catch (error) {
    console.error(`Error deleting keys:`, error);
    throw error;
  }
}

/**
 * Check if key exists
 */
export async function redisExists(key: string): Promise<boolean> {
  try {
    const client = await getRedisClient();
    const result = await client.exists(key);
    return result === 1;
  } catch (error) {
    console.error(`Error checking key existence:`, error);
    throw error;
  }
}

/**
 * Set expiration time for a key (in seconds)
 */
export async function redisExpire(key: string, seconds: number): Promise<boolean> {
  try {
    const client = await getRedisClient();
    const result = await client.expire(key, seconds);
    return result === 1;
  } catch (error) {
    console.error(`Error setting expiration:`, error);
    throw error;
  }
}

/**
 * Increment a numeric value
 */
export async function redisIncr(key: string): Promise<number> {
  try {
    const client = await getRedisClient();
    return await client.incr(key);
  } catch (error) {
    console.error(`Error incrementing key ${key}:`, error);
    throw error;
  }
}

/**
 * Decrement a numeric value
 */
export async function redisDecr(key: string): Promise<number> {
  try {
    const client = await getRedisClient();
    return await client.decr(key);
  } catch (error) {
    console.error(`Error decrementing key ${key}:`, error);
    throw error;
  }
}

/**
 * Push to a list
 */
export async function redisPush<T = any>(key: string, ...values: T[]): Promise<number> {
  try {
    const client = await getRedisClient();
    const serialized = values.map((v) =>
      typeof v === 'string' ? v : JSON.stringify(v)
    );
    return await client.rPush(key, serialized as string[]);
  } catch (error) {
    console.error(`Error pushing to list ${key}:`, error);
    throw error;
  }
}

/**
 * Get all values from a list
 */
export async function redisGetList<T = any>(key: string): Promise<T[]> {
  try {
    const client = await getRedisClient();
    const values = await client.lRange(key, 0, -1);
    return values.map((v) => {
      try {
        return JSON.parse(v) as T;
      } catch {
        return v as unknown as T;
      }
    });
  } catch (error) {
    console.error(`Error getting list ${key}:`, error);
    throw error;
  }
}

/**
 * Delete and close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

/**
 * Clear all keys (USE WITH CAUTION!)
 */
export async function redisClear(): Promise<void> {
  try {
    const client = await getRedisClient();
    await client.flushDb();
    console.log('Redis database cleared');
  } catch (error) {
    console.error('Error clearing Redis:', error);
    throw error;
  }
}

export default {
  getRedisClient,
  redisGet,
  redisSet,
  redisDel,
  redisExists,
  redisExpire,
  redisIncr,
  redisDecr,
  redisPush,
  redisGetList,
  closeRedis,
  redisClear,
};
