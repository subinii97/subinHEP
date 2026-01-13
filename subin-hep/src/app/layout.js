"use client";

import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="relative text-slate-800">
        {/* 요청하신 색상으로 움직이는 그라데이션 배경 */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-r from-[#355C7D] via-[#6C5B7B] to-[#C06C84] animate-gradient"></div>

        <nav className="sticky top-0 z-50 flex justify-between items-center px-[8%] py-6 bg-[#6b7887] shadow-lg">
          <Link href="/" className="text-3xl font-extrabold tracking-tighter text-[#FFF2E0] hover:scale-105 transition-transform duration-300">
            Study Lab.
          </Link>

          <div className="flex items-center gap-12">
            <ul className="flex gap-10 text-xl font-medium text-[#FFF2E0]">
              <li>
                <Link href="/profile" className="group relative py-1">
                  Profile
                  <span className="absolute left-0 bottom-[-4px] w-0 h-1 bg-[#FFF2E0] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/study" className="group relative py-1">
                  Study
                  <span className="absolute left-0 bottom-[-4px] w-0 h-1 bg-[#FFF2E0] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/fun" className="group relative py-1">
                  Fun
                  <span className="absolute left-0 bottom-[-4px] w-0 h-1 bg-[#FFF2E0] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
            {/* 로그인 버튼이 삭제되었습니다 */}
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}