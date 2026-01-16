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
  const isPaper = post.category === "Paper Reading";
  const categoryColor = isPaper ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-blue-500/20 text-blue-300 border-blue-500/30";

  return (
    <Link
      href={`/study/${post.slug}`}
      className="group relative p-4 md:p-6 bg-white/10 backdrop-blur-sm rounded-[1.5rem] md:rounded-[2rem] border border-white/20 hover:bg-white/20 transition-all cursor-pointer h-40 md:h-64 flex flex-col justify-between"
    >
      <div className="overflow-hidden">
        {post.category && (
          <div className="mb-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${categoryColor} shrink-0`}>
              {post.category}
            </span>
          </div>
        )}
        <h3 className="text-sm md:text-xl font-bold text-white mb-1 truncate">{post.title}</h3>
        <span className="text-sm text-white/70 block mb-3 font-medium">
          {new Date(post.created_at).toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </span>
        <p className="text-white/80 line-clamp-2 md:line-clamp-3 text-xs md:text-base leading-relaxed">
          {plainText}
        </p>
      </div>
    </Link>
  );
}

// 2. Card View Item (세로 나열형, 2줄 요약)
function CardItem({ post }) {
  const plainText = stripMarkdown(post.content);
  const isPaper = post.category === "Paper Reading";
  const categoryColor = isPaper ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-blue-500/20 text-blue-300 border-blue-500/30";

  return (
    <Link
      href={`/study/${post.slug}`}
      className="group p-4 md:p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer flex flex-col gap-3"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1 min-w-0 flex-1">
          <h1 className="text-lg md:text-2xl font-bold text-white group-hover:text-white transition-colors leading-tight">{post.title}</h1>
          <span className="text-[11px] md:text-sm text-white/70 block font-medium">
            {new Date(post.created_at).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}
          </span>
        </div>
        {post.category && (
          <span className={`text-xs px-3 py-1 rounded-full border ${categoryColor} whitespace-nowrap shrink-0 mt-1`}>
            {post.category}
          </span>
        )}
      </div>
      <p className="text-white/80 line-clamp-2 text-sm md:text-base leading-relaxed">
        {plainText}
      </p>
    </Link>
  );
}

