import { validationResult } from "express-validator"
import ErrorHandler from "../utils/ErrorHandle.js"
import prisma from "../DB/db.config.js"

class EventController {
    async Collect(req, res, next) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return next(ErrorHandler(400, result.array().map((err) => err.msg)))
        }
        const apiKey = req.headers['x-api-key']
        if (!apiKey) {
            return next(ErrorHandler(400, "Please Provide api-key"))
        }
        const { event, url, referrer, device, ipAddress, timestamp, metadata } = req.body
        try {
            const isValidApiKey = await prisma.apiKey.findUnique({ where: { key: apiKey, revoked: false } })
            if (!isValidApiKey) {
                return next(ErrorHandler(401, 'Invalid or Revoked Api-Key'))
            }
            const newEvent = await prisma.event.create({ data: { event, url, referrer, device, ipAddress, timestamp: new Date(timestamp), metadata, apiKeyId: isValidApiKey.id } })
            return res.status(200).send({ message: "New Event have been Created", Event: newEvent })
        } catch (error) {
            next(error)
        }
    }
    async EventSummary(req, res, next) {
        const { event, startDate, endDate, api_id } = req.query
        if (!event) {
            return next(ErrorHandler(400, "Event Type is Required"))
        }
        try {
            const where = {
                event,
                timestamp: {
                    gte: startDate ? new Date(startDate) : undefined,
                    lte: endDate ? new Date(endDate) : undefined
                },
                apiKeyId: api_id ? api_id : undefined
            }
            const totalEvents = await prisma.event.count({where})
            const uniqueUsers = await prisma.event.groupBy({
                by: ['ipAddress'],
                where, _count: true
            })
            const deviceData = await prisma.event.groupBy({
                by: ['device'], where, _count: { device: true }
            })
            const formattedDeviceData = deviceData.reduce((acc, d) => {
                return acc[d.device] = d.device._count
            }, {})
            return res.status(200).send({ event, count: totalEvents, uniqueUsers: uniqueUsers.length, deviceData: formattedDeviceData })

        } catch (error) {
            next(error)
        }
    }
    async UserStats(req, res, next) {
        const {userId}=req.query
        if(!userId){
            return next(ErrorHandler(400,"UserId is Requried"))
        }
        try {
            const events=await prisma.event.findMany({where:{apiKeyId:userId},orderBy:{timestamp:"desc"}})
            if(events.length===0){
                return next(ErrorHandler(400,"No Events Found for user"))
            }
            const totalEvents=events.length
            const deviceDetails=events[0].metadata
            return res.status(200).send({userId,totalEvents,deviceDetails,ipAddress:events[0].ipAddress})
        } catch (error) {

        }
    }
}

export default new EventController()