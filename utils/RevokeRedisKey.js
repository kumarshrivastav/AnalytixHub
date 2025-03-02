import RedisClient from "../config/redis.config.js"

export const RevokeApiKeyRoutesRedis=async()=>{
    try {
        const baseRedisKey="api:auth*"
        const redisKeys=await RedisClient.keys(baseRedisKey)
        if(redisKeys.length>0){
            await RedisClient.del(redisKeys)
        }
    } catch (error) {
        throw error
    }
}

export const RevokeEventRoutesRedis=async()=>{
    try {
        const baseRedisKey="api:analytics*"
        const redisKeys=await RedisClient.keys(baseRedisKey)
        if(redisKeys.length>0){
            await RedisClient.del(redisKeys)
        }
    } catch (error) {
        throw(error)
    }
}