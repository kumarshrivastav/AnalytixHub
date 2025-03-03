import express from "express"
import EventController from "../controllers/Event.controller.js"
import { EventValidation } from "../utils/ClientDataValidation.js"
import { userStatsRateLimit, eventSummaryRateLimit } from "../config/rateLimiting.js"
const router = express.Router()
/**
 * @swagger
 * /api/analytics/collect:
 *   post:
 *     summary: Collect an event
 *     description: Receives and stores an event from a website or mobile app
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: API key to authenticate the request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 example: "page_view"
 *               url:
 *                 type: string
 *                 example: "https://example.com/home"
 *               device:
 *                 type: string
 *                 example: "mobile"
 *               ipAddress:
 *                 type: string
 *                 example: "192.168.1.1"
 *               timestamp:
 *                 type: string
 *                 example: 2025-03-01T20:55:04.918Z
 *               referrer:
 *                 type: String
 *                 example: <https://google.com>
 *               metadata:
 *                 type: object
 *                 example:
 *                   browser: "Chrome"
 *                   os: "Windows"
 *                   screenSize: "1920x1080"
 *     responses:
 *       201:
 *         description: Event collected successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - Invalid or missing API key
 *       500:
 *         description: Internal server error
 */
router.post("/collect", EventValidation, EventController.Collect);

/**
 * @swagger
 * /api/analytics/event-summary:
 *   get:
 *     summary: Get event summary
 *     description: Fetches event data summary with optional filters
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: query
 *         name: event
 *         required: true
 *         schema:
 *           type: string
 *         description: Type of event (e.g., "button_click")
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering events
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering events
 *       - in: query
 *         name: app_id
 *         schema:
 *           type: string
 *         description: Filter events by specific app
 *     responses:
 *       200:
 *         description: Event summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   type: string
 *                   example: "button_click"
 *                 count:
 *                   type: integer
 *                   example: 500
 *                 uniqueUsers:
 *                   type: integer
 *                   example: 300
 *                 deviceData:
 *                   type: object
 *                   properties:
 *                     mobile:
 *                       type: integer
 *                       example: 200
 *                     desktop:
 *                       type: integer
 *                       example: 100
 *       400:
 *         description: Missing event parameter
 *       500:
 *         description: Internal server error
 */
router.get("/event-summary", eventSummaryRateLimit, EventController.EventSummary)

/**
 * @swagger
 * /api/analytics/user-stats:
 *   get:
 *     summary: Get user statistics
 *     description: Fetches analytics data for a specific user
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user ID
 *     responses:
 *       200:
 *         description: User stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "user123"
 *                 totalEvents:
 *                   type: integer
 *                   example: 50
 *                 deviceDetails:
 *                   type: object
 *                   example:
 *                     browser: "Safari"
 *                     os: "iOS"
 *                 ipAddress:
 *                   type: string
 *                   example: "192.168.1.1"
 *       400:
 *         description: Missing userId parameter
 *       404:
 *         description: No events found for user
 *       500:
 *         description: Internal server error
 */
router.get("/user-stats", userStatsRateLimit, EventController.UserStats)

export default router