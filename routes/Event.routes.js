import express from "express"
import EventController from "../controllers/Event.controller.js"
import { EventValidation } from "../utils/ClientDataValidation.js"
import {userStatsRateLimit,eventSummaryRateLimit} from "../config/rateLimiting.js"
const router=express.Router()
router.post("/collect",EventValidation,EventController.Collect)
router.get("/event-summary",eventSummaryRateLimit,EventController.EventSummary)
router.get("/user-stats",userStatsRateLimit,EventController.UserStats)

export default router