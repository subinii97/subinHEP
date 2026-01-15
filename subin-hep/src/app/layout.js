import "./globals.css";
import "katex/dist/katex.min.css";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "Subin HEP - Study Lab",
  description: "High Energy Physics Researcher & Web Developer",
  openGraph: {
    title: "Subin HEP - Study Lab",
    description: "High Energy Physics Researcher & Web Developer",
    images: ["/assets/header_profile.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Subin HEP - Study Lab",
    description: "High Energy Physics Researcher & Web Developer",
    images: ["/assets/header_profile.jpeg"],
  },
};

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