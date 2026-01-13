"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AnonymousBoard() {
  const [posts, setPosts] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [editingId, setEditingId] = useState(null);

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
        .insert([{ title, content, password }]);
      if (error) alert(error.message);
    }

    setTitle(""); setContent(""); setPassword("");
    setIsWriting(false);
    fetchPosts();
  };

  const handleEditClick = (e, post) => {
    e.stopPropagation();
    const inputPwd = prompt("비밀번호를 입력하세요.");
    if (inputPwd === post.password) {
      setEditingId(post.id);
      setTitle(post.title);
      setContent(post.content);
      setIsWriting(true);
      setSelectedPost(null);
    } else { alert("비밀번호가 틀렸습니다."); }
  };

  const handleDelete = async (e, post) => {
    e.stopPropagation();
    const inputPwd = prompt("비밀번호를 입력하세요.");
    if (inputPwd === post.password) {
      await supabase.from("anonymous_board").delete().eq("id", post.id);
      fetchPosts();
      setSelectedPost(null);
    } else { alert("비밀번호가 틀렸습니다."); }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-[#FFF2E0]">Community</h1>
        <button
          onClick={() => setIsWriting(true)}
          className="px-4 py-2 md:px-8 md:py-3 bg-[#898AC4] text-[#FFF2E0] font-bold rounded-full hover:scale-105 transition-all shadow-lg text-xs md:text-base"
        >
          글쓰기
        </button>
      </div>

      {/* 게시글 목록 (그리드) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="group relative p-4 md:p-6 bg-white/10 backdrop-blur-sm rounded-[1.5rem] md:rounded-[2rem] border border-white/20 hover:bg-white/20 transition-all cursor-pointer h-40 md:h-64 flex flex-col justify-between"
          >
            <div className="overflow-hidden">
              {/* 1. 제목 */}
              <h3 className="text-sm md:text-xl font-bold text-[#FFF2E0] mb-1 truncate">{post.title}</h3>

              {/* 2. 시간 (제목 아래로 이동 및 폰트 크기 상향) */}
              <span className="text-xs md:text-sm text-[#FFF2E0]/60 block mb-3 font-medium">
                {new Date(post.created_at).toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
              </span>

              {/* 3. 내용 요약 */}
              <p className="text-[#FFF2E0]/80 line-clamp-2 md:line-clamp-3 text-xs md:text-base leading-relaxed">
                {post.content}
              </p>
            </div>

            <div className="flex justify-end mt-2">
              <div className="flex gap-3">
                <button onClick={(e) => handleEditClick(e, post)} className="text-[#FFF2E0]/60 hover:text-white text-[12px] md:text-xs">수정</button>
                <button onClick={(e) => handleDelete(e, post)} className="text-red-400/80 hover:text-red-400 text-[12px] md:text-xs">삭제</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 상세보기 모달 */}
      {selectedPost && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={() => setSelectedPost(null)}>
          <div className="bg-[#6b7887] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-white/10" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl md:text-2xl font-bold text-[#FFF2E0]">{selectedPost.title}</h2>
                {/* 모달 내 시간 폰트도 키움 */}
                <p className="text-sm md:text-base text-[#FFF2E0]/60 font-medium">
                  {new Date(selectedPost.created_at).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button onClick={() => setSelectedPost(null)} className="text-[#FFF2E0]/60 text-xl px-2">✕</button>
            </div>
            <p className="text-base md:text-lg text-[#FFF2E0] leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-3">
              <button onClick={(e) => handleEditClick(e, selectedPost)} className="px-5 py-2 bg-white/10 text-[#FFF2E0] rounded-xl text-sm">수정</button>
              <button onClick={(e) => handleDelete(e, selectedPost)} className="px-5 py-2 bg-red-400/20 text-red-300 rounded-xl text-sm">삭제</button>
            </div>
          </div>
        </div>
      )}

      {/* 글쓰기 모달 (기존 동일) */}
      {isWriting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
          <div className="bg-[#6b7887] p-6 md:p-8 rounded-[2rem] shadow-2xl w-full max-w-xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-[#FFF2E0]">{editingId ? "Edit Post" : "New Post"}</h2>
              <button onClick={() => { setIsWriting(false); setEditingId(null); }} className="text-[#FFF2E0]/60 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4">
              <input
                type="text" placeholder="제목" value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/10 border border-white/10 outline-none text-[#FFF2E0] placeholder:text-[#FFF2E0]/40 text-sm md:text-base" required
              />
              <textarea
                placeholder="내용을 입력하세요" value={content}
                onChange={(e) => setContent(e.target.value)}
                className="p-3 md:p-4 h-48 md:h-64 rounded-xl md:rounded-2xl bg-white/10 border border-white/10 outline-none text-[#FFF2E0] placeholder:text-[#FFF2E0]/40 resize-none text-sm md:text-base" required
              />
              <div className="flex gap-2 md:gap-4">
                {!editingId && (
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/10 border border-white/10 outline-none text-[#FFF2E0] pr-10 text-sm md:text-base" required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm md:text-base">{showPassword ? "🙈" : "👁️"}</button>
                  </div>
                )}
                <button className="px-6 md:px-10 py-3 bg-[#898AC4] text-[#FFF2E0] font-bold rounded-xl hover:bg-[#7677A0] transition text-sm md:text-base">등록</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}