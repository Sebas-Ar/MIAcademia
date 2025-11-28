import Script from 'next/script'

const AdSense = () => {
    return (
        <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1318326827271199"
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
    )
}

export default AdSense