// 3. List View Item (심플 리스트)
function ListItem({ post }) {
  const categoryColor = post.category === "Paper Reading" ? "text-emerald-400" : "text-blue-400";
  return (
    <Link
      href={`/study/${post.slug}`}
      className="group px-4 py-3 md:px-6 md:py-4 bg-white/5 hover:bg-white/10 border-b border-white/5 first:rounded-t-2xl last:rounded-b-2xl last:border-none transition-all cursor-pointer flex justify-between items-center gap-4"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <h3 className="text-sm md:text-base font-bold text-white truncate group-hover:text-white transition-colors">{post.title}</h3>
        {post.category && (
          <span className={`text-[10px] uppercase tracking-wider font-bold ${categoryColor} shrink-0`}>
            {post.category}
          </span>
        )}
      </div>
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
  const [isLargeScreen, setIsLargeScreen] = useState(false); // 1024px 이상 여부
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "PP Study", "Paper Reading"];

  useEffect(() => {
    // 초기 모바일/화면 크기 확인 및 리스너 등록
    const checkResponsive = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      setIsMobile(mobile);
      setIsLargeScreen(width >= 1024);

      // Grid인 경우에만 좁아질 때 Card로 전환, List는 고대 유지
      if (mobile) {
        if (desktopViewPreference === "grid") setViewMode("card");
        else setViewMode(desktopViewPreference);
      } else {
        setViewMode(desktopViewPreference);
      }
    };
    checkResponsive();
    window.addEventListener('resize', checkResponsive);
    return () => window.removeEventListener('resize', checkResponsive);
  }, [desktopViewPreference]);

  // 사용자가 데스크탑에서 수동으로 모드를 바꿨을 때 기억
  // 사용자가 수동으로 모드를 바꿨을 때 기억 (모바일에서도 변경 시 이를 선호도로 저장)
  const handleViewModeChange = (mode) => {
    setDesktopViewPreference(mode);
    setViewMode(mode);
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  // 모바일/카드: 5개
  // 그리드: Large(4열) -> 8개, Medium(3열) -> 6개
  // 리스트: 10개
  const itemsPerPage = isMobile ? 5 : (viewMode === "grid" ? (isLargeScreen ? 8 : 6) : viewMode === "card" ? 5 : 10);

  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  const filteredPosts = selectedCategory === "All"
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const Pagination = ({ className = "" }) => (
    filteredPosts.length > itemsPerPage ? (
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
    <div className="w-full">
      <section className="relative w-full h-[220px] md:h-[320px] overflow-hidden -mt-[72px] md:-mt-[92px]">
        <img
          src="/assets/header_study.jpeg"
          alt="Study Header"
          className="w-full h-full object-cover brightness-[0.85] [mask-image:linear-gradient(to_bottom,black_90%,transparent_100%)]"
        />
        {/* Softened Gradient Overlay for depth and text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent"></div>

        {/* Title Container - Constrained to match profile page width */}
        <div className="absolute inset-0 flex items-end pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter [text-shadow:0_4px_12px_rgba(0,0,0,1),0_0_30px_rgba(0,0,0,0.8)]">
              Study Board
            </h1>
          </div>
        </div>
      </section>

      {/* Hero Action Bar - Controls */}
      <div className="max-w-7xl mx-auto px-4 pt-8 -mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* 카테고리 탭 */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 h-[42px] rounded-2xl transition-all whitespace-nowrap border flex items-center justify-center text-sm md:text-base ${selectedCategory === category
                  ? 'bg-white/20 border-white/40 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                  : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 뷰 모드 스위처 */}
          <div className="flex bg-white/5 backdrop-blur-md h-[42px] items-center p-1 rounded-xl border border-white/10 shadow-xl self-end md:self-auto">
            {[
              { id: 'grid', icon: <GridIcon /> },
              { id: 'card', icon: <CardIcon /> },
              { id: 'list', icon: <ListIcon /> }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => handleViewModeChange(mode.id)}
                className={`px-3 h-[34px] rounded-lg transition-all flex items-center justify-center ${viewMode === mode.id ? 'bg-[#718eac] text-white' : 'text-white/50 hover:text-white'} ${mode.id === 'grid' ? 'hidden md:flex' : 'flex'}`}
                title={mode.id.toUpperCase()}
              >
                {mode.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* 게시글 영역 */}
        {
          isLoading ? (
            <div className="p-20 text-center text-white/30 font-bold animate-pulse">Loading Study Notes...</div>
          ) : filteredPosts.length > 0 ? (
            <>
              <Pagination className="mb-8" />
              {/* Grid View: Desktop only */}
              <div className={`${(viewMode === 'grid' && !isMobile) ? 'grid' : 'hidden'} md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6`}>
                {filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(post => (
                  <GridItem key={post.slug} post={post} />
                ))}
              </div>

              {/* Card View: Mobile (transitioned from grid OR selected) OR desktop card view */}
              <div className={`${viewMode === 'card' ? 'flex' : 'hidden'} flex-col gap-4 md:gap-6 max-w-4xl mx-auto`}>
                {filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(post => (
                  <CardItem key={post.slug} post={post} />
                ))}
              </div>

              {/* List View: Desktop OR Mobile (when explicitly selected) */}
              {viewMode === 'list' && (
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden max-w-5xl mx-auto w-full">
                  {filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(post => (
                    <ListItem key={post.slug} post={post} />
                  ))}
                </div>
              )}

              {/* Bottom Pagination */}
              <Pagination className="mt-12" />
            </>
          ) : (
            <div className="p-20 text-center text-[#FFF2E0]/30 font-bold">등록된 공부 기록이 없습니다. (src/content/study/*.md)</div>
          )
        }
      </div>
    </div >
  );
}
