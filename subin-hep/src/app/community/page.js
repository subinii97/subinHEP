"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { hashPassword } from "@/lib/crypto";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";

// 아이콘 컴포넌트
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const CardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="3" y1="12" x2="21" y2="12"></line>
  </svg>
);

const linkify = (text) => {
  if (!text) return text;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white underline decoration-white/30 hover:decoration-white break-all transition-all font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

// 링크 프리뷰 컴포넌트
function LinkPreview({ url, compact = false }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
        const json = await res.json();
        if (!json.error) setData(json);
      } catch (err) {
        console.error("Link preview error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPreview();
  }, [url]);

  if (loading || !data) return null;

  if (compact) {
    return (
      <div className="flex flex-col gap-2 p-2 bg-white/5 rounded-2xl border border-white/10 shadow-lg w-full">
        {data.images?.[0] && (
          <div className="w-full aspect-square rounded-xl overflow-hidden shadow-inner flex-none">
            <img src={data.images[0]} className="w-full h-full object-cover" alt="" />
          </div>
        )}
        <div className="min-w-0 px-0.5 pb-0.5">
          <p className="text-white text-[10px] md:text-[11px] font-bold truncate">{data.title}</p>
          <p className="text-white/40 text-[9px] truncate">{new URL(url).hostname}</p>
        </div>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 flex flex-col bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all group shadow-xl max-w-sm"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 썸네일 (카톡 스타일 유지하되 크기 최적화) */}
      {data.images?.[0] && (
        <div className="w-full aspect-video overflow-hidden border-b border-white/10">
          <img
            src={data.images[0]}
            alt={data.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      )}
      <div className="p-4 space-y-1">
        <h4 className="text-white font-bold text-sm md:text-base leading-snug transition-colors line-clamp-2">
          {data.title}
        </h4>
        {data.description && (
          <p className="text-white/60 text-[10px] md:text-xs line-clamp-2 leading-relaxed">
            {data.description}
          </p>
        )}
      </div>
    </a>
  );
}


// 1. Grid View Item
function GridItem({ post, onSelect }) {
  return (
    <div
      onClick={() => onSelect(post)}
      className="group relative p-4 md:p-6 bg-white/10 backdrop-blur-sm rounded-[1.5rem] md:rounded-[2rem] border border-white/20 hover:bg-white/20 transition-all cursor-pointer h-40 md:h-64 flex flex-col justify-between"
    >
      <div className="overflow-hidden">
        <h3 className="text-sm md:text-xl font-bold text-white mb-1 truncate">{post.title}</h3>
        <span className="text-xs md:text-sm text-white/70 block mb-3 font-medium">
          {new Date(post.created_at).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </span>
        <p className="text-white/80 line-clamp-1 md:line-clamp-2 text-xs md:text-base leading-relaxed">
          {post.content?.replace(/(https?:\/\/[^\s]+)/g, '').trim()}
        </p>

        {/* 그리드 프리뷰 (목록에서도 눈에 띄게) */}
        {post.content?.match(/(https?:\/\/[^\s]+)/g)?.[0] && (
          <div className="mt-3">
            <LinkPreview url={post.content.match(/(https?:\/\/[^\s]+)/g)[0]} compact />
          </div>
        )}
      </div>
      <div className="flex justify-end mt-2">
        {/* Read More removed */}
      </div>
    </div>
  );
}

// 2. Card View Item (Previously PostCard)
function CardItem({ post, onSelect }) {
  return (
    <div
      onClick={() => onSelect(post)}
      className="group p-4 md:p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer flex flex-col gap-3"
    >
      <div className="space-y-1">
        <h3 className="text-lg md:text-2xl font-bold text-white group-hover:text-white transition-colors">{post.title}</h3>
        <span className="text-[11px] md:text-sm text-white/50 block font-medium">
          {new Date(post.created_at).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <p className="text-white/80 line-clamp-2 text-sm md:text-base leading-relaxed">
        {post.content?.replace(/(https?:\/\/[^\s]+)/g, '').trim()}
      </p>

      {/* 카드 프리뷰 */}
      {post.content?.match(/(https?:\/\/[^\s]+)/g)?.[0] && (
        <div className="max-w-md">
          <LinkPreview url={post.content.match(/(https?:\/\/[^\s]+)/g)[0]} />
        </div>
      )}
    </div>
  );
}

export default function AnonymousBoard() {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'card'
  const [posts, setPosts] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [desktopViewPreference, setDesktopViewPreference] = useState("grid"); // 데스크탑에서 수동 설정한 값 기억
  const [isMobile, setIsMobile] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false); // 1024px 이상 여부

  useEffect(() => {
    // 초기 모바일/화면 크기 확인 및 리스너 등록
    const checkResponsive = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      setIsMobile(mobile);
      setIsLargeScreen(width >= 1024);

      // 모바일이면 무조건 card, 데스크탑이면 기억해둔 선호도로 복구
      setViewMode(mobile ? "card" : desktopViewPreference);
    };
    checkResponsive();
    window.addEventListener('resize', checkResponsive);
    return () => window.removeEventListener('resize', checkResponsive);
  }, [desktopViewPreference]);

  // 사용자가 데스크탑에서 수동으로 모드를 바꿨을 때 기억
  const handleViewModeChange = (mode) => {
    if (!isMobile) {
      setDesktopViewPreference(mode);
    }
    setViewMode(mode);
  };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  // 모바일: 5개
  // 그리드: Large(4열) -> 8개, Medium(3열) -> 6개
  // 카드: 5개
  const itemsPerPage = isMobile ? 5 : (viewMode === "grid" ? (isLargeScreen ? 8 : 6) : 5);

  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  const [pwdModal, setPwdModal] = useState({ isOpen: false, post: null, action: null, input: "" });
  const [showPwdModalPassword, setShowPwdModalPassword] = useState(false);

  const totalPages = Math.ceil(posts.length / itemsPerPage);

  const Pagination = ({ className = "" }) => (
    posts.length > itemsPerPage ? (
      <div className={`flex justify-center items-center gap-4 ${className}`}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
        >
          ← Prev
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
          Next →
        </button>
      </div>
    ) : null
  );

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("anonymous_board")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data || []);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordRegex = /^[A-Za-z0-9]+$/;

    if (!editingId && !passwordRegex.test(password)) {
      alert("비밀번호는 영문자와 숫자만 사용하여 설정해 주세요.");
      return;
    }

    let finalPassword = password;
    if (!editingId) {
      finalPassword = await hashPassword(password);
    }

    if (editingId) {
      const { error } = await supabase
        .from("anonymous_board")
        .update({ title, content })
        .eq("id", editingId);
      if (error) alert(error.message);
      setEditingId(null);
    } else {
      const { error } = await supabase
        .from("anonymous_board")
        .insert([{ title, content, password: finalPassword }]);
      if (error) alert(error.message);
    }

    setTitle(""); setContent(""); setPassword("");
    setIsWriting(false);
    fetchPosts();
  };

  const handleActionWithPassword = (post, action) => {
    setPwdModal({ isOpen: true, post, action, input: "" });
    setShowPwdModalPassword(false);
  };

  const confirmPassword = async (inputPwd) => {
    const hashedInput = await hashPassword(inputPwd);
    if (inputPwd === pwdModal.post.password || hashedInput === pwdModal.post.password) {
      if (pwdModal.action === "edit") {
        setEditingId(pwdModal.post.id);
        setTitle(pwdModal.post.title);
        setContent(pwdModal.post.content);
        setIsWriting(true);
        setSelectedPost(null);
      } else if (pwdModal.action === "delete") {
        supabase.from("anonymous_board").delete().eq("id", pwdModal.post.id).then(() => {
          fetchPosts();
          setSelectedPost(null);
        });
      }
      setPwdModal({ isOpen: false, post: null, action: null });
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Community</h1>
          <p className="text-white/60 text-sm mt-1">자유롭게 의견을 나누는 공간입니다.</p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* 뷰 모드 스위처 - 모바일에서는 Card 하나뿐이라 숨김 */}
          <div className="hidden md:flex bg-white/10 p-1 rounded-xl border border-white/10">
            {[
              { id: 'grid', icon: <GridIcon /> },
              { id: 'card', icon: <CardIcon /> }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => handleViewModeChange(mode.id)}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center justify-center ${viewMode === mode.id ? 'bg-[#718eac] text-white' : 'text-white/50 hover:text-white'}`}
                title={mode.id.toUpperCase()}
              >
                {mode.icon}
              </button>
            ))}
          </div>

          <Button onClick={() => { setIsWriting(true); setEditingId(null); setTitle(""); setContent(""); }} className="px-6 py-2 text-sm md:text-base rounded-2xl shadow-lg h-[38px] flex items-center">
            글쓰기
          </Button>
        </div>
      </div>

      <Pagination className="mb-8" />

      {/* Desktop Grid View: Hidden on mobile OR when viewMode is 'card' */}
      <div className={`${(viewMode === 'grid' && !isMobile) ? 'grid' : 'hidden'} md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6`}>
        {posts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((post) => (
          <GridItem
            key={post.id}
            post={post}
            onSelect={setSelectedPost}
          />
        ))}
      </div>

      {/* Vertical Card View: Transitioned from grid OR selected card view */}
      <div className={`${viewMode === 'card' ? 'flex' : 'hidden'} flex-col gap-4 md:gap-6 max-w-4xl mx-auto`}>
        {posts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((post) => (
          <CardItem
            key={post.id}
            post={post}
            onSelect={setSelectedPost}
          />
        ))}
      </div>

      <Pagination className="mt-12" />

      <Modal
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        title={selectedPost?.title}
      >
        <p className="text-sm md:text-base text-[#FFF2E0]/60 font-medium mb-6">
          {selectedPost && new Date(selectedPost.created_at).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="text-base md:text-lg text-[#FFF2E0] leading-relaxed whitespace-pre-wrap">
          {selectedPost?.content?.replace(/(https?:\/\/[^\s]+)/g, '').trim()}
        </p>

        {/* 링크 프리뷰 추가 */}
        {selectedPost?.content?.match(/(https?:\/\/[^\s]+)/g)?.map((url, i) => (
          <LinkPreview key={i} url={url} />
        ))}
        <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-3">
          <Button variant="secondary" className="px-5 py-2 text-sm" onClick={() => handleActionWithPassword(selectedPost, "edit")}>수정</Button>
          <Button variant="danger" className="px-5 py-2 text-sm" onClick={() => handleActionWithPassword(selectedPost, "delete")}>삭제</Button>
        </div>
      </Modal>

      <Modal
        isOpen={isWriting}
        onClose={() => { setIsWriting(false); setEditingId(null); }}
        title={editingId ? "Edit Post" : "New Post"}
        maxWidth="max-w-xl"
        zIndex="z-[100]"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4">
          <Input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input placeholder="내용을 입력하세요" value={content} onChange={(e) => setContent(e.target.value)} isTextarea required />
          <div className="flex gap-2 md:gap-4">
            {!editingId && (
              <div className="relative flex-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            )}
            {editingId ? (
              <div className="flex gap-2 w-full">
                <Button
                  type="button"
                  variant="secondary"
                  className="px-6 py-3 text-sm md:text-base flex-1"
                  onClick={() => { setIsWriting(false); setEditingId(null); }}
                >
                  취소
                </Button>
                <Button type="submit" className="px-6 md:px-10 py-3 text-sm md:text-base flex-[2]">
                  수정완료
                </Button>
              </div>
            ) : (
              <Button type="submit" className="px-6 md:px-10 py-3 text-sm md:text-base flex-none">
                등록
              </Button>
            )}
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={pwdModal.isOpen}
        onClose={() => setPwdModal({ isOpen: false, post: null, action: null, input: "" })}
        title={pwdModal.action === "edit" ? "수정하시겠습니까?" : "삭제하시겠습니까?"}
        maxWidth="max-w-sm"
        zIndex="z-[150]"
      >
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Input
              type={showPwdModalPassword ? "text" : "password"}
              autoFocus
              value={pwdModal.input || ""}
              onChange={(e) => setPwdModal({ ...pwdModal, input: e.target.value })}
              placeholder="비밀번호를 입력하세요"
              autoComplete="new-password"
              onKeyDown={(e) => e.key === 'Enter' && confirmPassword(pwdModal.input)}
            />
            <button
              type="button"
              onClick={() => setShowPwdModalPassword(!showPwdModalPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
            >
              {showPwdModalPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1 py-2 text-sm" onClick={() => setPwdModal({ isOpen: false, post: null, action: null, input: "" })}>취소</Button>
            <Button className="flex-1 py-2 text-sm" onClick={() => confirmPassword(pwdModal.input)}>확인</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}