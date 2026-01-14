"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";

// 아이콘 컴포넌트
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const CardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="3" y1="12" x2="21" y2="12"></line>
  </svg>
);

const ListIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

// 마크다운 문법을 제거하고 순수 텍스트만 추출하는 간단한 함수
function stripMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/^#+\s+/gm, "") // 헤더 제거
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // 굵게 제거
    .replace(/(\*|_)(.*?)\1/g, "$2") // 기울임 제거
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // 링크 텍스트만 유지
    .replace(/`{1,3}(.*?)`{1,3}/g, "$1") // 코드 블록 기호 제거
    .replace(/^\s*[-*+]\s+/gm, "") // 리스트 불렛 제거
    .replace(/^\s*>\s+/gm, "") // 인용구 기호 제거
    .trim();
}

// 1. Grid View Item (갤러리 스타일)
function GridItem({ post }) {
  const plainText = stripMarkdown(post.content);
  return (
    <Link
      href={`/study/${post.slug}`}
      className="group relative p-4 md:p-6 bg-white/10 backdrop-blur-sm rounded-[1.5rem] md:rounded-[2rem] border border-white/20 hover:bg-white/20 transition-all cursor-pointer h-40 md:h-64 flex flex-col justify-between"
    >
      <div className="overflow-hidden">
        <h3 className="text-sm md:text-xl font-bold text-white mb-1 truncate">{post.title}</h3>
        <span className="text-xs md:text-sm text-white/70 block mb-3 font-medium">
          {new Date(post.created_at).toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </span>
        <p className="text-white/80 line-clamp-2 md:line-clamp-3 text-xs md:text-base leading-relaxed">
          {plainText}
        </p>
      </div>
      <div className="flex justify-end mt-2">
        <span className="text-white/70 text-[10px] group-hover:text-white transition-colors">Read More →</span>
      </div>
    </Link>
  );
}

// 2. Card View Item (세로 나열형, 2줄 요약)
function CardItem({ post }) {
  const plainText = stripMarkdown(post.content);
  return (
    <Link
      href={`/study/${post.slug}`}
      className="group p-4 md:p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer flex flex-col gap-2"
    >
      <h1 className="text-lg md:text-2xl font-bold text-white group-hover:text-white transition-colors">{post.title}</h1>
      <p className="text-white/80 line-clamp-2 text-sm md:text-base leading-relaxed">
        {plainText}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-[11px] md:text-xs text-white/70">
          {new Date(post.created_at).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}
        </span>
        <span className="text-white/70 text-[10px] md:text-xs group-hover:text-white transition-colors">Read More →</span>
      </div>
    </Link>
  );
}

// 3. List View Item (심플 리스트)
function ListItem({ post }) {
  return (
    <Link
      href={`/study/${post.slug}`}
      className="group px-4 py-3 md:px-6 md:py-4 bg-white/5 hover:bg-white/10 border-b border-white/5 first:rounded-t-2xl last:rounded-b-2xl last:border-none transition-all cursor-pointer flex justify-between items-center gap-4"
    >
      <h3 className="text-sm md:text-base font-bold text-white truncate flex-1 group-hover:text-white transition-colors">{post.title}</h3>
      <div className="flex items-center gap-6">
        <span className="text-[10px] md:text-sm text-white/70 font-mono">
          {new Date(post.created_at).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
}

export default function StudyPage() {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'card' | 'list'
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 모바일인 경우 기본 뷰를 'card'로 설정 (md: 768px 미만)
    if (window.innerWidth < 768) {
      setViewMode("card");
    }
  }, []);

  useEffect(() => {
    // API Route를 통해 마크다운 파일 목록을 가져옴
    fetch('/api/study')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load study notes:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Study Board</h1>
          <p className="text-white/60 text-sm mt-1">마크다운 파일로 기록된 공부 내용을 확인하세요.</p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* 뷰 모드 스위처 */}
          <div className="flex bg-white/10 p-1 rounded-xl border border-white/10">
            {[
              { id: 'grid', icon: <GridIcon /> },
              { id: 'card', icon: <CardIcon /> },
              { id: 'list', icon: <ListIcon /> }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center justify-center ${viewMode === mode.id ? 'bg-[#718eac] text-white' : 'text-white/50 hover:text-white'} ${mode.id === 'grid' ? 'hidden md:flex' : 'flex'}`}
                title={mode.id.toUpperCase()}
              >
                {mode.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 게시글 영역 */}
      {isLoading ? (
        <div className="p-20 text-center text-white/30 font-bold animate-pulse">Loading Study Notes...</div>
      ) : posts.length > 0 ? (
        <>
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {posts.map(post => (
                <GridItem key={post.slug} post={post} />
              ))}
            </div>
          )}

          {viewMode === 'card' && (
            <div className="flex flex-col gap-4 md:gap-6 max-w-4xl mx-auto">
              {posts.map(post => (
                <CardItem key={post.slug} post={post} />
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden max-w-5xl mx-auto">
              {posts.map(post => (
                <ListItem key={post.slug} post={post} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="p-20 text-center text-[#FFF2E0]/30 font-bold">등록된 공부 기록이 없습니다. (src/content/study/*.md)</div>
      )}
    </div>
  );
}
