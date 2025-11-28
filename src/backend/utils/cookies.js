export const getCookies = ({ context = {}, cookieName = '' }) => {
    const cookies = context.req.headers.cookie
    if (cookies) {
        const cookiesArray = cookies.split(';')
        const [userCookie] = cookiesArray.filter(cookie => cookie.includes(`${cookieName}=`))

        if (userCookie) return false
    }

    // chage to false to disable close beta mode
    return false
}
