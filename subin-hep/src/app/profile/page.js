"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import Math from "@/components/common/Math";

export default function ProfilePage() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      {/* Header / Intro Section */}
      <section className="mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
              About Me
            </h1>
            <div className="flex items-center gap-4 pt-2 md:pt-4">
              <a
                href="https://inspirehep.net/authors/1853380"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center border border-white/10 transition-all hover:scale-110 overflow-hidden"
                title="inspireHEP"
              >
                <img src="/assets/inspire_logo.png" alt="inspireHEP" className="w-7 h-7 object-contain" />
              </a>
              <a
                href="https://orcid.org/0000-0002-1019-6401"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center border border-white/10 transition-all hover:scale-110 overflow-hidden"
                title="ORCID"
              >
                <img src="/assets/orcid_logo.png" alt="ORCID" className="w-7 h-7 object-contain" />
              </a>
              <a
                href="https://x.com/limsb97"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center border border-white/10 transition-all hover:scale-110 overflow-hidden"
                title="X (Twitter)"
              >
                <img src="/assets/x_logo.png" alt="X" className="w-6 h-6 object-contain invert" />
              </a>
              <a
                href="https://www.instagram.com/subinii_97/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center border border-white/10 transition-all hover:scale-110 overflow-hidden"
                title="Instagram"
              >
                <img src="/assets/instagram_logo.png" alt="Instagram" className="w-7 h-7 object-contain" />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-4xl">
          <p className="text-white text-lg md:text-xl leading-relaxed opacity-90 mb-6">
            안녕하세요! Hello!
            <br></br>
            I am a strongly motivated researcher who is passionate about High Energy Physics and Web Development.
            My interests include data analysis using machine learning and web system development.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-1.5 bg-white/10 rounded-full text-sm text-white/80 border border-white/10 font-medium">High Energy Physics</span>
            <span className="px-4 py-1.5 bg-white/10 rounded-full text-sm text-white/80 border border-white/10 font-medium">Machine Learning</span>
            <span className="px-4 py-1.5 bg-white/10 rounded-full text-sm text-white/80 border border-white/10 font-medium">Top Quark</span>
            <span className="px-4 py-1.5 bg-white/10 rounded-full text-sm text-white/80 border border-white/10 font-medium">Higgs Boson</span>
            <span className="px-4 py-1.5 bg-white/10 rounded-full text-sm text-white/80 border border-white/10 font-medium">Beyond the Standard Model</span>
          </div>
        </div>
      </section>

      {/* CV Content Sections */}
      <div className="grid grid-cols-1 min-[1200px]:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-24">
        {/* Education */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#718eac]/20 rounded-lg flex items-center justify-center text-[#718eac]">🎓</span>
            Education
          </h2>
          <div className="space-y-6">
            <div className="group relative p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-lg md:text-xl text-white">Master of Science in Physics</h3>
                <span className="text-sm text-white/80">2020 - 2022</span>
              </div>
              <p className="text-white text-base mb-1">Hanyang University</p>
              <p className="text-white/80 text-base italic leading-relaxed">
                Dissertation: "Search for charged lepton flavor violation in top quark sector with hadronic <Math formula="\tau" /> final state using CMS Run 2 data at <Math formula="\sqrt{s}" /> = 13 TeV"
              </p>
              <p className="text-white/80 text-base mb-1">Advisor: Prof. Tae Jeong Kim</p>
              <div className="mt-4 flex flex-wrap gap-3 items-center">
                <div className="px-3 py-1 bg-yellow-500/10 rounded-lg text-xs text-yellow-500 font-bold border border-yellow-500/20">
                  BEST DISSERTATION AWARD
                </div>
                <a
                  href="/assets/master_thesis.pdf"
                  download
                  className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-[#FFF2E0] font-bold border border-white/20 transition-all hover:scale-105"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  Dissertation (PDF)
                </a>
              </div>
            </div>

            <div className="group relative p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-lg md:text-xl text-white">Bachelor of Science in Physics</h3>
                <span className="text-sm text-white/80">2016 - 2020</span>
              </div>
              <p className="text-white text-base mb-1">Hanyang University</p>
              <p className="text-white/80 text-base mb-1">Dual Degree: Mechanical Engineering</p>
              <p className="text-white/80 text-base italic leading-relaxed mb-1">
                Thesis: Study of identification of <Math formula="b" />-jets in <Math formula="t\bar{t}b\bar{b}" /> using Deep Neural Networks
              </p>
              <p className="text-white/80 text-base mb-1">Advisor: Prof. Tae Jeong Kim</p>
              <div className="mt-4 flex flex-wrap gap-3 items-center">
                <a
                  href="/assets/bachelor_thesis.pdf"
                  download
                  className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-[#FFF2E0] font-bold border border-white/20 transition-all hover:scale-105"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  Thesis (PDF)
                </a>
                <a
                  href="/assets/bachelor_poster.pdf"
                  download
                  className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-[#FFF2E0] font-bold border border-white/20 transition-all hover:scale-105"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  Poster (PDF)
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Research Experience */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#718eac]/20 rounded-lg flex items-center justify-center text-[#718eac]">🔬</span>
            Research Experience
          </h2>
          <div className="space-y-6">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-lg text-white">Elementary Particle Physics Lab., HYU</h4>
                <span className="text-sm text-white/80">2019 - 2022</span>
              </div>
              <p className="text-white/80 text-base mb-1 font-medium">Researcher</p>
              <ul className="text-white/80 text-base space-y-2 list-disc pl-5">
                <li>Search for charged lepton flavor violation in the top quark sector using CMS Run 2 data.</li>
                <li>Participated in the <Math formula="t\bar{t}b\bar{b}" /> analysis for precision measurements.</li>
                <li>Developed Deep Learning models for particle identification and matching.</li>
              </ul>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-lg text-white">CMS Collaboration, CERN</h4>
                <span className="text-sm text-white/80">2020 - 2022</span>
              </div>
              <p className="text-white/80 text-base mb-1 font-medium">Research Assistant</p>
              <ul className="text-white/80 text-base space-y-2 list-disc pl-5">
                <li>Analyzed CMS Run 2 data for charged lepton flavour violation in top quark.</li>
                <li>Applied DNN algorithms for signal/background separation.</li>
                <li>Contributed to Tau Data Quality Monitoring (DQM).</li>
              </ul>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-lg text-white">Parallel Computing Lab, HYU</h4>
                <span className="text-sm text-white/80">2019</span>
              </div>
              <p className="text-white/80 text-base mb-1 font-medium">Undergraduate Researcher</p>
              <p className="text-white/80 text-base leading-relaxed">
                Designed collision warning and braking algorithm with real-time object detection using R-CNN for Mechanical Engineering project.
              </p>
            </div>
          </div>
        </section>
      </div >

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 md:mb-24">
        {/* Publications */}
        <section className="md:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#718eac]/20 rounded-lg flex items-center justify-center text-[#718eac]">📝</span>
            Publications
          </h2>
          <div className="space-y-4">
            {[
              {
                journal: "JHEP",
                year: 2025,
                title: <>Search for charged-lepton flavour violation in top quark interactions with an up-type quark, a muon, and a <Math formula="\tau" /> lepton in proton-proton collisions at <Math formula="\sqrt{s}" /> = 13 TeV</>
              },
              {
                journal: "EPJ Plus",
                year: 2022,
                title: <>Learning to increase matching efficiency in identifying additional b-jets in the <Math formula="t\bar{t}b\bar{b}" /> process</>
              },
              {
                journal: "MPL A",
                year: 2021,
                title: <>Implementation of the ATLAS-SUSY-2018-04 analysis in MadAnalysis 5 framework (staus in the di-tau plus missing transverse energy channel; <Math formula="139 fb^{-1}" />)</>
              },
              {
                journal: "JKPS",
                year: 2020,
                title: <>Identification of additional jets in the <Math formula="t\bar{t}b\bar{b}" /> process by using deep neural network</>
              }
            ].map((pub, i) => (
              <div key={i} className="flex gap-4 items-center p-5 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors">
                <div className="flex-none w-20 text-center py-2 bg-white/5 rounded-xl border border-white/10">
                  <span className="block text-sm font-bold text-white">{pub.journal}</span>
                  <span className="block text-xs text-white/80">{pub.year}</span>
                </div>
                <div className="text-white/90 text-base leading-snug">{pub.title}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Skills */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#718eac]/20 rounded-lg flex items-center justify-center text-[#718eac]">💻</span>
            Skills
          </h2>
          <div className="space-y-6">
            <div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-3 ml-1">Programming Languages</p>
              <div className="flex flex-wrap gap-2">
                {['Python', 'C++', 'C', 'JavaScript'].map(s => (
                  <span key={s} className="px-4 py-2 bg-white/5 rounded-xl text-base text-white border border-white/10">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-3 ml-1">Machine Learning</p>
              <div className="flex flex-wrap gap-2">
                {['TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn'].map(s => (
                  <span key={s} className="px-4 py-2 bg-white/5 rounded-xl text-base text-white border border-white/10">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-3 ml-1">HEP Tools</p>
              <div className="flex flex-wrap gap-2">
                {['MadGraph', 'Pythia', 'Delphes', 'ROOT'].map(s => (
                  <span key={s} className="px-4 py-2 bg-white/5 rounded-xl text-base text-white border border-white/10">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-3 ml-1">Tools</p>
              <div className="flex flex-wrap gap-2">
                {['git', 'Linux', 'TeX', 'Docker'].map(s => (
                  <span key={s} className="px-4 py-2 bg-white/5 rounded-xl text-base text-white border border-white/10">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CV Preview Section - Relocated to bottom */}
      <section className="mt-12 md:mt-20 border-t border-white/10 pt-16">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 mb-12">
          <Button
            variant={showPreview ? "secondary" : "primary"}
            onClick={() => setShowPreview(!showPreview)}
            className="px-10 py-4 text-lg rounded-2xl shadow-xl hover:scale-105 transition-all min-w-[220px]"
          >
            {showPreview ? "Hide CV" : "View full CV"}
          </Button>
          <a href="/assets/CV_Jan2026.pdf" download="Subin_CV.pdf">
            <Button variant="secondary" className="px-10 py-4 text-lg rounded-2xl shadow-xl hover:scale-105 transition-all min-w-[220px] flex items-center justify-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download CV
            </Button>
          </a>
        </div>

        {showPreview && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="relative w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-[2rem] md:rounded-[3rem] border border-white/20 overflow-hidden shadow-2xl h-[900px]">
              <iframe
                src="/assets/CV_Jan2026.pdf#view=FitH"
                className="w-full h-full border-none"
                title="CV Preview"
              >
                <div className="text-white p-10">
                  브라우저가 PDF 미리보기를 지원하지 않습니다.
                  <a href="/assets/CV_Jan2026.pdf" className="underline ml-2">여기를 클릭하여 다운로드하세요.</a>
                </div>
              </iframe>
              <div className="absolute inset-0 pointer-events-none border-[20px] border-white/5 rounded-[3rem]"></div>
            </div>
          </div>
        )}
      </section>
    </div >
  );
}
