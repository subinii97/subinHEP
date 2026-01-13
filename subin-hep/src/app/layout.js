"use client";

import "./globals.css";
import Link from "next/link";
import { useState } from "react";

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 햄버거 메뉴 상태

  return (
    <html lang="ko">
      <body className="relative text-slate-800 antialiased">
        {/* 움직이는 그라데이션 배경 */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-r from-[#355C7D] via-[#6C5B7B] to-[#C06C84] animate-gradient"></div>

        <nav className="sticky top-0 z-50 px-[5%] py-4 md:py-6 bg-[#6b7887] shadow-lg transition-all">
          <div className="max-w-[1400px] mx-auto flex justify-between items-center">
            {/* 로고: 모바일에서는 조금 더 작게 (text-2xl -> text-3xl) */}
            <Link href="/" className="text-2xl md:text-3xl font-extrabold tracking-tighter text-[#FFF2E0] hover:scale-105 transition-transform duration-300">
              Study Lab.
            </Link>

            {/* 데스크탑 메뉴: md(768px) 이상에서만 보임 */}
            <ul className="hidden md:flex gap-10 text-xl font-medium text-[#FFF2E0]">
              {["Profile", "Study", "Fun"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="group relative py-1">
                    {item}
                    <span className="absolute left-0 bottom-[-4px] w-0 h-1 bg-[#FFF2E0] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* 햄버거 버튼: md 미만에서만 보임 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
            >
              <div className={`w-7 h-0.5 bg-[#FFF2E0] transition-all ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
              <div className={`w-7 h-0.5 bg-[#FFF2E0] transition-all ${isMenuOpen ? "opacity-0" : ""}`}></div>
              <div className={`w-7 h-0.5 bg-[#FFF2E0] transition-all ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
            </button>
          </div>

          {/* 모바일 드롭다운 메뉴 */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-64 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
            <ul className="flex flex-col gap-4 pb-4 text-center text-lg font-medium text-[#FFF2E0]">
              {["Profile", "Study", "Fun"].map((item) => (
                <li key={item} onClick={() => setIsMenuOpen(false)}>
                  <Link href={`/${item.toLowerCase()}`} className="block py-2 hover:bg-white/10 rounded-xl">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}