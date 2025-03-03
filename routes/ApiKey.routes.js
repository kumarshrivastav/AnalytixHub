import express from "express";
import ApiKeyController from "../controllers/ApiKey.controller.js";
import { ApiKeyValidation } from "../utils/ClientDataValidation.js";
import { getApiKeyRateLimit } from "../config/rateLimiting.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: API Keys
 *   description: API key management for apps
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new app
 *     description: Registers a website or mobile app and generates an API key.
 *     tags: [API Keys]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appName:
 *                 type: string
 *                 example: "MyWebsite"
 *     responses:
 *       201:
 *         description: App registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appName:
 *                   type: string
 *                   example: "MyWebsite"
 *                 key:
 *                   type: string
 *                   example: "your_generated_api_key"
 *       400:
 *         description: Bad request - missing app name
 *       500:
 *         description: Internal server error
 */
router.post("/register", ApiKeyValidation, ApiKeyController.Register);

/**
 * @swagger
 * /api/auth/api-key:
 *   get:
 *     summary: Get API key for registered app
 *     tags: [API Keys]
 *     parameters:
 *       - in: query
 *         name: appName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the registered app to fetch the API key for
 *     responses:
 *       200:
 *         description: API key retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appName:
 *                   type: string
 *                   example: "MyWebsite"
 *                 apiKey:
 *                   type: string
 *                   example: "your_generated_api_key"
 *       404:
 *         description: API key not found
 *       500:
 *         description: Internal server error
 */
router.get("/api-key", getApiKeyRateLimit, ApiKeyController.ApiKey);

/**
 * @swagger
 * /api/auth/revoke:
 *   post:
 *     summary: Revoke an API key
 *     tags: [API Keys]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appName:
 *                 type: string
 *     responses:
 *       200:
 *         description: API key revoked successfully
 *       404:
 *         description: API key not found
 */
router.post("/revoke", ApiKeyValidation, ApiKeyController.Revoke);

export default router;
