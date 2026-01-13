"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = ["Profile", "Study", "Fun"];

    return (
        <nav className="sticky top-0 z-50 px-[5%] py-4 md:py-6 bg-[#718eac] shadow-lg transition-all">
            <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl md:text-3xl font-extrabold tracking-tighter text-white hover:scale-105 transition-transform duration-300">
                    Study Lab.
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-10 text-xl font-medium text-white">
                    {menuItems.map((item) => (
                        <li key={item}>
                            <Link href={`/${item.toLowerCase()}`} className="group relative py-1">
                                {item}
                                <span className="absolute left-0 bottom-[-4px] w-0 h-1 bg-[#365470] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Hamburger Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    aria-label="Toggle Menu"
                >
                    <div className={`w-7 h-0.5 bg-white transition-all ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
                    <div className={`w-7 h-0.5 bg-white transition-all ${isMenuOpen ? "opacity-0" : ""}`}></div>
                    <div className={`w-7 h-0.5 bg-white transition-all ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-64 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
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
    );
}
