import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="relative">
        {/* 은은한 배경 (투명도 조절) */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] opacity-60"></div>

        {/* 상단바 (nav-bar) */}
        <nav className="sticky top-0 z-50 flex justify-between items-center px-[10%] py-6 bg-white/30 backdrop-blur-md">
          <Link href="/" className="text-2xl font-bold text-slate-800 tracking-tight">
            Researcher's Lab
          </Link>
          
          <ul className="flex gap-8">
            <li><Link href="/profile" className="font-medium text-slate-600 hover:text-blue-600 transition">Profile</Link></li>
            <li><Link href="/study" className="font-medium text-slate-600 hover:text-blue-600 transition">Study</Link></li>
            <li><Link href="/fun" className="font-medium text-slate-600 hover:text-blue-600 transition">Fun</Link></li>
          </ul>
        </nav>

        {/* 각 페이지가 들어가는 자리 */}
        {children}
      </body>
    </html>
  );
}
