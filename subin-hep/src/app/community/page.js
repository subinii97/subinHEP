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
          {new Date(post.created_at).toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </span>
        <p className="text-white/80 line-clamp-2 md:line-clamp-3 text-xs md:text-base leading-relaxed">
          {post.content}
        </p>
      </div>
      <div className="flex justify-end mt-2">
        <span className="text-white/70 text-[10px] group-hover:text-white transition-colors">Read More →</span>
      </div>
    </div>
  );
}

// 2. Card View Item (Previously PostCard)
function CardItem({ post, onSelect }) {
  return (
    <div
      onClick={() => onSelect(post)}
      className="group p-4 md:p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer flex flex-col gap-2"
    >
      <h3 className="text-lg md:text-2xl font-bold text-white group-hover:text-white transition-colors">{post.title}</h3>
      <p className="text-white/80 line-clamp-2 text-sm md:text-base leading-relaxed">
        {post.content}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-[11px] md:text-xs text-white/70">
          {new Date(post.created_at).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}
        </span>
        <span className="text-white/70 text-[10px] md:text-xs group-hover:text-white transition-colors">Read More →</span>
      </div>
    </div>
  );
}

export default function AnonymousBoard() {
  const [posts, setPosts] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'card'
  const [isWriting, setIsWriting] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    // 모바일인 경우 기본 뷰를 'card'로 설정 (md: 768px 미만)
    if (window.innerWidth < 768) {
      setViewMode("card");
    }
  }, []);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [pwdModal, setPwdModal] = useState({ isOpen: false, post: null, action: null });

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
    setPwdModal({ isOpen: true, post, action });
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
                onClick={() => setViewMode(mode.id)}
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

      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {posts.map((post) => (
            <GridItem
              key={post.id}
              post={post}
              onSelect={setSelectedPost}
            />
          ))}
        </div>
      )}

      {viewMode === 'card' && (
        <div className="flex flex-col gap-4 md:gap-6 max-w-4xl mx-auto">
          {posts.map((post) => (
            <CardItem
              key={post.id}
              post={post}
              onSelect={setSelectedPost}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        title={selectedPost?.title}
      >
        <p className="text-sm md:text-base text-[#FFF2E0]/60 font-medium mb-6">
          {selectedPost && new Date(selectedPost.created_at).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="text-base md:text-lg text-[#FFF2E0] leading-relaxed whitespace-pre-wrap">{selectedPost?.content}</p>
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
            <Button type="submit" className="px-6 md:px-10 py-3 text-sm md:text-base flex-none">
              {editingId ? "수정완료" : "등록"}
            </Button>
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
          <Input
            type="password"
            autoFocus
            value={pwdModal.input || ""}
            onChange={(e) => setPwdModal({ ...pwdModal, input: e.target.value })}
            placeholder="비밀번호를 입력하세요"
            onKeyDown={(e) => e.key === 'Enter' && confirmPassword(pwdModal.input)}
          />
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1 py-2 text-sm" onClick={() => setPwdModal({ isOpen: false, post: null, action: null, input: "" })}>취소</Button>
            <Button className="flex-1 py-2 text-sm" onClick={() => confirmPassword(pwdModal.input)}>확인</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}