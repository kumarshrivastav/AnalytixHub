import { check } from "express-validator";

export const ApiKeyValidation=[
    check("appName","App Name is Required").isString()
]

export const EventValidation=[
    check("event","Event is Required").isString(),
    check("url","URL is Required").isString(),
    check("referrer","Referrer is Required"),
    check("device","Device is Required").isString(),
    check("ipAddress","IP Address is Required").isString(),
    check("timestamp","Time-Stamp is Required").isISO8601(),
    check("metadata","Meta-Data is Required").isObject()
]
