"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextParticles from "@/components/TextParticles";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const REVEAL_ITEMS = [
  { type: "text", content: "Hey" },
  { type: "text", content: "there," },
  { type: "text", content: "I'm" },
  { type: "particle-name" },
  { type: "text", content: "a" },
  { type: "text", content: "college" },
  { type: "text", content: "student" },
  { type: "text", content: "doing" },
  { type: "widget-engineering" },
  { type: "text", content: "and" },
  { type: "text", content: "a" },
  { type: "text", content: "hobbyist" },
  { type: "text", content: "photographer" },
  { type: "text", content: "specializing" },
  { type: "text", content: "in" },
  { type: "widget-automotive" },
  { type: "text", content: "and" },
  { type: "widget-computers" },
];

export default function EntranceTerminal() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Preloader count-up simulation
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 6) + 3;
      current = Math.min(current + increment, 100);
      setLoadingProgress(current);

      if (current === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoaded(true);
          document.body.style.overflow = "unset";
        }, 500);
      }
    }, 40);

    document.body.style.overflow = "hidden";

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "unset";
    };
  }, []);

  useGSAP(() => {
    if (!isLoaded) return;

    const trigger = triggerRef.current;
    const container = containerRef.current;
    if (!trigger || !container) return;

    // Pin the container and reveal words stagger-style on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        pin: container,
        scrub: 0.5,
        start: "top top",
        end: "bottom bottom",
      }
    });

    tl.fromTo(".reveal-item",
      { opacity: 0.08 },
      { 
        opacity: 1, 
        stagger: 0.5, 
        ease: "power1.out",
        duration: 1 
      }
    );
  }, [isLoaded]);

  // Refresh ScrollTrigger when loading finishes
  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [isLoaded]);

  return (
    <div className="relative w-full select-none bg-black">
      {/* 1. Camille Mormal Premium Preloader */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ 
              y: "-100%", 
              transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } 
            }}
            className="fixed inset-0 bg-neutral-950 z-50 flex flex-col justify-between p-6 md:p-12 text-white"
          >
            {/* Top Indicator */}
            <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-neutral-500">
              <span>LOADING PORTFOLIO</span>
              <span>EST. {new Date().getFullYear()}</span>
            </div>

            {/* Center Loading Numbers */}
            <div className="flex flex-col items-center justify-center">
              <div className="overflow-hidden h-24 md:h-36 flex items-center justify-center">
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-8xl md:text-[11rem] font-sans font-extrabold tracking-tighter leading-none flex items-baseline select-none"
                >
                  {String(loadingProgress).padStart(3, "0")}
                  <span className="text-sm md:text-xl font-mono font-light text-neutral-500 ml-2">%</span>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="mt-4 font-mono text-[9px] text-neutral-500 tracking-widest uppercase"
              >
                Loading Assets
              </motion.div>
            </div>

            {/* Bottom Status bar */}
            <div className="flex justify-between items-end border-t border-neutral-900 pt-6 text-[10px] font-mono text-neutral-600">
              <span>PORTFOLIO</span>
              <span>{loadingProgress}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Hero Gateway (Vertical Scroll Text Reveal) */}
      <div 
        ref={triggerRef}
        className="relative h-[250vh] w-full bg-black"
      >
        <div 
          ref={containerRef}
          className="h-screen w-full flex flex-col justify-between bg-black overflow-hidden relative border-b border-neutral-900"
        >
          {/* Decorative Technical Grid Overlay */}
          <div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" 
            style={{ maskImage: "radial-gradient(ellipse at center, black 65%, transparent 100%)" }}
          />

          {/* Minimalist HUD Header */}
          <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center text-[10px] font-mono tracking-widest text-neutral-500 z-20">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              <span>PORTFOLIO</span>
            </div>
          </header>

          {/* Main Full-Screen Reveal Paragraph */}
          <div className="flex-1 w-full flex items-center justify-center relative z-10 px-4 md:px-12">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight leading-normal flex flex-wrap justify-center items-center gap-x-4 gap-y-6">
                {REVEAL_ITEMS.map((item, idx) => {
                  if (item.type === "text") {
                    return (
                      <span key={idx} className="reveal-item opacity-[0.08] transition-colors duration-300 text-neutral-400">
                        {item.content}
                      </span>
                    );
                  }
                  if (item.type === "particle-name") {
                    return (
                      <div key={idx} className="reveal-item opacity-[0.08] w-full flex justify-center py-2">
                        <TextParticles text="Iftkhar" />
                      </div>
                    );
                  }
                  if (item.type === "widget-engineering") {
                    return (
                      <div key={idx} className="reveal-item opacity-[0.08] inline-block">
                        <motion.span 
                          whileHover="hover"
                          initial="initial"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-2xl md:text-4xl lg:text-5xl font-semibold rotate-[-1.5deg] hover:rotate-[1.5deg] hover:bg-emerald-500/20 transition-all duration-300 cursor-default group/eng"
                        >
                          engineering,
                          {/* Interactive Graph inline */}
                          <svg viewBox="0 0 60 30" className="w-16 h-8 md:w-20 md:h-10 text-emerald-400 overflow-visible inline-block align-middle mx-1">
                            {/* Grid lines */}
                            <line x1="0" y1="0" x2="60" y2="0" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" strokeDasharray="1 1" />
                            <line x1="0" y1="15" x2="60" y2="15" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" strokeDasharray="1 1" />
                            <line x1="0" y1="30" x2="60" y2="30" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" strokeDasharray="1 1" />
                            
                            {/* Bezier Spline */}
                            <motion.path 
                              variants={{
                                initial: { d: "M 5 25 C 20 5, 40 25, 55 5" },
                                hover: { d: "M 5 25 C 5 5, 55 25, 55 5" }
                              }}
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="1.5" 
                            />
                            
                            {/* Control handles */}
                            <motion.line 
                              variants={{
                                initial: { x1: 5, y1: 25, x2: 20, y2: 5 },
                                hover: { x1: 5, y1: 25, x2: 5, y2: 5 }
                              }}
                              stroke="currentColor" 
                              strokeOpacity="0.3" 
                              strokeWidth="0.5" 
                              strokeDasharray="1 1" 
                            />
                            <motion.line 
                              variants={{
                                initial: { x1: 55, y1: 5, x2: 40, y2: 25 },
                                hover: { x1: 55, y1: 5, x2: 55, y2: 25 }
                              }}
                              stroke="currentColor" 
                              strokeOpacity="0.3" 
                              strokeWidth="0.5" 
                              strokeDasharray="1 1" 
                            />
                            
                            <motion.circle 
                              variants={{
                                initial: { cx: 20, cy: 5 },
                                hover: { cx: 5, cy: 5 }
                              }}
                              r="1.5" 
                              fill="currentColor" 
                            />
                            <motion.circle 
                              variants={{
                                initial: { cx: 40, cy: 25 },
                                hover: { cx: 55, cy: 25 }
                              }}
                              r="1.5" 
                              fill="currentColor" 
                            />
                            
                            {/* Anchors */}
                            <rect x="3.5" y="23.5" width="3" height="3" fill="currentColor" />
                            <rect x="53.5" y="3.5" width="3" height="3" fill="currentColor" />
                          </svg>
                        </motion.span>
                      </div>
                    );
                  }
                  if (item.type === "widget-automotive") {
                    return (
                      <div key={idx} className="reveal-item opacity-[0.08] inline-block">
                        <motion.span
                          whileHover="hover"
                          initial="initial"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-2xl md:text-4xl lg:text-5xl font-semibold rotate-[2deg] hover:rotate-[-2deg] hover:bg-amber-500/20 transition-all duration-300 cursor-default group/auto"
                        >
                          automotive
                          {/* Speedometer inline */}
                          <svg viewBox="0 0 20 20" className="w-6 h-6 md:w-8 md:h-8 text-amber-400 overflow-visible inline-block align-middle ml-1">
                            {/* Dial arc */}
                            <path d="M 3 14 A 8 8 0 0 1 17 14" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
                            {/* Speed ticks */}
                            <line x1="3" y1="14" x2="4.5" y2="13.5" stroke="currentColor" strokeWidth="1" />
                            <line x1="10" y1="2" x2="10" y2="3.5" stroke="currentColor" strokeWidth="1" />
                            <line x1="17" y1="14" x2="15.5" y2="13.5" stroke="currentColor" strokeWidth="1" />
                            
                            {/* Needle */}
                            <motion.line
                              x1="10"
                              y1="14"
                              x2="10"
                              y2="5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              style={{ originX: "10px", originY: "14px" }}
                              variants={{
                                initial: { rotate: -60 },
                                hover: { 
                                  rotate: 60,
                                  transition: { type: "spring", stiffness: 200, damping: 8 }
                                }
                              }}
                            />
                            {/* Center pin */}
                            <circle cx="10" cy="14" r="1.5" fill="currentColor" />
                          </svg>
                        </motion.span>
                      </div>
                    );
                  }
                  if (item.type === "widget-computers") {
                    return (
                      <div key={idx} className="reveal-item opacity-[0.08] inline-block">
                        <motion.span
                          whileHover="hover"
                          initial="initial"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-2xl md:text-4xl lg:text-5xl font-semibold rotate-[-1deg] hover:rotate-[1deg] hover:bg-indigo-500/20 transition-all duration-300 cursor-default group/comp"
                        >
                          advanced computers.
                          {/* Interactive CPU Chip */}
                          <svg viewBox="0 0 20 20" className="w-6 h-6 md:w-8 md:h-8 text-indigo-400 overflow-visible inline-block align-middle ml-1">
                            {/* CPU Pins */}
                            <line x1="6" y1="3" x2="6" y2="5" stroke="currentColor" strokeWidth="1" />
                            <line x1="10" y1="3" x2="10" y2="5" stroke="currentColor" strokeWidth="1" />
                            <line x1="14" y1="3" x2="14" y2="5" stroke="currentColor" strokeWidth="1" />
                            
                            <line x1="6" y1="15" x2="6" y2="17" stroke="currentColor" strokeWidth="1" />
                            <line x1="10" y1="15" x2="10" y2="17" stroke="currentColor" strokeWidth="1" />
                            <line x1="14" y1="15" x2="14" y2="17" stroke="currentColor" strokeWidth="1" />
                            
                            <line x1="3" y1="6" x2="5" y2="6" stroke="currentColor" strokeWidth="1" />
                            <line x1="3" y1="10" x2="5" y2="10" stroke="currentColor" strokeWidth="1" />
                            <line x1="3" y1="14" x2="5" y2="14" stroke="currentColor" strokeWidth="1" />
                            
                            <line x1="15" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="1" />
                            <line x1="15" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1" />
                            <line x1="15" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="1" />
                            
                            {/* Silicon chip core */}
                            <rect x="5" y="5" width="10" height="10" rx="1.5" fill="black" stroke="currentColor" strokeWidth="1" />
                            
                            {/* Core logo dot */}
                            <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                            
                            {/* Pulsing signal circle */}
                            <motion.circle
                              cx="10"
                              cy="10"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.75"
                              variants={{
                                initial: { r: 1.5, opacity: 0 },
                                hover: {
                                  r: 7.5,
                                  opacity: [0, 0.8, 0],
                                  transition: {
                                    duration: 1.2,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                  }
                                }
                              }}
                            />
                          </svg>
                        </motion.span>
                      </div>
                    );
                  }
                  return null;
                })}
              </h1>
            </div>
          </div>

          {/* HUD Footer */}
          <footer className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-center items-center text-[10px] font-mono tracking-wider text-neutral-500 z-20 border-t border-neutral-900/40">
            <div className="flex items-center gap-1">
              <span className="animate-bounce">↓ SCROLL TO EXPLORE</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
