'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Script from 'next/script';

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // 내부(internal) 페이지는 추적에서 제외
        if (pathname.startsWith('/internal')) {
            return;
        }

        const url = pathname + searchParams.toString();

        if (window.gtag) {
            window.gtag('config', GA_MEASUREMENT_ID, {
                page_path: url,
            });
        }
    }, [pathname, searchParams, GA_MEASUREMENT_ID]);

    // 내부 페이지일 경우 스크립트 자체를 로드하지 않거나, 추적을 비활성화할 수 있습니다.
    // 여기서는 단순히 추적 이벤트 송신만 막는 방식이 아니라 스크립트 로드 시점부터 제어할 수도 있지만,
    // SPA 특성상 한 번 로드된 후 유지되므로 useEffect 내 로직이 핵심입니다.

    if (pathname.startsWith('/internal')) {
        return null;
    }

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
                }}
            />
        </>
    );
}
