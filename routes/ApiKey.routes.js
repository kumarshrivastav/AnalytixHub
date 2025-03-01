import express from "express"
import ApiKeyController from "../controllers/ApiKey.controller.js"
import { ApiKeyValidation, EventValidation } from "../utils/ClientDataValidation.js"
const router =express.Router()
router.post("/register",ApiKeyValidation,ApiKeyController.Register)
router.get("/api-key",ApiKeyController.ApiKey)
router.post("/revoke",ApiKeyValidation,ApiKeyController.Revoke)
export default router