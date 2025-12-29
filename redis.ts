import { createClient } from 'redis';
import { logger } from '../utils/logger';

let redisClient: any = null;

export const initializeRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      retry_unfulfilled_commands: true,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 1000)
      }
    });

    redisClient.on('error', (err: Error) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('📦 Redis connected successfully');
    });

    redisClient.on('reconnecting', () => {
      logger.warn('Redis reconnecting...');
    });

    await redisClient.connect();
  } catch (error) {
    logger.warn('Redis connection failed, running without cache:', error);
    redisClient = null;
  }
};

// Cache wrapper functions
export const cacheGet = async (key: string) => {
  if (!redisClient) return null;
  
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.warn(`Cache get error for key ${key}:`, error);
    return null;
  }
};

export const cacheSet = async (key: string, data: any, expirationInSeconds: number = 3600) => {
  if (!redisClient) return;
  
  try {
    await redisClient.setEx(key, expirationInSeconds, JSON.stringify(data));
  } catch (error) {
    logger.warn(`Cache set error for key ${key}:`, error);
  }
};

export const cacheDel = async (key: string) => {
  if (!redisClient) return;
  
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.warn(`Cache delete error for key ${key}:`, error);
  }
};

export const cacheDelPattern = async (pattern: string) => {
  if (!redisClient) return;
  
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    logger.warn(`Cache delete pattern error for ${pattern}:`, error);
  }
};

// Session management
export const setUserSession = async (userId: string, sessionData: any, expirationInSeconds: number = 86400) => {
  await cacheSet(`session:${userId}`, sessionData, expirationInSeconds);
};

export const getUserSession = async (userId: string) => {
  return await cacheGet(`session:${userId}`);
};

export const deleteUserSession = async (userId: string) => {
  await cacheDel(`session:${userId}`);
};

// Rate limiting
export const incrementRateLimit = async (key: string, windowInSeconds: number = 900): Promise<number> => {
  if (!redisClient) return 0;
  
  try {
    const current = await redisClient.incr(key);
    if (current === 1) {
      await redisClient.expire(key, windowInSeconds);
    }
    return current;
  } catch (error) {
    logger.warn(`Rate limit error for key ${key}:`, error);
    return 0;
  }
};

// Leaderboards and rankings
export const updateSparkRanking = async (userId: string, sparks: number) => {
  if (!redisClient) return;
  
  try {
    await redisClient.zAdd('spark_leaderboard', { score: sparks, value: userId });
  } catch (error) {
    logger.warn('Spark ranking update error:', error);
  }
};

export const getSparkLeaderboard = async (start: number = 0, end: number = 9) => {
  if (!redisClient) return [];
  
  try {
    return await redisClient.zRevRange('spark_leaderboard', start, end, { BY: 'RANK', WITH_SCORES: true });
  } catch (error) {
    logger.warn('Get spark leaderboard error:', error);
    return [];
  }
};

// Content caching helpers
export const cacheUserProfile = async (userId: string, profileData: any) => {
  await cacheSet(`profile:${userId}`, profileData, 3600); // 1 hour
};

export const getCachedUserProfile = async (userId: string) => {
  return await cacheGet(`profile:${userId}`);
};

export const invalidateUserCache = async (userId: string) => {
  await cacheDelPattern(`profile:${userId}`);
  await cacheDelPattern(`user:${userId}:*`);
};

export const cachePopularContent = async (type: string, data: any) => {
  await cacheSet(`popular:${type}`, data, 1800); // 30 minutes
};

export const getCachedPopularContent = async (type: string) => {
  return await cacheGet(`popular:${type}`);
};

export const getRedisClient = () => redisClient;