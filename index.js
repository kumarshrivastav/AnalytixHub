import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import apiKeyRouter from "./routes/ApiKey.routes.js"
import eventRouter from "./routes/Event.routes.js"
import helmet from "helmet";
import { globalApiRateLimit } from "./config/rateLimiting.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"
import { setupSwagger } from "./config/swagger.js";
const app=express()
dotenv.config({})
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(helmet())
app.use(globalApiRateLimit)
setupSwagger(app)
app.use("/api/auth",apiKeyRouter)
app.use("/api/analytics",eventRouter)
const server=app.listen(8000,()=>{
    console.log(`Server started at http://localhost:${server.address().port}`)
})

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500
    const message=err.message || "Internal Server Error"
    res.status(statusCode).send({success:false,message})
})