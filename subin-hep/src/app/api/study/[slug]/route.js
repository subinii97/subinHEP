import { getStudyPostBySlug } from '@/lib/markdown';

export async function GET(request, { params: paramsPromise }) {
    const params = await paramsPromise;
    try {
        const post = getStudyPostBySlug(params.slug);
        if (!post) {
            return new Response(JSON.stringify({ error: 'Post not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify(post), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch post' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
