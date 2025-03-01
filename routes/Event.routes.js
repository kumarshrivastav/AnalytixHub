import express from "express"
import EventController from "../controllers/Event.controller.js"
import { EventValidation } from "../utils/ClientDataValidation.js"
const router=express.Router()
router.post("/collect",EventValidation,EventController.Collect)
router.get("/event-summary",EventController.EventSummary)
router.get("/user-stats",EventController.UserStats)

export default router