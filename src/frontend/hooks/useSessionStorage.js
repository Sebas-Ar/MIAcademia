import { useEffect, useState } from 'react'

const useSessionStorage = (name = '') => {
    const [value, setValue] = useState(null)

    useEffect(() => {
        const valueStoraged = sessionStorage.getItem(name)
        if (valueStoraged) return setValue(valueStoraged)
        setValue('-')
    }, [name])

    return value
}

export default useSessionStorage
