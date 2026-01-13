"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function StudyPostPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/study/${params.slug}`)
            .then((res) => res.json())
            .then((data) => {
                setPost(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load post:", err);
                setIsLoading(false);
            });
    }, [params.slug]);

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-10 text-center text-[#FFF2E0]/30 font-bold animate-pulse">
                Loading Post...
            </div>
        );
    }

    if (!post) {
        return (
            <div className="max-w-4xl mx-auto p-10 text-center">
                <h1 className="text-2xl font-bold text-[#FFF2E0] mb-4">Post not found</h1>
                <Link href="/study" className="text-[#FFF2E0]/60 hover:text-white underline">
                    Back to Study Board
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-10">
            <Link
                href="/study"
                className="inline-flex items-center text-[#FFF2E0]/60 hover:text-white mb-8 transition-colors text-sm md:text-base"
            >
                ← Back to Study Board
            </Link>

            <article className="bg-white/10 backdrop-blur-md rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border border-white/20">
                <header className="mb-8 md:mb-12 border-b border-white/10 pb-8 md:pb-12 text-center">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        {post.title}
                    </h2>
                    <time className="text-sm md:text-lg text-white/50 font-medium">
                        {new Date(post.created_at).toLocaleDateString([], {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </time>
                </header>

                <div className="prose prose-invert prose-slate max-w-none 
          prose-headings:text-white prose-headings:font-bold
          prose-p:text-white/80 prose-p:leading-relaxed prose-p:text-lg
          prose-strong:text-white prose-strong:font-bold
          prose-ul:text-white/80 prose-li:text-white/80
          prose-code:text-[#4ADE80] prose-code:bg-[#4ADE80]/10 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:font-semibold prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl
          prose-blockquote:border-l-4 prose-blockquote:border-[#718eac] prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-white/70
          prose-img:rounded-3xl prose-img:border prose-img:border-white/10
          prose-a:text-[#718eac] prose-a:no-underline hover:prose-a:underline
        ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.content}
                    </ReactMarkdown>
                </div>
            </article>
        </div>
    );
}
