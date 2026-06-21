const { redis } = require('./dist/config/redis');

async function clearCache() {
  try {
    const keys = await redis.keys('__express__*');
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`Cleared ${keys.length} cache entries.`);
    } else {
      console.log('No cache entries found.');
    }
  } catch (error) {
    console.error('Failed to clear cache:', error);
  } finally {
    process.exit(0);
  }
}

clearCache();
