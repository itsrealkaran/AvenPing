#!/usr/bin/env node

const Redis = require('ioredis');

async function setupRedis() {
  console.log('🔧 Setting up Redis for Flow Runner...');
  
  try {
    // Connect to Redis
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    
    // Test connection
    await redis.ping();
    console.log('✅ Redis connection successful');
    
    // Test basic operations
    const testKey = 'flow_runner_test';
    const testValue = { test: true, timestamp: Date.now() };
    
    await redis.setex(testKey, 60, JSON.stringify(testValue));
    console.log('✅ Redis write test successful');
    
    const retrieved = await redis.get(testKey);
    const parsed = JSON.parse(retrieved);
    console.log('✅ Redis read test successful');
    
    await redis.del(testKey);
    console.log('✅ Redis delete test successful');
    
    // Close connection
    await redis.quit();
    
    console.log('\n🎉 Redis setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Make sure Redis is running: redis-server');
    console.log('2. Set REDIS_URL in your .env file if using custom configuration');
    console.log('3. Start your application: npm run dev');
    
  } catch (error) {
    console.error('❌ Redis setup failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure Redis is installed and running');
    console.log('2. Check your REDIS_URL environment variable');
    console.log('3. Try: redis-server --daemonize yes');
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupRedis();
}

module.exports = { setupRedis }; 