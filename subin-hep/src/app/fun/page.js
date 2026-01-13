"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AnonymousBoard() {
  const [posts, setPosts] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20; // 5행 * 4열 기준

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // 1. 비밀번호 보이기 상태 추가

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("anonymous_board")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data || []);
  };

  useEffect(() => { fetchPosts(); }, []);

  // 페이지네이션 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. 비밀번호 유효성 검사 (영어+숫자 정규표현식)
    // ^[A-Za-z0-9]+$ : 시작부터 끝까지 영문 대소문자와 숫자로만 구성됨을 의미
    const passwordRegex = /^[A-Za-z0-9]+$/;

    if (!editingId && !passwordRegex.test(password)) {
      alert("비밀번호는 영문자와 숫자만 사용하여 설정해 주세요.");
      return;
    }

    if (editingId) {
      // 수정 로직
      const { error } = await supabase
        .from("anonymous_board")
        .update({ title, content })
        .eq("id", editingId);
      if (error) alert(error.message);
      setEditingId(null);
    } else {
      // 새 글 등록
      const { error } = await supabase
        .from("anonymous_board")
        .insert([{ title, content, password }]);
      if (error) alert(error.message);
    }

    setTitle(""); setContent(""); setPassword("");
    setIsWriting(false);
    fetchPosts();
  };

  const handleEditClick = (post) => {
    const inputPwd = prompt("비밀번호를 입력하세요.");
    if (inputPwd === post.password) {
      setEditingId(post.id);
      setTitle(post.title);
      setContent(post.content);
      setIsWriting(true);
    } else { alert("비밀번호가 틀렸습니다."); }
  };

  const handleDelete = async (post) => {
    const inputPwd = prompt("비밀번호를 입력하세요.");
    if (inputPwd === post.password) {
      await supabase.from("anonymous_board").delete().eq("id", post.id);
      fetchPosts();
    } else { alert("비밀번호가 틀렸습니다."); }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-10">
      {/* 상단 헤더 */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-[#FFF2E0] tracking-tighter">Community</h1>
        <button
          onClick={() => setIsWriting(true)}
          className="px-8 py-3 bg-[#898AC4] text-[#FFF2E0] font-bold rounded-full hover:scale-105 transition-all shadow-lg"
        >
          글쓰기
        </button>
      </div>

      {/* 게시글 그리드 레이아웃: 모바일 2열, 태블릿 3열, PC 4열 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentPosts.map((post) => (
          <div key={post.id} className="group aspect-square p-6 bg-white/10 backdrop-blur-sm rounded-[2rem] border border-white/20 flex flex-col justify-between hover:bg-white/20 transition-all duration-300 relative overflow-hidden">
            <div>
              <h3 className="text-xl font-bold text-[#FFF2E0] mb-3 line-clamp-2">{post.title}</h3>
              <p className="text-[#FFF2E0]/80 text-sm line-clamp-4 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>

            <div className="mt-4">
              <span className="text-[10px] text-[#FFF2E0]/40 block mb-2">{new Date(post.created_at).toLocaleDateString()}</span>
              <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEditClick(post)} className="text-xs text-[#FFF2E0]/60 hover:text-white">수정</button>
                <button onClick={() => handleDelete(post)} className="text-xs text-red-300/60 hover:text-red-400">삭제</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 버튼 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-16 gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-6 py-2 rounded-full bg-white/10 text-[#FFF2E0] disabled:opacity-30"
          >
            Prev
          </button>
          <span className="flex items-center text-[#FFF2E0] font-bold">{currentPage} / {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-6 py-2 rounded-full bg-white/10 text-[#FFF2E0] disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}

      {/* 글쓰기 모달 (팝업) */}
      {isWriting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#6b7887] p-8 rounded-[2.5rem] shadow-2xl w-full max-w-xl border border-white/10 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#FFF2E0]">{editingId ? "Edit Post" : "New Post"}</h2>
              {/* 닫기 버튼 추가 */}
              <button onClick={() => { setIsWriting(false); setEditingId(null); setShowPassword(false); }} className="text-[#FFF2E0]/60 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text" placeholder="제목" value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-4 rounded-2xl bg-white/10 border border-white/10 outline-none text-[#FFF2E0] placeholder:text-[#FFF2E0]/40" required
              />
              <textarea
                placeholder="어떤 이야기를 들려주실 건가요?" value={content}
                onChange={(e) => setContent(e.target.value)}
                className="p-4 h-64 rounded-2xl bg-white/10 border border-white/10 outline-none text-[#FFF2E0] placeholder:text-[#FFF2E0]/40 resize-none" required
              />

              <div className="flex gap-4">
                {!editingId && (
                  <div className="relative flex-1 group">
                    <input
                      type={showPassword ? "text" : "password"} // 2. 상태에 따라 타입 변경
                      placeholder="비밀번호 (영문/숫자)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      pattern="[A-Za-z0-9]+"
                      title="영문자와 숫자만 입력 가능합니다."
                      className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none text-[#FFF2E0] placeholder:text-[#FFF2E0]/40 pr-12"
                      required
                    />
                    {/* 3. 눈 아이콘 버튼 추가 */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                )}
                <button className="px-10 py-3 bg-[#898AC4] text-[#FFF2E0] font-bold rounded-xl hover:bg-[#7677A0] transition shadow-lg shrink-0">
                  {editingId ? "수정 완료" : "등록하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}