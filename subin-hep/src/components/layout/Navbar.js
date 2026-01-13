"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const pathname = usePathname();
    const lastScrollY = useRef(0);
    const timeoutRef = useRef(null);

    const menuItems = ["Profile", "Study", "Fun", "Refresh", "Clock"];
    const isRefreshPage = pathname === "/refresh";

    // 2초 후 자동 숨김 타이머 재설정 함수
    const resetAutoHideTimer = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // 페이지 최상단(scrollY < 10)일 때는 타이머를 작동시키지 않음 (항상 표시)
        // 단, Refresh 페이지는 최상단에서도 사라지도록 예외 처리
        if (window.scrollY < 10 && !isRefreshPage) return;

        timeoutRef.current = setTimeout(() => {
            // 모바일 메뉴가 열려있을 때는 숨기지 않음
            if (!isMenuOpen) {
                setIsVisible(false);
            }
        }, 2000);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // 페이지 최상단에 있을 때 (Refresh 페이지 제외)
            if (currentScrollY < 10 && !isRefreshPage) {
                setIsVisible(true);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                lastScrollY.current = currentScrollY;
                return;
            }

            // 활동 감지 시 보이기
            setIsVisible(true);
            resetAutoHideTimer();

            // 스크롤 방향 감지 (상세 제어)
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                // 아래로 스크롤 중 && 어느 정도 내려왔을 때 숨김
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY.current) {
                // 위로 스크롤 중일 때 보임
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        // 휠/터치 활동 감지 (스크롤이 없는 짧은 페이지용)
        const handleInteraction = () => {
            setIsVisible(true);
            resetAutoHideTimer();
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("wheel", handleInteraction);
        window.addEventListener("touchmove", handleInteraction);
        window.addEventListener("mousemove", (e) => {
            // 화면 상단 100px 이내에서 움직이면 보이기
            if (e.clientY < 100) handleInteraction();
        });

        // 초기 타이머 설정: Refresh 페이지거나 이미 스크롤이 내려가 있는 경우에만 작동
        if (window.scrollY >= 10 || isRefreshPage) {
            resetAutoHideTimer();
        } else {
            setIsVisible(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("wheel", handleInteraction);
            window.removeEventListener("touchmove", handleInteraction);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isMenuOpen, isRefreshPage]); // isRefreshPage가 바뀔 때마다 리스너 갱신

    return (
        <>
            {/* Navbar Placeholder to prevent content jump since nav is fixed */}
            <div className="h-[72px] md:h-[92px]"></div>

            <nav className={`fixed top-0 left-0 right-0 z-50 px-[5%] py-4 md:py-6 transition-all duration-500 ease-in-out ${isRefreshPage
                ? "bg-white/10 backdrop-blur-sm shadow-none"
                : "bg-[#718eac] shadow-lg"
                } ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                }`}>
                <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                    <Link href="/" className="text-2xl md:text-3xl font-extrabold tracking-tighter text-white hover:scale-105 transition-transform duration-300">
                        Study Lab.
                    </Link>

                    {/* Desktop Menu */}
                    <ul className="hidden lg:flex gap-10 text-xl font-medium text-white">
                        {menuItems.map((item) => (
                            <li key={item}>
                                <Link href={`/${item.toLowerCase()}`} className="group relative py-1">
                                    {item}
                                    <span className={`absolute left-0 bottom-[-4px] w-0 h-1 transition-all duration-300 group-hover:w-full ${isRefreshPage ? "bg-white/40" : "bg-[#365470]"
                                        }`}></span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Hamburger Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden flex flex-col gap-1.5 p-2"
                        aria-label="Toggle Menu"
                    >
                        <div className={`w-7 h-0.5 bg-white transition-all ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
                        <div className={`w-7 h-0.5 bg-white transition-all ${isMenuOpen ? "opacity-0" : ""}`}></div>
                        <div className={`w-7 h-0.5 bg-white transition-all ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-64 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
                    <ul className="flex flex-col gap-4 pb-4 text-center text-lg font-medium text-white">
                        {menuItems.map((item) => (
                            <li key={item} onClick={() => setIsMenuOpen(false)}>
                                <Link href={`/${item.toLowerCase()}`} className="block py-2 hover:bg-white/10 rounded-xl">
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </>
    );
}
