import {rateLimit} from "express-rate-limit"

export const globalApiRateLimit=rateLimit({
    windowMs:1000*60*60,
    limit:50,
    legacyHeaders:false,
    standardHeaders:'draft-8',
    message:"Too Many request, Please try after 1 hour"
})

export const getApiKeyRateLimit=rateLimit({
    windowMs:1000*60*15,
    limit:10,
    legacyHeaders:false,
    standardHeaders:'draft-8',
    message:"Too many request, Please try after 15 minutes"
})

export const eventSummaryRateLimit=rateLimit({
    windowMs:1000*60*10,
    limit:5,
    legacyHeaders:false,
    standardHeaders:'draft-8',
    message:"Too many request, Please try after 10 minutes"
})

export const userStatsRateLimit=rateLimit({
    windowMs:1000*60*5,
    limit:10,
    standardHeaders:'draft-8',
    legacyHeaders:false,
    message:"Too many request, Please try after 5 minutes"
})