import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useCurrentURL () {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [fullUrl, setFullUrl] = useState('')

    useEffect(() => {
        const query = searchParams.toString()
        const url = `${window.location.origin}${pathname}${query ? `?${query}` : ''}`
        setFullUrl(url)
    }, [pathname, searchParams])

    return fullUrl
}
