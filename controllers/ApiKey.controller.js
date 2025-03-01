import { validationResult } from "express-validator"
import ErrorHandler from "../utils/ErrorHandle.js"
import crypto from "crypto"
import prisma from "../DB/db.config.js"

class ApiKeyController {
    async Register(req, res, next) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return next(ErrorHandler(400, result.array().map((err)=>err.msg)))
        }
        const { appName } = req.body
        try {
            const app = await prisma.apiKey.findUnique({ where: { appName } })
            if (app) {
                return next(ErrorHandler(400, "App Name is already present, Please type another one"))
            }
            const apiKey = crypto.randomBytes(128).toString("hex")
            const newApp = await prisma.apiKey.create({ data: { appName, key: apiKey } })
            res.set('x-api-key',apiKey)
            return res.status(201).send({ message: "New Api-Key Created", NewApp: newApp })
        } catch (error) {
            next(error)
        }
    }
    async ApiKey(req, res, next) {
        console.log(req.headers)
        const { appName } = req.query
        if (!appName) {
            return next(ErrorHandler(400, "Please pass the Api-key of your app"))
        }
        try {
            const app = await prisma.apiKey.findUnique({ where: { appName } })
            if (!app) {
                return next(ErrorHandler(400, `App is not present with name - ${appName}`))
            }
            return res.status(200).send({ AppName: appName, ApiKey: app.key })
        } catch (error) {

        }
    }
    async Revoke(req, res, next) {
        const result = validationResult(req)
        if (!result.isEmpty()) {

            return next(ErrorHandler(400, result.array().map((err) => err.msg)))
        }
        const { appName } = req.body
        try {
            const app = await prisma.apiKey.findUnique({ where: { appName } })
            if (!app) {
                return next(ErrorHandler(400, `App not present with this name - ${appName}`))
            }
            const apiKeyRevoked = await prisma.apiKey.update({ where: { appName }, data: { revoked: true } })
            return res.status(201).send({ message: `Api-Key has been revoked for this app - ${apiKeyRevoked.appName}` })
        } catch (error) {
            next(error)
        }
    }

}

export default new ApiKeyController()