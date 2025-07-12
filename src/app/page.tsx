"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import ThreeCanvas from "./ThreeCanvas";

export default function Home() {
  const [cardYOffset, setCardYOffset] = useState(0);
  const [cardZRotation, setCardZRotation] = useState(0);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [isModalContentLoaded, setIsModalContentLoaded] = useState(false);

  const closeModal = () => {
    setIsModalClosing(true);
    setCardYOffset(0);
    setCardZRotation(0);
    setTimeout(() => {
      setIsJobModalOpen(false);
      setIsModalClosing(false);
      setIsModalContentLoaded(false);
    }, 300); // Match animation duration
  };

  const openModal = () => {
    setCardYOffset(-3.5);
    setCardZRotation(-0.4);
    setIsJobModalOpen(true);
    // Load content after modal animation starts
    setTimeout(() => {
      setIsModalContentLoaded(true);
    }, 150); // Half of animation duration
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: '#ffffff'
      }}
    >
      {/* Animated gradient background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -2,
        pointerEvents: 'none',
        background: 'linear-gradient(120deg, #1e3a8a 0%, #9333ea 50%, #f472b6 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientMove 12s ease-in-out infinite'
      }} />

      {/* Fullscreen Three.js 3D Background */}
      <div style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        background: 'transparent',
        zIndex: 0,
      }}>
        <ThreeCanvas cardYOffset={cardYOffset} cardZRotation={cardZRotation} />
      </div>

      {/* Job Modal */}
      {isJobModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="w-full max-w-4xl h-3/4 bg-black/80 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden transition-all duration-300 ease-out"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              transform: isModalClosing ? 'translateY(100%)' : 'translateY(0)',
              opacity: isModalClosing ? 0 : 1,
              animation: isModalClosing ? 'none' : 'slideUp 0.3s ease-out',
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">Professional Experience</h2>
              <button 
                onClick={closeModal}
                className="text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="h-full overflow-y-auto p-6" style={{ willChange: 'scroll-position' }}>
              {!isModalContentLoaded ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-white/60 text-lg">Loading...</div>
                </div>
              ) : (
                <div className="space-y-8">
                {/* Senior Software Engineer */}
                <div className="bg-white/5 rounded-lg p-6 border border-white/10" style={{ backdropFilter: 'none' }}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Senior Software Engineer</h3>
                      <p className="text-blue-400 font-medium">TechCorp Solutions</p>
                    </div>
                    <span className="text-white/60 text-sm">2022 - Present</span>
                  </div>
                  <p className="text-white/80 mb-4">
                    Leading development of scalable web applications using React, Node.js, and AWS. 
                    Mentored junior developers and implemented CI/CD pipelines that reduced deployment time by 60%.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">React</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Node.js</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">AWS</span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">TypeScript</span>
                  </div>
                </div>

                {/* Full Stack Developer */}
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Full Stack Developer</h3>
                      <p className="text-green-400 font-medium">InnovateLab</p>
                    </div>
                    <span className="text-white/60 text-sm">2020 - 2022</span>
                  </div>
                  <p className="text-white/80 mb-4">
                    Built and maintained multiple client applications using modern JavaScript frameworks. 
                    Collaborated with design teams to create intuitive user experiences and optimized application performance.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Vue.js</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Python</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">Django</span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">PostgreSQL</span>
                  </div>
                </div>

                {/* Junior Developer */}
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Junior Developer</h3>
                      <p className="text-purple-400 font-medium">StartupHub</p>
                    </div>
                    <span className="text-white/60 text-sm">2018 - 2020</span>
                  </div>
                  <p className="text-white/80 mb-4">
                    Contributed to the development of a SaaS platform serving 10,000+ users. 
                    Implemented new features, fixed bugs, and participated in code reviews and agile development processes.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">JavaScript</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">PHP</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">MySQL</span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">Git</span>
                  </div>
                </div>

                {/* Education */}
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Education</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-white">Bachelor of Computer Science</h4>
                      <p className="text-blue-400">University of Technology</p>
                      <p className="text-white/60 text-sm">2014 - 2018</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white">Web Development Certification</h4>
                      <p className="text-green-400">CodeAcademy</p>
                      <p className="text-white/60 text-sm">2019</p>
                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fixed bottom navbar */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        left: 0,
        width: '100vw',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}>
        <div className="bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-xl rounded-full border border-white/30 shadow-2xl p-4 max-w-sm" style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.15) 50%, rgba(236, 72, 153, 0.15) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        }}>
          <div className="flex justify-around items-center gap-8">
            {/* Profile icon */}
            <div className="flex flex-col items-center group cursor-pointer" onClick={() => { setCardYOffset(0); setCardZRotation(0); }}>
              <div className="w-8 h-8 text-white/90 group-hover:text-white transition-all duration-300 group-hover:scale-110" style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
              }}>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>

            {/* Jobs icon */}
            <div className="flex flex-col items-center group cursor-pointer" onClick={openModal}>
              <div className="w-8 h-8 text-white/90 group-hover:text-white transition-all duration-300 group-hover:scale-110" style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
              }}>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
                </svg>
              </div>
            </div>

            {/* Achievements icon */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-8 h-8 text-white/90 group-hover:text-white transition-all duration-300 group-hover:scale-110" style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
              }}>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
            </div>

            {/* Contact icon */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-8 h-8 text-white/90 group-hover:text-white transition-all duration-300 group-hover:scale-110" style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
              }}>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
