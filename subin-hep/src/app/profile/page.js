"use client";

import { useState } from "react";
import Button from "@/components/common/Button";

export default function ProfilePage() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      {/* Header / Intro Section */}
      <section className="mb-16 md:mb-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
          About Me
        </h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-[#FFF2E0] text-lg md:text-xl leading-relaxed opacity-90 mb-8">
            안녕하세요! 저는 고에너지 물리학(HEP) 연구와 웹 개발을 병행하고 있는 연구자입니다.
            데이터 분석과 물리 시뮬레이션, 그리고 이를 시각화하고 관리할 수 있는 웹 시스템 구축에 관심이 많습니다.
          </p>
          <div className="flex justify-center gap-4">
            {/* Toggle Button - Hidden on Mobile */}
            <div className="hidden md:block">
              <Button
                variant={showPreview ? "secondary" : "primary"}
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? "Hide Preview" : "Interactive View"}
              </Button>
            </div>

            <a href="/assets/CV_Jan2026.pdf" download="Subin_CV.pdf">
              <Button variant="secondary">Download PDF</Button>
            </a>
          </div>
        </div>
      </section>

      {/* CV Preview Section - Desktop Only, Conditional Rendering */}
      {showPreview && (
        <section className="hidden md:block animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFF2E0]">Curriculum Vitae</h2>
            <span className="text-sm text-[#FFF2E0]/50 font-medium">PDF Interactive Preview</span>
          </div>

          <div className="relative w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-[2rem] md:rounded-[3rem] border border-white/20 overflow-hidden shadow-2xl h-[900px]">
            <iframe
              src="/assets/CV_Jan2026.pdf#view=FitH"
              className="w-full h-full border-none"
              title="CV Preview"
            >
              <p className="text-white p-10 text-center">
                브라우저가 PDF 미리보기를 지원하지 않습니다.
                <a href="/assets/CV_Jan2026.pdf" className="underline ml-2">여기를 클릭하여 다운로드하세요.</a>
              </p>
            </iframe>

            <div className="absolute inset-0 pointer-events-none border-[20px] border-white/5 rounded-[3rem]"></div>
          </div>
        </section>
      )}
    </div>
  );
}
