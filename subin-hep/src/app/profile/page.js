"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import Math from "@/components/common/Math";

export default function ProfilePage() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="w-full">
      {/* Hero Header Section - Full Width (Negative margin to close gap with fixed navbar) */}
      <section className="relative w-full h-[300px] md:h-[450px] overflow-hidden -mt-[72px] md:-mt-[92px]">
        <img
          src="/assets/header_profile.jpeg"
          alt="Profile Header"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay for depth (Darker bottom for better text contrast) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>

        {/* Title Container - Constrained to match content */}
        <div className="absolute inset-0 flex items-end pb-12 md:pb-20">
          <div className="max-w-6xl mx-auto px-4 w-full flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="inline-block">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
                About Me
              </h1>
              <div className="w-30 h-1.5 bg-[#718eac] mt-4 rounded-full shadow-lg opacity-90 transition-all hover:w-32"></div>
            </div>

            {/* Social Links inside Hero Header */}
            <div className="flex items-center gap-4 pb-2">
              <a
                href="https://inspirehep.net/authors/1853380"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl flex items-center justify-center border border-white/20 transition-all hover:scale-110 shadow-2xl"
                title="inspireHEP"
              >
                <img src="/assets/inspire_logo.png" alt="inspireHEP" className="w-8 h-8 object-contain" />
              </a>
              <a
                href="https://orcid.org/0000-0002-1019-6401"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl flex items-center justify-center border border-white/20 transition-all hover:scale-110 shadow-2xl"
                title="ORCID"
              >
                <img src="/assets/orcid_logo.png" alt="ORCID" className="w-8 h-8 object-contain" />
              </a>
              <a
                href="https://x.com/limsb97"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl flex items-center justify-center border border-white/20 transition-all hover:scale-110 shadow-2xl"
                title="X (Twitter)"
              >
                <img src="/assets/x_logo.png" alt="X" className="w-7 h-7 object-contain invert" />
              </a>
              <a
                href="https://www.instagram.com/subinii_97/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl flex items-center justify-center border border-white/20 transition-all hover:scale-110 shadow-2xl"
                title="Instagram"
              >
                <img src="/assets/instagram_logo.png" alt="Instagram" className="w-8 h-8 object-contain" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections - Constrained Width */}
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-12">
        {/* Intro Section */}
        <section className="mb-12 md:mb-8">
          <div className="max-w-4xl">
            <p className="text-white text-lg md:text-xl leading-relaxed opacity-90 mb-8">
              안녕하세요! Hello!
              <br></br>
              I am a strongly motivated researcher who is passionate about High Energy Physics and Web Development.
              My interests include data analysis using machine learning and web system development.
            </p>

            <div className="flex flex-col gap-4 mb-8">
              <p className="text-white/60 text-sm font-bold uppercase tracking-[0.2em] ml-1">Research Interests</p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-white/5 rounded-2xl text-base text-white/90 border border-white/10 font-medium tracking-wide hover:bg-white/10 transition-colors">High Energy Physics</span>
                <span className="px-4 py-2 bg-white/5 rounded-2xl text-base text-white/90 border border-white/10 font-medium tracking-wide hover:bg-white/10 transition-colors">Machine Learning</span>
                <span className="px-4 py-2 bg-white/5 rounded-2xl text-base text-white/90 border border-white/10 font-medium tracking-wide hover:bg-white/10 transition-colors">Top Quark</span>
                <span className="px-4 py-2 bg-white/5 rounded-2xl text-base text-white/90 border border-white/10 font-medium tracking-wide hover:bg-white/10 transition-colors">Higgs Boson</span>
                <span className="px-4 py-2 bg-white/5 rounded-2xl text-base text-white/90 border border-white/10 font-medium tracking-wide hover:bg-white/10 transition-colors">Beyond the Standard Model</span>
              </div>
            </div>
          </div>
        </section>
        {/* Horizontal Divider */}
        <hr className="border-white/10 mb-12" />
        {/* Education & Research grid */}
        <div className="grid grid-cols-1 min-[1200px]:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-12">
          {/* Education */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#718eac]/20 rounded-lg flex items-center justify-center text-[#718eac]">🎓</span>
              Education
            </h2>
            <div className="space-y-6">
              <div className="group relative p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex justify-between items-start mb-1 min-[550px]:mb-2">
                  <h3 className="font-bold text-lg md:text-xl text-white">Master of Science in Physics</h3>
                  <span className="hidden min-[550px]:block text-sm text-white/50 tabular-nums whitespace-nowrap ml-4">2020 - 2022</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-white/80 text-base">Hanyang University</p>
                  <span className="block min-[550px]:hidden text-sm text-white/50 tabular-nums">2020 - 2022</span>
                </div>
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
                    className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white font-bold border border-white/20 transition-all hover:scale-105"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    Dissertation (PDF)
                  </a>
                </div>
              </div>

              <div className="group relative p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex justify-between items-start mb-1 min-[550px]:mb-2">
                  <h3 className="font-bold text-lg md:text-xl text-white">Bachelor of Science in Physics</h3>
                  <span className="hidden min-[550px]:block text-sm text-white/50 tabular-nums whitespace-nowrap ml-4">2016 - 2020</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-white/80 text-base">Hanyang University</p>
                  <span className="block min-[550px]:hidden text-sm text-white/50 tabular-nums">2016 - 2020</span>
                </div>
                <p className="text-white/80 text-base mb-1">Dual Degree: Bachelor of Science in Mechanical Engineering</p>
                <p className="text-white/80 text-base italic leading-relaxed mb-1">
                  Thesis: Study of identification of <Math formula="b" />-jets in <Math formula="t\bar{t}b\bar{b}" /> using Deep Neural Networks
                </p>
                <p className="text-white/80 text-base mb-1">Advisor: Prof. Tae Jeong Kim</p>
                <div className="mt-4 flex flex-wrap gap-3 items-center">
                  <a
                    href="/assets/bachelor_thesis.pdf"
                    download
                    className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white font-bold border border-white/20 transition-all hover:scale-105"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    Thesis (PDF)
                  </a>
                  <a
                    href="/assets/bachelor_poster.pdf"
                    download
                    className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white font-bold border border-white/20 transition-all hover:scale-105"
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
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group">
                <div className="flex justify-between items-start mb-1 min-[550px]:mb-2">
                  <h4 className="font-bold text-lg text-white">Elementary Particle Physics Lab., HYU</h4>
                  <span className="hidden min-[550px]:block text-sm text-white/50 tabular-nums whitespace-nowrap ml-4">2019 - 2022</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-white/80 text-base font-medium">Researcher</p>
                  <span className="block min-[550px]:hidden text-sm text-white/50 tabular-nums">2019 - 2022</span>
                </div>
                <ul className="text-white/80 text-base space-y-2 list-disc pl-5">
                  <li>Search for charged lepton flavor violation in the top quark sector using CMS Run 2 data.</li>
                  <li>Participated in the <Math formula="t\bar{t}b\bar{b}" /> analysis for precision measurements.</li>
                  <li>Developed Deep Learning models for particle identification and matching.</li>
                </ul>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group">
                <div className="flex justify-between items-start mb-1 min-[550px]:mb-2">
                  <h4 className="font-bold text-lg text-white">CMS Collaboration, CERN</h4>
                  <span className="hidden min-[550px]:block text-sm text-white/50 tabular-nums whitespace-nowrap ml-4">2020 - 2022</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-white/80 text-base font-medium">Research Assistant</p>
                  <span className="block min-[550px]:hidden text-sm text-white/50 tabular-nums">2020 - 2022</span>
                </div>
                <ul className="text-white/80 text-base space-y-2 list-disc pl-5">
                  <li>Analyzed CMS Run 2 data for charged lepton flavour violation in top quark.</li>
                  <li>Applied DNN algorithms for signal/background separation.</li>
                  <li>Contributed to Tau Data Quality Monitoring (DQM).</li>
                </ul>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group">
                <div className="flex justify-between items-start mb-1 min-[550px]:mb-2">
                  <h4 className="font-bold text-lg text-white">Parallel Computing Lab, HYU</h4>
                  <span className="hidden min-[550px]:block text-sm text-white/50 tabular-nums whitespace-nowrap ml-4">2019</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-white/80 text-base font-medium">Undergraduate Researcher</p>
                  <span className="block min-[550px]:hidden text-sm text-white/50 tabular-nums">2019</span>
                </div>
                <ul className="text-white/80 text-base space-y-2 list-disc pl-5">
                  <li>Designed collision warning and braking algorithm with real-time object detection using R-CNN for Mechanical Engineering project.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Horizontal Divider */}
        <hr className="border-white/10 mb-12" />

        {/* Publications & Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 md:mb-12">
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
                  url: "https://arxiv.org/abs/2504.08532",
                  type: "arXiv",
                  title: <>Search for charged-lepton flavour violation in top quark interactions with an up-type quark, a muon, and a <Math formula="\tau" /> lepton in proton-proton collisions at <Math formula="\sqrt{s}" /> = 13 TeV</>
                },
                {
                  journal: "EPJ Plus",
                  year: 2022,
                  url: "https://doi.org/10.1140/epjp/s13360-022-03024-8",
                  type: "DOI",
                  title: <>Learning to increase matching efficiency in identifying additional b-jets in the <Math formula="t\bar{t}b\bar{b}" /> process</>
                },
                {
                  journal: "MPL A",
                  year: 2021,
                  url: "https://doi.org/10.1142/S0217732321410091",
                  type: "DOI",
                  title: <>Implementation of the ATLAS-SUSY-2018-04 analysis in MadAnalysis 5 framework (staus in the di-tau plus missing transverse energy channel; <Math formula="139 fb^{-1}" />)</>
                },
                {
                  journal: "JKPS",
                  year: 2020,
                  url: "https://doi.org/10.3938/jkps.77.1100",
                  type: "DOI",
                  title: <>Identification of additional jets in the <Math formula="t\bar{t}b\bar{b}" /> process by using deep neural network</>
                }
              ].map((pub, i) => (
                <a
                  key={i}
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col sm:flex-row gap-2 items-start sm:items-center p-4 sm:p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all hover:shadow-lg overflow-hidden"
                >
                  <div className="flex-none w-full sm:w-24">
                    <div className="flex sm:flex-col items-center justify-center gap-2 sm:gap-0 w-full px-4 sm:px-2 py-1 bg-white/5 rounded-xl border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-colors">
                      <span className="text-sm font-bold text-white group-hover:text-white transition-colors whitespace-nowrap">{pub.journal}</span>
                      <span className="text-sm text-white/50 sm:text-white/70 tabular-nums whitespace-nowrap">{pub.year}</span>
                    </div>
                  </div>
                  <div className="flex-1 text-white/90 group-hover:text-white text-base leading-relaxed transition-all duration-300">
                    {pub.title}
                    <span className={`inline-block ml-3 text-[10px] font-black px-1.5 py-0.5 rounded-md text-white transition-all duration-300 transform translate-y-[-1px] ${pub.type === 'arXiv'
                      ? 'bg-[#b31a1b]/40 group-hover:bg-[#b31a1b] group-hover:shadow-[0_0_10px_rgba(179,26,27,0.3)]'
                      : 'bg-[#fab609]/40 group-hover:bg-[#fab609] group-hover:shadow-[0_0_10px_rgba(250,182,9,0.3)]'
                      }`}>
                      {pub.type}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Technical Skills */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#718eac]/20 rounded-lg flex items-center justify-center text-[#718eac]">💻</span>
              Skills
            </h2>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <div className="space-y-6">
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3 ml-1">Programming Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'C++', 'C', 'JavaScript'].map(s => (
                      <span key={s} className="px-4 py-2 bg-white/5 rounded-xl text-sm text-white border border-white/10">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3 ml-1">Machine Learning</p>
                  <div className="flex flex-wrap gap-2">
                    {['TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn'].map(s => (
                      <span key={s} className="px-4 py-2 bg-white/5 rounded-xl text-sm text-white border border-white/10">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3 ml-1">HEP Tools</p>
                  <div className="flex flex-wrap gap-2">
                    {['MadGraph', 'Pythia', 'Delphes', 'ROOT'].map(s => (
                      <span key={s} className="px-4 py-2 bg-white/5 rounded-xl text-sm text-white border border-white/10">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3 ml-1">Tools</p>
                  <div className="flex flex-wrap gap-2">
                    {['git', 'Linux', 'TeX', 'Docker'].map(s => (
                      <span key={s} className="px-4 py-2 bg-white/5 rounded-xl text-sm text-white border border-white/10">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Horizontal Divider */}
        <hr className="border-white/10 mb-12" />

        {/* Additional CV Sections - Scholarships, Schools, etc. */}
        <div className="grid grid-cols-1 min-[1200px]:grid-cols-2 gap-8 md:gap-12 mb-12">
          {/* Scholarships & Awards */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#718eac]/20 rounded-lg flex items-center justify-center text-[#718eac]">🏆</span>
              Scholarships & Awards
            </h2>
            <div className="space-y-4">
              {[
                { date: "Aug. 2022", title: "The Best Dissertation Award", sub: "Dean of Graduate School, Hanyang University" },
                { date: "Mar. 2020 – Dec. 2021", title: "Graduate Program Scholarship", sub: "Graduate School of Hanyang University" },
                { date: "Mar. 2020", title: "Han Ki-su Scholarship", sub: "Department of Physics, Hanyang University" },
                { date: "Feb. 2020", title: "Academic Honor Award", sub: "Cum Laude, College of Natural Science, Hanyang University" },
                { date: "Dec. 2019", title: "The 11th Capstone Design Fair", sub: "3rd Place, LINC, Hanyang University" },
                { date: "Dec. 2019", title: "ME Design Project Presentation", sub: "2nd Place, Hanyang University" },
                { date: "Sept. 2017", title: "Hanyang Brain Scholarship", sub: "Top 3rd, Academic excellence, Hanyang University" },
                { date: "Sept. 2017", title: "Learning Mate Program", sub: "2nd Place, Hanyang University" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-start p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                  <div>
                    <h3 className="text-white font-bold text-base group-hover:text-white transition-colors">{item.title}</h3>
                    <p className="text-white/80 text-base mt-0.5">{item.sub}</p>
                  </div>
                  <span className="text-sm text-white/50 tabular-nums whitespace-nowrap ml-4 mt-1">{item.date}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Schools & Workshops */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#718eac]/20 rounded-lg flex items-center justify-center text-[#718eac]">🏫</span>
              Schools & Workshops
            </h2>
            <div className="space-y-4">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-base md:text-lg">CMS Data Analysis School</h3>
                  <span className="text-sm text-white/50 tabular-nums whitespace-nowrap ml-4">Sept. 2021</span>
                </div>
                <p className="text-white/80 text-base mb-2">Virtual, CERN</p>
                <ul className="text-white/80 text-base space-y-2 list-disc pl-5">
                  <li>Introduction to the CMS detector and HEP analysis.</li>
                  <li>Hands-on presentation "Search for an excited b quark decaying to a top quark and a W-boson"</li>
                </ul>
              </div>

              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-base md:text-lg">MadAnalysis5 Workshop on LHC Recasting</h3>
                  <span className="text-sm text-white/50 tabular-nums whitespace-nowrap ml-4">Feb. 2020</span>
                </div>
                <p className="text-white/80 text-base mb-2">KIAS, Seoul</p>
                <ul className="text-white/80 text-base space-y-2 list-disc pl-5">
                  <li>Studied tau lepton properties and BSM phenomenology.</li>
                  <li>Recasted ATLAS SUSY analysis (staus in the di-tau channel) using MadAnalysis 5 framework.</li>
                </ul>
              </div>

              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-base md:text-lg">Winter Camp on Particle Physics</h3>
                  <span className="text-sm text-white/50 tabular-nums whitespace-nowrap ml-4">Dec. 2018</span>
                </div>
                <p className="text-white/80 text-base mb-2">KIAS, Korea</p>
                <ul className="text-white/80 text-base space-y-2 list-disc pl-5">
                  <li>Lectures on the Standard Model, Cosmology, Dark Matter and Higgs Boson.</li>
                  <li>Hands-on session for HEP Tools (ROOT, MadGraph)</li>
                </ul>
              </div>

              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-base md:text-lg">Fundamentals of Deep Learning for Computer Vision, NVIDIA</h3>
                  <span className="text-sm text-white/50 tabular-nums whitespace-nowrap ml-4">Oct. 2018</span>
                </div>
                <p className="text-white/80 text-base mb-2">Hanyang University, Korea</p>
                <ul className="text-white/80 text-base space-y-2 list-disc pl-5">
                  <li>Learned basic visual object identification using CUDA and convolutional neural network (CNN) algorithms.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Horizontal Divider */}
        <hr className="border-white/10 mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16 md:mb-12">
          {/* Professional Membership */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#718eac]/20 rounded-lg flex items-center justify-center text-[#718eac]">🤝</span>
              Memberships
            </h2>
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white text-base md:text-lg">CERN, USER</h3>
                <span className="text-sm text-white/50 tabular-nums whitespace-nowrap ml-4">2020 - 2022</span>
              </div>
              <ul className="text-white/80 text-base space-y-2 list-disc pl-5">
                <li>Tau POG presentations</li>
                <li>DQM GUI development (EPR)</li>
                <li>Analysis of collision data</li>
              </ul>
            </div>
          </section>

          {/* Teaching Experience */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#718eac]/20 rounded-lg flex items-center justify-center text-[#718eac]">👨‍🏫</span>
              Teaching
            </h2>
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white text-base md:text-lg">Teaching Assistant</h3>
                <span className="text-sm text-white/50 tabular-nums whitespace-nowrap ml-4">2020 - 2021</span>
              </div>
              <ul className="text-white/80 text-base space-y-2 list-disc pl-5">
                <li>General Physics and Experiment 1 & 2 (4 semesters)</li>
                <li>Graded homework and managed experiments</li>
              </ul>
            </div>
          </section>

          {/* Military Service */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#718eac]/20 rounded-lg flex items-center justify-center text-[#718eac]">🎖️</span>
              Military
            </h2>
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white text-base md:text-lg">Seoul Fire HQ</h3>
                <span className="text-sm text-white/50 tabular-nums whitespace-nowrap ml-4">2022 - 2024</span>
              </div>
              <ul className="text-white/80 text-base space-y-2 list-disc pl-5">
                <li>Social Service Personnel</li>
                <li>Fulfilled military service obligation through community fire support</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Horizontal Divider */}
        <hr className="border-white/10 mb-12" />

        {/* CV Preview Section */}
        <section>
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
      </div>
    </div >
  );
}
