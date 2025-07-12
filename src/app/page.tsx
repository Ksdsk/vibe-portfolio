"use client";

import { useState } from "react";
import ThreeCanvas from "./ThreeCanvas";

export default function Home() {
  const [cardYOffset, setCardYOffset] = useState(0);
  const [cardZRotation, setCardZRotation] = useState(0);
  const [modalAnimationPhase, setModalAnimationPhase] = useState<'closed' | 'open'>('closed');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const openModal = () => {
    setCardYOffset(-3.5);
    setCardZRotation(-0.4);
    setModalAnimationPhase('open');
  };

  const closeModal = () => {
    setCardYOffset(0);
    setCardZRotation(0);
    setModalAnimationPhase('closed');
    setExpandedJob(null);
  };

  const expandJob = (jobId: string) => {
    setExpandedJob(jobId);
  };

  const collapseJob = () => {
    setExpandedJob(null);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: '#ffffff'
      }}
    >
      {/* Scrolling Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="py-2 text-center relative h-6">
          <div className="animate-fade-text text-white/80 text-sm font-medium absolute inset-0 flex items-center justify-center">
            <span className="block">This website has been entirely vibe-coded. I&apos;m always up to trying out new things!</span>
            <span className="block">Website currently in development. Updates are rolling out (fast) to fix any visual bugs and adding more content.</span>
          </div>
        </div>
      </div>

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
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={closeModal}
        style={{
          pointerEvents: modalAnimationPhase === 'open' ? 'auto' : 'none',
          opacity: modalAnimationPhase === 'open' ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          display: modalAnimationPhase === 'closed' ? 'none' : 'flex'
        }}
      >
        <div 
          className="w-full max-w-4xl h-3/4 bg-black/80 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden flex flex-col"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 12px 24px -8px rgba(0,0,0,0.35)',
            pointerEvents: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
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
          <div className="flex-1 overflow-y-auto p-6 modal-scrollbar" style={{ willChange: 'scroll-position' }}>
            {expandedJob ? (
              // Expanded job view
              <div className="h-full">
                <button 
                  onClick={collapseJob}
                  className="mb-6 text-white/70 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to all jobs
                </button>
                
                {expandedJob === 'aws-sde1' && (
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h2 className="text-2xl font-bold text-white mb-2">Software Development Engineer I</h2>
                      <p className="text-blue-400 text-lg mb-2">Amazon Web Services</p>
                      <p className="text-white/60 text-sm">2024 - Present</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-3">Role Overview</h3>
                      <p className="text-white/80 leading-relaxed">
                        As a Software Development Engineer I at Amazon Web Services, I work on developing and maintaining 
                        scalable cloud infrastructure and services. My role involves collaborating with cross-functional teams 
                        to design, implement, and optimize internal tools and services that improve developer productivity 
                        and system reliability.
                      </p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-3">Key Responsibilities</h3>
                      <ul className="text-white/80 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>Develop and maintain cloud-native applications and microservices</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>Collaborate with senior engineers on system architecture and design</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>Participate in code reviews and contribute to technical documentation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>Work on performance optimization and scalability improvements</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-3">Technologies & Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Java</span>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Python</span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">AWS</span>
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">Docker</span>
                        <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">Kubernetes</span>
                        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm">Microservices</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {expandedJob === 'aws-intern' && (
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h2 className="text-2xl font-bold text-white mb-2">Software Development Engineer Intern</h2>
                      <p className="text-green-400 text-lg mb-2">Amazon Web Services</p>
                      <p className="text-white/60 text-sm">2023 - 2024</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-3">Internship Overview</h3>
                      <p className="text-white/80 leading-relaxed">
                        During my internship at AWS, I focused on developing cloud-native applications and services. 
                        I had the opportunity to work on real-world projects that impact millions of customers, 
                        contributing to internal tools and participating in the full software development lifecycle.
                      </p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-3">Key Projects</h3>
                      <ul className="text-white/80 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>Developed internal tools to improve developer productivity</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>Participated in code reviews and agile development processes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>Collaborated with senior engineers on system design</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>Gained experience with AWS cloud services and infrastructure</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-3">Technologies & Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Java</span>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Python</span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">AWS</span>
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">Git</span>
                        <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">Agile</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {expandedJob === 'dnd-intern' && (
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h2 className="text-2xl font-bold text-white mb-2">Software Developer Intern</h2>
                      <p className="text-purple-400 text-lg mb-2">Department of National Defence Canada</p>
                      <p className="text-white/60 text-sm">2022 - 2023</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-3">Defense Software Development</h3>
                      <p className="text-white/80 leading-relaxed">
                        Worked on developing software solutions for defense applications, focusing on secure systems 
                        and mission-critical software development. Contributed to projects that support national security 
                        and defense operations.
                      </p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-3">Key Contributions</h3>
                      <ul className="text-white/80 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>Developed secure software solutions for defense applications</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>Worked on mission-critical software development projects</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>Implemented security best practices in software development</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>Collaborated with defense teams on technical requirements</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-3">Technologies & Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">C++</span>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Python</span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">Linux</span>
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">Git</span>
                        <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">Security</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {expandedJob === 'qualiti7-intern' && (
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h2 className="text-2xl font-bold text-white mb-2">Full Stack Web Developer Intern</h2>
                      <p className="text-orange-400 text-lg mb-2">Qualiti7</p>
                      <p className="text-white/60 text-sm">2021 - 2022</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-3">Web Development Experience</h3>
                      <p className="text-white/80 leading-relaxed">
                        Built and maintained web applications using modern JavaScript frameworks. Collaborated with 
                        design teams to create intuitive user experiences and optimized application performance 
                        for client projects.
                      </p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-3">Key Projects</h3>
                      <ul className="text-white/80 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-orange-400 mt-1">•</span>
                          <span>Developed responsive web applications using React and Node.js</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-400 mt-1">•</span>
                          <span>Collaborated with design teams on UI/UX improvements</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-400 mt-1">•</span>
                          <span>Optimized application performance and user experience</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-400 mt-1">•</span>
                          <span>Worked with MongoDB for database management</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-3">Technologies & Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">JavaScript</span>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">React</span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">Node.js</span>
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">MongoDB</span>
                        <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">HTML/CSS</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Job list view
              <div className="space-y-8">
                {/* Software Development Engineer I */}
                <div 
                  className="bg-white/5 rounded-lg p-6 border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-200" 
                  style={{ backdropFilter: 'none' }}
                  onClick={() => expandJob('aws-sde1')}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Software Development Engineer I</h3>
                      <p className="text-blue-400 font-medium">Amazon Web Services</p>
                    </div>
                    <span className="text-white/60 text-sm">2024 - Present</span>
                  </div>
                  <p className="text-white/80 mb-4">
                    Developing and maintaining scalable cloud infrastructure and services. Working on AWS internal tools and services to improve developer productivity and system reliability.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Java</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Python</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">AWS</span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">Docker</span>
                  </div>
                </div>

                {/* Software Development Engineer Intern */}
                <div 
                  className="bg-white/5 rounded-lg p-6 border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-200"
                  onClick={() => expandJob('aws-intern')}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Software Development Engineer Intern</h3>
                      <p className="text-green-400 font-medium">Amazon Web Services</p>
                    </div>
                    <span className="text-white/60 text-sm">2023 - 2024</span>
                  </div>
                  <p className="text-white/80 mb-4">
                    Internship focused on developing cloud-native applications and services. Contributed to internal tools and participated in code reviews and agile development processes.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Java</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Python</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">AWS</span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">Git</span>
                  </div>
                </div>

                {/* Software Developer Intern */}
                <div 
                  className="bg-white/5 rounded-lg p-6 border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-200"
                  onClick={() => expandJob('dnd-intern')}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Software Developer Intern</h3>
                      <p className="text-purple-400 font-medium">Department of National Defence Canada</p>
                    </div>
                    <span className="text-white/60 text-sm">2022 - 2023</span>
                  </div>
                  <p className="text-white/80 mb-4">
                    Developed software solutions for defense applications. Worked on secure systems and contributed to mission-critical software development projects.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">C++</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Python</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">Linux</span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">Git</span>
                  </div>
                </div>

                {/* Full Stack Web Developer Intern */}
                <div 
                  className="bg-white/5 rounded-lg p-6 border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-200"
                  onClick={() => expandJob('qualiti7-intern')}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Full Stack Web Developer Intern</h3>
                      <p className="text-orange-400 font-medium">Qualiti7</p>
                    </div>
                    <span className="text-white/60 text-sm">2021 - 2022</span>
                  </div>
                  <p className="text-white/80 mb-4">
                    Built and maintained web applications using modern JavaScript frameworks. Collaborated with design teams to create intuitive user experiences and optimized application performance.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">JavaScript</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">React</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">Node.js</span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">MongoDB</span>
                  </div>
                </div>

                {/* Education */}
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Education</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-white">Bachelor of Computer Science</h4>
                      <p className="text-blue-400">University of Ottawa</p>
                      <p className="text-white/60 text-sm">2020 - 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
