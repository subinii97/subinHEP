"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { hashPassword } from "@/lib/crypto";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";

// 개별 게시글 컴포넌트
function PostCard({ post, onSelect, onEdit, onDelete }) {
  return (
    <div
      onClick={() => onSelect(post)}
      className="group relative p-4 md:p-6 bg-white/10 backdrop-blur-sm rounded-[1.5rem] md:rounded-[2rem] border border-white/20 hover:bg-white/20 transition-all cursor-pointer h-40 md:h-64 flex flex-col justify-between"
    >
      <div className="overflow-hidden">
        <h3 className="text-sm md:text-xl font-bold text-[#FFF2E0] mb-1 truncate">{post.title}</h3>
        <span className="text-xs md:text-sm text-[#FFF2E0]/60 block mb-3 font-medium">
          {new Date(post.created_at).toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </span>
        <p className="text-[#FFF2E0]/80 line-clamp-2 md:line-clamp-3 text-xs md:text-base leading-relaxed">
          {post.content}
        </p>
      </div>
      <div className="flex justify-end mt-2">
        <div className="flex gap-3">
          <Button variant="ghost" className="text-[12px] md:text-xs px-2 py-1 shadow-none" onClick={(e) => { e.stopPropagation(); onEdit(post); }}>수정</Button>
          <Button variant="ghost" className="text-red-400/80 hover:text-red-400 text-[12px] md:text-xs px-2 py-1 shadow-none" onClick={(e) => { e.stopPropagation(); onDelete(post); }}>삭제</Button>
        </div>
      </div>
    </div>
  );
}

export default function AnonymousBoard() {
  const [posts, setPosts] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-[#FFF2E0]">Community</h1>
        <Button onClick={() => { setIsWriting(true); setEditingId(null); setTitle(""); setContent(""); }} className="text-xs md:text-base">
          글쓰기
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onSelect={setSelectedPost}
            onEdit={(p) => handleActionWithPassword(p, "edit")}
            onDelete={(p) => handleActionWithPassword(p, "delete")}
          />
        ))}
      </div>

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
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm md:text-base">{showPassword ? "🙈" : "👁️"}</button>
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