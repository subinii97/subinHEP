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
        <span className="text-sm text-white/70 block mb-3 font-medium">
          {new Date(post.created_at).toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </span>
        <p className="text-white/80 line-clamp-2 md:line-clamp-3 text-xs md:text-base leading-relaxed">
          {plainText}
        </p>
      </div>
      <div className="flex justify-end mt-2">
        {/* Read More removed */}
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
      className="group p-4 md:p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer flex flex-col gap-3"
    >
      <div className="space-y-1">
        <h1 className="text-lg md:text-2xl font-bold text-white group-hover:text-white transition-colors">{post.title}</h1>
        <span className="text-[11px] md:text-sm text-white/70 block font-medium">
          {new Date(post.created_at).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}
        </span>
      </div>
      <p className="text-white/80 line-clamp-2 text-sm md:text-base leading-relaxed">
        {plainText}
      </p>
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
  const [desktopViewPreference, setDesktopViewPreference] = useState("grid"); // 기억해둔 선호도
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 초기 모바일 여부 확인 및 리스너 등록
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Grid인 경우에만 좁아질 때 Card로 전환, List는 고대 유지
      if (mobile) {
        if (desktopViewPreference === "grid") setViewMode("card");
        else setViewMode(desktopViewPreference);
      } else {
        setViewMode(desktopViewPreference);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [desktopViewPreference]);

  // 사용자가 데스크탑에서 수동으로 모드를 바꿨을 때 기억
  // 사용자가 수동으로 모드를 바꿨을 때 기억 (모바일에서도 변경 시 이를 선호도로 저장)
  const handleViewModeChange = (mode) => {
    setDesktopViewPreference(mode);
    setViewMode(mode);
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 5 : (viewMode === "grid" ? 8 : viewMode === "card" ? 5 : 10);

  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  const totalPages = Math.ceil(posts.length / itemsPerPage);

  const Pagination = ({ className = "" }) => (
    posts.length > itemsPerPage ? (
      <div className={`flex justify-center items-center gap-4 ${className}`}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${currentPage === i + 1 ? 'bg-[#718eac] border-[#718eac] text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    ) : null
  );

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
                onClick={() => handleViewModeChange(mode.id)}
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
          <Pagination className="mb-8" />
          {/* Grid View: Desktop only */}
          <div className={`${(viewMode === 'grid' && !isMobile) ? 'grid' : 'hidden'} md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6`}>
            {posts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(post => (
              <GridItem key={post.slug} post={post} />
            ))}
          </div>

          {/* Card View: Mobile (transitioned from grid OR selected) OR desktop card view */}
          <div className={`${viewMode === 'card' ? 'flex' : 'hidden'} flex-col gap-4 md:gap-6 max-w-4xl mx-auto`}>
            {posts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(post => (
              <CardItem key={post.slug} post={post} />
            ))}
          </div>

          {/* List View: Desktop OR Mobile (when explicitly selected) */}
          {viewMode === 'list' && (
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden max-w-5xl mx-auto w-full">
              {posts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(post => (
                <ListItem key={post.slug} post={post} />
              ))}
            </div>
          )}

          {/* Bottom Pagination */}
          <Pagination className="mt-12" />
        </>
      ) : (
        <div className="p-20 text-center text-[#FFF2E0]/30 font-bold">등록된 공부 기록이 없습니다. (src/content/study/*.md)</div>
      )}
    </div>
  );
}
