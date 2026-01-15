"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useScrollVisibility } from "@/hooks/useScrollVisibility";
import { MENU_ITEMS } from "@/data/navigation";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const isRefreshPage = pathname === "/refresh";

    const isVisible = useScrollVisibility(isRefreshPage, isMenuOpen);

    return (
        <>
            {/* Navbar Placeholder to prevent content jump since nav is fixed */}
            <div className="h-[72px] md:h-[92px]"></div>

            <nav className={`fixed top-0 left-0 right-0 z-50 px-[5%] py-4 md:py-6 transition-all duration-500 ease-in-out border-b border-white/10 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                }`}>
                {/* Independent background layer for the bar to avoid filter conflicts with children */}
                <div className={`absolute inset-0 z-[-1] backdrop-blur-md transition-colors duration-500 ${isRefreshPage ? "bg-white/10" : "bg-black/20"}`}></div>

                <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                    <Link href="/" className="text-2xl md:text-3xl font-extrabold tracking-tighter text-white hover:scale-105 transition-transform duration-300">
                        Study Lab.
                    </Link>

                    {/* Desktop Menu - Smart Responsive */}
                    <div className="hidden lg:flex items-center gap-6 xl:gap-8 relative">
                        <ul className="flex items-center gap-4 xl:gap-8 text-lg xl:text-xl font-medium text-white">
                            <li className="hidden lg:block">
                                <Link href="/profile" className="group relative py-1">
                                    Profile
                                    <span className="absolute left-0 bottom-[-4px] w-0 h-1 bg-white/40 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>
                            <li className="hidden min-[1100px]:block">
                                <Link href="/study" className="group relative py-1">
                                    Study
                                    <span className="absolute left-0 bottom-[-4px] w-0 h-1 bg-white/40 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>
                            <li className="hidden min-[1200px]:block">
                                <Link href="/community" className="group relative py-1">
                                    Community
                                    <span className="absolute left-0 bottom-[-4px] w-0 h-1 bg-white/40 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>
                            <li className="hidden min-[1350px]:block">
                                <Link href="/clock" className="group relative py-1">
                                    Clock
                                    <span className="absolute left-0 bottom-[-4px] w-0 h-1 bg-white/40 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>
                            <li className="hidden min-[1500px]:block">
                                <Link href="/refresh" className="group relative py-1">
                                    Refresh
                                    <span className="absolute left-0 bottom-[-4px] w-0 h-1 bg-white/40 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>
                        </ul>

                        {/* Hamburger Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex flex-col gap-1.5 p-2 hover:opacity-80 transition-opacity"
                            aria-label="Toggle Menu"
                        >
                            <div className={`w-8 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
                            <div className={`w-8 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}></div>
                            <div className={`w-8 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
                        </button>

                        {/* Desktop Dropdown (Right-aligned Popup) */}
                        <div className={`absolute top-full right-0 mt-4 w-64 backdrop-blur-md rounded-[2rem] border border-white/20 overflow-hidden transition-all duration-500 ease-in-out shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${isMenuOpen ? "max-h-96 opacity-90 translate-y-0" : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"}`}>
                            <ul className="flex flex-col p-4 text-center text-lg font-medium text-white">
                                <li className="block min-[1500px]:hidden" onClick={() => setIsMenuOpen(false)}>
                                    <Link href="/refresh" className="block py-3 hover:bg-white/10 rounded-2xl transition-all">Refresh</Link>
                                </li>
                                <li className="block min-[1350px]:hidden" onClick={() => setIsMenuOpen(false)}>
                                    <Link href="/clock" className="block py-3 hover:bg-white/10 rounded-2xl transition-all">Clock</Link>
                                </li>
                                <li className="block min-[1200px]:hidden" onClick={() => setIsMenuOpen(false)}>
                                    <Link href="/community" className="block py-3 hover:bg-white/10 rounded-2xl transition-all">Community</Link>
                                </li>
                                <li className="block min-[1100px]:hidden" onClick={() => setIsMenuOpen(false)}>
                                    <Link href="/study" className="block py-3 hover:bg-white/10 rounded-2xl transition-all">Study</Link>
                                </li>
                                <li className="block lg:hidden" onClick={() => setIsMenuOpen(false)}>
                                    <Link href="/profile" className="block py-3 hover:bg-white/10 rounded-2xl transition-all">Profile</Link>
                                </li>
                                <li onClick={() => setIsMenuOpen(false)}>
                                    <Link href="/internal" className="block py-3 hover:bg-white/10 rounded-2xl transition-all text-white">
                                        Internal
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Mobile Hamburger Button */}
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

                {/* Dropdown Menus (Mobile & Desktop Overflow) */}
                <div className="relative">
                    {/* Mobile Dropdown (Popup Style) */}
                    <div className={`lg:hidden absolute top-full right-0 mt-4 w-64 backdrop-blur-md rounded-[2rem] border border-white/20 overflow-hidden transition-all duration-500 ease-in-out shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${isMenuOpen ? "max-h-screen opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"}`}>
                        <ul className="flex flex-col p-4 text-center text-lg font-medium text-white">
                            {[...MENU_ITEMS, "Internal"].map((item) => (
                                <li key={item} onClick={() => setIsMenuOpen(false)}>
                                    <Link href={`/${item.toLowerCase()}`} className="block py-3 hover:bg-white/10 rounded-2xl transition-all">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
