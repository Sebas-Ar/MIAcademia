function isStreamBrowserEnable (userAgent) {
    if (userAgent.match(/^((?!chrome|android).)*safari/i) ||
        userAgent.match(/^(.)*SamsungBrowser/i) ||
        userAgent.match(/^(.)*HuaweiBrowser/i) ||
        userAgent.match(/^(.)*xiaomi|MiuiBrowser/i)) {
        return true
    }

    return true
}

export default isStreamBrowserEnable
