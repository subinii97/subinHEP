import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content/study');

export function getAllStudyPosts() {
    if (!fs.existsSync(contentDirectory)) {
        fs.mkdirSync(contentDirectory, { recursive: true });
        return [];
    }

    const fileNames = fs.readdirSync(contentDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(contentDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                ...data,
                content,
                // Ensure date is a string for serialization
                created_at: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
            };
        });

    // Sort posts by date
    return allPostsData.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export function getStudyPostBySlug(slug) {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug,
        ...data,
        content,
        created_at: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    };
}
