import { getLinkPreview } from 'link-preview-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const decodedUrl = decodeURIComponent(url);

        const isYouTube = decodedUrl.includes('youtube.com') || decodedUrl.includes('youtu.be');

        // YouTube일 경우 OEmbed API 사용 (가장 확실한 방법)
        if (isYouTube) {
            try {
                const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(decodedUrl)}&format=json`);
                if (oembedRes.ok) {
                    const oembedData = await oembedRes.json();
                    return NextResponse.json({
                        title: oembedData.title,
                        description: oembedData.author_name,
                        images: [oembedData.thumbnail_url],
                        url: decodedUrl,
                        siteName: 'YouTube'
                    });
                }
            } catch (err) {
                console.error("YouTube OEmbed error:", err);
            }
        }

        const data = await getLinkPreview(decodedUrl, {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
            },
            timeout: 10000,
            followRedirects: true,
        });

        // 썸네일 보정 (유튜브 등에서 못 가져왔을 때)
        if (isYouTube && (!data.images || data.images.length === 0)) {
            const videoId = decodedUrl.includes('youtu.be')
                ? decodedUrl.split('/').pop().split('?')[0]
                : new URL(decodedUrl).searchParams.get('v');
            if (videoId) {
                data.images = [`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`];
            }
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Link preview error:', error);
        const hostname = new URL(url).hostname;
        return NextResponse.json({ title: hostname, url: url, images: [], description: 'Check Link' });
    }
}
