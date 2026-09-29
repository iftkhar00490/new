"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HelloPreloaderProps {
  onComplete: () => void;
}

export default function HelloPreloader({ onComplete }: HelloPreloaderProps) {
  // Animation phases: "drawing" -> "traveling" -> "flash" -> "done"
  const [phase, setPhase] = useState<"drawing" | "traveling" | "flash" | "done">("drawing");
  const [targetPos, setTargetPos] = useState({ x: 40, y: 36 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure exact position of top-left header dot
  useEffect(() => {
    const updateTarget = () => {
      const paddingX = window.innerWidth > 1280 ? (window.innerWidth - 1280) / 2 + 24 : 24;
      const paddingY = window.innerWidth > 768 ? 24 : 24;
      setTargetPos({ x: paddingX + 4, y: paddingY + 6 });
    };

    updateTarget();
    window.addEventListener("resize", updateTarget);
    return () => window.removeEventListener("resize", updateTarget);
  }, []);

  // Animation timeline progression
  useEffect(() => {
    // Phase 1: Draw "hello" (0s - 1.4s)
    const travelTimer = setTimeout(() => {
      setPhase("traveling");
    }, 1400);

    // Phase 2: Line travels to the dot & reaches target (1.4s - 2.1s)
    const flashTimer = setTimeout(() => {
      setPhase("flash");
    }, 2100);

    // Phase 3: Flash burst & unveil (2.1s - 2.6s)
    const finishTimer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 2600);

    return () => {
      clearTimeout(travelTimer);
      clearTimeout(flashTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  // Handle skip on click / keypress
  const handleSkip = () => {
    setPhase("done");
    onComplete();
  };

  if (phase === "done") return null;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }}
      onClick={handleSkip}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer select-none overflow-hidden"
    >
      {/* Background Subtle Starburst / Glow */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" 
      />

      {/* 1. THE ICONIC CURSIVE "hello" SVG */}
      <div className="relative flex items-center justify-center w-full max-w-[340px] sm:max-w-[480px] md:max-w-[560px] px-6">
        <motion.svg
          viewBox="0 0 540 220"
          className="w-full h-auto overflow-visible"
          animate={
            phase === "traveling"
              ? { opacity: 0.3, scale: 0.95, filter: "blur(4px)", transition: { duration: 0.6 } }
              : phase === "flash"
              ? { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
              : { opacity: 1, scale: 1, filter: "blur(0px)" }
          }
        >
          <defs>
            {/* Soft luminous glow filter */}
            <filter id="appleGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur1" />
              <feGaussianBlur stdDeviation="8" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradient along the stroke */}
            <linearGradient id="helloGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#a5f3fc" />
            </linearGradient>
          </defs>

          {/* Background blurred glow path */}
          <motion.path
            d="M 50,135 C 55,135 68,118 78,82 C 92,32 108,12 118,12 C 124,12 126,24 120,58 C 110,112 96,165 90,192 C 86,204 90,208 96,198 C 108,174 126,132 144,122 C 154,116 164,118 160,136 C 155,160 142,190 156,190 C 166,190 178,172 188,150 C 196,134 206,120 218,120 C 228,120 230,132 220,148 C 206,170 200,188 214,188 C 226,188 238,170 250,146 C 262,122 280,48 290,18 C 296,8 302,12 296,44 C 286,96 268,170 268,185 C 268,195 276,195 288,184 C 302,170 314,142 324,120 C 336,96 354,48 364,18 C 370,8 376,12 370,44 C 360,96 342,170 342,185 C 342,195 350,195 362,184 C 376,170 388,142 400,120 C 412,102 432,102 444,116 C 456,134 450,178 428,184 C 404,190 392,152 408,128 C 420,108 442,106 456,122 C 464,132 476,142 492,142"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.3, ease: [0.25, 1, 0.5, 1] }}
          />

          {/* Foreground Crisp White Stroke */}
          <motion.path
            d="M 50,135 C 55,135 68,118 78,82 C 92,32 108,12 118,12 C 124,12 126,24 120,58 C 110,112 96,165 90,192 C 86,204 90,208 96,198 C 108,174 126,132 144,122 C 154,116 164,118 160,136 C 155,160 142,190 156,190 C 166,190 178,172 188,150 C 196,134 206,120 218,120 C 228,120 230,132 220,148 C 206,170 200,188 214,188 C 226,188 238,170 250,146 C 262,122 280,48 290,18 C 296,8 302,12 296,44 C 286,96 268,170 268,185 C 268,195 276,195 288,184 C 302,170 314,142 324,120 C 336,96 354,48 364,18 C 370,8 376,12 370,44 C 360,96 342,170 342,185 C 342,195 350,195 362,184 C 376,170 388,142 400,120 C 412,102 432,102 444,116 C 456,134 450,178 428,184 C 404,190 392,152 408,128 C 420,108 442,106 456,122 C 464,132 476,142 492,142"
            fill="none"
            stroke="url(#helloGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#appleGlow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.3, ease: [0.25, 1, 0.5, 1] }}
          />
        </motion.svg>
      </div>

      {/* 2. TRAVELING ENERGY BEAM / TRAIL FROM "hello" TO TOP-LEFT DOT */}
      <AnimatePresence>
        {(phase === "traveling" || phase === "flash") && (
          <svg className="fixed inset-0 w-full h-full pointer-events-none z-40 overflow-visible">
            <defs>
              <linearGradient id="beamGrad" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>

            {/* Dynamic Bezier curve from center-right of hello up to the header dot */}
            <motion.path
              d={`M ${typeof window !== "undefined" ? window.innerWidth / 2 + 120 : 700} ${
                typeof window !== "undefined" ? window.innerHeight / 2 + 20 : 400
              } C ${typeof window !== "undefined" ? window.innerWidth * 0.35 : 400} ${
                typeof window !== "undefined" ? window.innerHeight * 0.45 : 300
              }, ${targetPos.x + 80} ${targetPos.y + 120}, ${targetPos.x} ${targetPos.y}`}
              fill="none"
              stroke="url(#beamGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="drop-shadow(0 0 8px rgba(255,255,255,0.9))"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1], 
                opacity: [0, 1, 0.8],
                transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } 
              }}
            />

            {/* Traveling Comet / Head Spark */}
            <motion.circle
              r="4"
              fill="#ffffff"
              filter="drop-shadow(0 0 10px #ffffff) drop-shadow(0 0 20px #38bdf8)"
              initial={{
                cx: typeof window !== "undefined" ? window.innerWidth / 2 + 120 : 700,
                cy: typeof window !== "undefined" ? window.innerHeight / 2 + 20 : 400,
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                cx: targetPos.x,
                cy: targetPos.y,
                opacity: [0, 1, 1],
                scale: [0.8, 1.6, 1.2],
                transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
              }}
            />
          </svg>
        )}
      </AnimatePresence>

      {/* 3. CLIMACTIC BRIGHT FLASH OF LIGHT & LENS FLARE AT THE TARGET DOT */}
      <AnimatePresence>
        {phase === "flash" && (
          <div 
            className="fixed pointer-events-none z-50 flex items-center justify-center"
            style={{ 
              left: `${targetPos.x}px`, 
              top: `${targetPos.y}px`,
              transform: "translate(-50%, -50%)" 
            }}
          >
            {/* Intense Central Flash */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 25, 40], 
                opacity: [0, 1, 0],
                transition: { duration: 0.55, ease: "easeOut" } 
              }}
              className="absolute w-12 h-12 rounded-full bg-[radial-gradient(circle,#ffffff_0%,rgba(255,255,255,0.9)_20%,rgba(56,189,248,0.4)_50%,transparent_75%)]"
            />

            {/* Horizontal Flare Anamorphic Beam */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ 
                scaleX: [0, 1.8, 0], 
                opacity: [0, 0.9, 0],
                transition: { duration: 0.5, ease: "easeOut" } 
              }}
              className="absolute h-[2px] w-[320px] sm:w-[480px] bg-white blur-[1px] shadow-[0_0_12px_#38bdf8]"
            />

            {/* Shockwave Glow Ring */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0.9, borderWidth: "3px" }}
              animate={{ 
                scale: 3, 
                opacity: 0, 
                borderWidth: "1px",
                transition: { duration: 0.55, ease: "easeOut" } 
              }}
              className="absolute w-20 h-20 rounded-full border border-cyan-300"
            />

            {/* Full Screen Ambient Flash Glare */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.35, 0],
                transition: { duration: 0.45, ease: "easeOut" } 
              }}
              className="fixed inset-0 bg-white pointer-events-none"
            />
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Hint */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center font-mono text-[9px] text-neutral-600 tracking-widest uppercase">
        <span>Click anywhere to skip</span>
      </div>
    </motion.div>
  );
}
