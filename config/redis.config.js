import {createClient} from "redis"

const ConnectRedis=async()=>{
    try {
        const redisClient=createClient({url:process.env.REDIS_URL})
        redisClient.on("error",(err)=>console.log(`Error Occured While Connecting to Redis:${err}`))
        redisClient.on("ready",()=>console.log(`Redis Connected Successfully`))
        await redisClient.connect()
        await redisClient.ping()
        return redisClient
    } catch (error) {
        throw error
    }
}

let RedisClient
(async ()=>{
    RedisClient=await ConnectRedis()
})()

export const closeRedis=async()=>{
    await RedisClient.quit()
}
export default RedisClient