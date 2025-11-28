import { useEffect, useState } from 'react'

const useLocalStorage = (name = '') => {
    const [value, setValue] = useState(null)

    useEffect(() => {
        const valueStoraged = localStorage.getItem(name)
        if (valueStoraged) return setValue(valueStoraged)
        setValue('-')
    }, [name])

    return value
}

export default useLocalStorage
