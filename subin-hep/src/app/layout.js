"use client";

import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // 로그인 상태 변화 감지 (로그인/로그아웃 시 자동 반영)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <html lang="ko">
      <body className="relative">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] opacity-60"></div>

        <nav className="sticky top-0 z-50 flex justify-between items-center px-[8%] py-6 bg-white/30 backdrop-blur-md border-b border-white/20">
          <Link href="/" className="text-3xl font-extrabold text-slate-900 tracking-tighter">
            Researcher's Lab
          </Link>

          <div className="flex items-center gap-12">
            <ul className="flex gap-10 text-xl font-semibold text-slate-700">
              <li><Link href="/profile">Profile</Link></li>
              <li><Link href="/study">Study</Link></li>
              <li><Link href="/fun">Fun</Link></li>
            </ul>

            {/* 로그인 상태에 따라 버튼 변경 */}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-slate-600 font-medium">{user.email.split('@')[0]}님</span>
                <button onClick={handleLogout} className="px-6 py-2.5 bg-red-500 text-white font-bold rounded-full text-lg">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="px-6 py-2.5 bg-slate-800 text-white font-bold rounded-full text-lg">
                Login
              </button>
            )}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}