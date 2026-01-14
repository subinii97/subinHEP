import { getAllStudyPosts } from '@/lib/markdown';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const posts = getAllStudyPosts();

        // Fetch view counts for all posts
        const { data: viewData, error: viewError } = await supabase
            .from('study_views')
            .select('slug, views');

        if (viewError) {
            console.error('Failed to fetch view counts:', viewError);
        }

        const viewsMap = (viewData || []).reduce((acc, curr) => {
            acc[curr.slug] = curr.views;
            return acc;
        }, {});

        const postsWithViews = posts.map(post => ({
            ...post,
            views: viewsMap[post.slug] || 0
        }));

        return new Response(JSON.stringify(postsWithViews), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
