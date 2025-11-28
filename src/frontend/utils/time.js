const DATE_UNITS = {
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
}

const getSecondsDiff = timestamp => (Date.now() - timestamp) / 1000
const getUnitAndValueDate = (secondsElapsed) => {
    for (const [unit, secondsInUnit] of Object.entries(DATE_UNITS)) {
        if (secondsElapsed >= secondsInUnit || unit === 'second') {
            const value = Math.floor(secondsElapsed / secondsInUnit) * -1
            return { value, unit }
        }
    }
}

export const getTimeAgo = timestamp => {
    const rtf = new Intl.RelativeTimeFormat()

    const date = new Date(timestamp)
    const secondsElapsed = getSecondsDiff(date)

    const { value, unit } = getUnitAndValueDate(secondsElapsed)
    return rtf.format(value, unit)
}

export const calculateTimeDifferences = (metricsJson) => {
    // Parse the JSON string if it's provided as a string
    const metrics = typeof metricsJson === 'string' ? JSON.parse(metricsJson) : metricsJson

    // Convert all dates to milliseconds
    const times = {}
    for (const key in metrics) {
        times[key] = new Date(metrics[key]).getTime()
    }

    // Calculate differences from startRequest
    const startTime = times.startRequest
    const differences = {
        startRequest: 0, // Always 0 as it's our reference point
        startQuerySQL: times.startQuerySQL - startTime,
        endQuerySQL: times.endQuerySQL - startTime,
        startResponse: times.startResponse - startTime,
        endResponse: times.endResponse - startTime,
        endRequest: times.endRequest - startTime
    }

    return differences
}
