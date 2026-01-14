import { getStudyPostBySlug } from '@/lib/markdown';
import { supabase } from '@/lib/supabase';

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

        // Increment view count in Supabase
        await supabase.rpc('increment_study_view', { page_slug: params.slug });

        // Fetch current view count
        const { data: viewData } = await supabase
            .from('study_views')
            .select('views')
            .eq('slug', params.slug)
            .single();

        return new Response(JSON.stringify({
            ...post,
            views: viewData?.views || 0
        }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Failed to fetch post or increment views:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch post' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
