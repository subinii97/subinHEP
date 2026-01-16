import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content/study');

function getFileUpdateTime(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.mtime.toISOString();
    } catch (error) {
        console.error(`Failed to get file update time for ${filePath}:`, error);
        return new Date().toISOString();
    }
}

function formatUpdateTime(isoString) {
    const date = new Date(isoString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

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
            const updatedAtIso = getFileUpdateTime(fullPath);

            return {
                slug,
                ...data,
                content,
                // Ensure date is a string for serialization
                created_at: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
                updated_at: formatUpdateTime(updatedAtIso),
                updated_at_iso: updatedAtIso, // mapping temporary property for sorting
            };
        });

    // Sort posts: primary by created_at (desc), secondary by updated_at_iso (desc)
    return allPostsData
        .sort((a, b) => {
            if (a.created_at !== b.created_at) {
                return a.created_at < b.created_at ? 1 : -1;
            }
            return a.updated_at_iso < b.updated_at_iso ? 1 : -1;
        })
        .map(({ updated_at_iso, ...post }) => post);
}

export function getStudyPostBySlug(slug) {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const updatedAtIso = getFileUpdateTime(fullPath);

    return {
        slug,
        ...data,
        content,
        created_at: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        updated_at: formatUpdateTime(updatedAtIso),
    };
}
