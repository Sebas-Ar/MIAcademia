
// getLocationsList get all locations of a program with a GET request
export const getLocationsListService = async ({ instituteName, dep, mun }) => {
    const params = new URLSearchParams({
        instituteName,
        dep,
        mun
    })

    const url = `/api/locations/programs?${params.toString()}`

    const headers = {
        'Content-Type': 'application/json'
    }

    const response = await fetch(url, {
        method: 'GET',
        headers
    })

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data
}
