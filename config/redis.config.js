import { createClient } from 'redis';
const redisConnect=async () => {
  try {
    const client = createClient({
        url: process.env.REDIS_URL
    });
  
    client.on('error', (err) => console.log('Redis Client Error', err));
    client.on("ready",()=>console.log("Redis Connected Successfully"))
    await client.connect();
    await client.ping()
    return client
  } catch (error) {
    throw new Error(error)
  }
}

let RedisClient=await redisConnect()
export default RedisClient