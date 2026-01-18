"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";

export default function StudyPostPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [headings, setHeadings] = useState([]);

    useEffect(() => {
        fetch(`/api/study/${params.slug}`)
            .then((res) => res.json())
            .then((data) => {
                setPost(data);
                if (data.content) {
                    const extracted = extractHeadings(data.content);
                    setHeadings(extracted);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load post:", err);
                setIsLoading(false);
            });
    }, [params.slug]);

    const extractHeadings = (content) => {
        const slugger = new GithubSlugger();
        const headingLines = content.split("\n").filter((line) => line.trim().startsWith("#"));
        return headingLines
            .map((line) => {
                const levelMatch = line.match(/^#+/);
                const level = levelMatch ? levelMatch[0].length : 0;
                const text = line.replace(/^#+\s*/, "").trim();
                const id = slugger.slug(text);
                return { level, text, id };
            })
            .filter((h) => h.level > 0 && h.level <= 3);
    };

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
        <div className="max-w-7xl mx-auto p-4 md:p-10">
            <Link
                href="/study"
                className="inline-flex items-center text-[#FFF2E0]/60 hover:text-white mb-8 transition-colors text-sm md:text-base"
            >
                ← Back to Study Board
            </Link>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <article className="bg-white/10 backdrop-blur-md rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border border-white/20">
                        <header className="mb-8 md:mb-12 border-b border-white/10 pb-8 md:pb-12 text-center">
                            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-6 tracking-tight">
                                {post.title}
                            </h2>
                            <div className="flex flex-col items-center gap-2">
                                <time className="text-sm md:text-lg text-white font-medium">
                                    {new Date(post.created_at).toLocaleDateString([], {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </time>
                                <div className="flex items-center gap-4 text-xs md:text-sm text-white/80">
                                    <span>Updated on: {post.updated_at}</span>
                                    <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                                    <span>Views: {post.views}</span>
                                </div>
                            </div>
                        </header>

                        <div className="prose prose-invert prose-slate max-w-none text-base md:text-lg
          prose-headings:text-white prose-headings:font-bold prose-headings:scroll-mt-28
          prose-h1:text-2xl md:prose-h1:text-3xl
          prose-h2:text-xl md:prose-h2:text-2xl
          prose-p:text-white prose-p:leading-relaxed
          prose-strong:text-white prose-strong:font-bold
          prose-ul:text-white prose-li:text-white
          prose-ol:text-white
          marker:text-white
          prose-li:my-2
          prose-hr:my-8
          prose-th:text-white prose-td:text-white
          prose-th:px-3 prose-td:px-3
          prose-th:py-1 prose-td:py-1
          [&_th]:!text-center
          [&_td:first-child]:!text-center
          prose-th:align-middle prose-td:align-middle
          prose-table:border-collapse
          prose-thead:border-white/50
          [&_tr]:border-b [&_tr]:border-white/50
          [&_th]:border-r [&_th]:border-white/50
          [&_td]:border-r [&_td]:border-white/50
          [&_tr:last-child]:border-b-0
          [&_th:last-child]:border-r-0
          [&_td:last-child]:border-r-0
          prose-code:text-[#4ADE80] prose-code:bg-[#4ADE80]/10 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:font-semibold prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl
          prose-blockquote:border-l-4 prose-blockquote:border-[#718eac] prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-white
          prose-img:rounded-3xl prose-img:border prose-img:border-white/10
          prose-a:text-[#718eac] prose-a:no-underline hover:prose-a:underline
        ">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeSlug, rehypeKatex]}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </div>
                    </article>

                    <div className="mt-8 flex justify-center">
                        <Link
                            href="/study"
                            className="inline-flex items-center text-[#FFF2E0]/60 hover:text-white transition-colors text-sm md:text-base"
                        >
                            ← Back to Study Board
                        </Link>
                    </div>
                </div>

                {/* Sticky TOC */}
                {headings.length > 0 && (
                    <aside className="hidden lg:block w-72 shrink-0">
                        <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto p-3 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl">
                            <h3 className="text-white text-base font-bold mb-4 px-4 flex items-center gap-3">
                                <span className="w-1.5 h-4 bg-white/80 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></span>
                                Table of Contents
                            </h3>
                            <ul className="flex flex-col gap-1">
                                {headings.map((heading, index) => (
                                    <li
                                        key={index}
                                        style={{ marginLeft: `${(heading.level - 1) * 0.5}rem` }}
                                    >
                                        <a
                                            href={`#${heading.id}`}
                                            className={`group relative flex items-center py-1.5 px-3 rounded-xl border border-transparent hover:border-white/20 hover:bg-white/10 transition-all duration-300 ease-out overflow-hidden ${heading.level === 1 ? 'bg-black/30' :
                                                heading.level === 2 ? 'bg-black/15' : 'bg-transparent'
                                                }`}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <span className="text-white/60 group-hover:text-white text-[13px] font-medium relative z-10 break-words leading-tight">
                                                {heading.text}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>
                )}
            </div>
        </div>
    );
}
