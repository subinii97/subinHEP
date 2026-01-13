import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="relative text-slate-800 antialiased" suppressHydrationWarning={true}>
        {/* 움직이는 그라데이션 배경 */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-r from-[#355C7D] via-[#6C5B7B] to-[#C06C84] animate-gradient"></div>

        <Navbar />

        {children}
      </body>
    </html>
  );
}