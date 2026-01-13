import { getAllStudyPosts } from '@/lib/markdown';

export async function GET() {
    try {
        const posts = getAllStudyPosts();
        return new Response(JSON.stringify(posts), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
