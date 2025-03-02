export default function GenerateRedisKey(req) {
    try {
        const baseUrl = req.originalUrl.split("?")[0]
        var updateBaseUrl = baseUrl.replace(/^\/+|\/+$/g, '').replace(/\//g, ':')
        const params = req.params
        if (Object.keys(params).length > 0) {
            const updatedParams = Object.keys(params).map((param) => `${param}=${params[param]}`).join(":")
            updateBaseUrl = updateBaseUrl + ":" + updatedParams
        }
        const query = req.query
        if (Object.keys(query).length > 0) {
            const updatedQuery = Object.keys(query).map((q) => `${q}=${query[q]}`).join(":")
            updateBaseUrl = updateBaseUrl + ":" + updatedQuery
        }
        return updateBaseUrl
    } catch (error) {
        throw error
    }
}