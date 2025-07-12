"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import ThreeCanvas from "./ThreeCanvas";

export default function Home() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: '#000000'
      }}
    >
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
        background: '#000000',
        zIndex: 0,
      }}>
        <ThreeCanvas />
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
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-8 h-8 text-white/90 group-hover:text-white transition-all duration-300 group-hover:scale-110" style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
              }}>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>

            {/* Jobs icon */}
            <div className="flex flex-col items-center group cursor-pointer">
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
