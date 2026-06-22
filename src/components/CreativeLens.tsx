"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ZoomIn, Eye, Activity, Shield } from "lucide-react";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface SliderImage {
  src: string;
  name: string;
  iso: string;
  aperture: string;
  shutter: string;
  aspect: string;
}

interface LensData {
  zoom: string;
  name: string;
  desc: string;
  coords: { top: string; left: string };
  images: SliderImage[];
}

const SLIDER_CONFIG: LensData[] = [
  {
    zoom: "0.5x",
    name: "Ultra-Wide Lens",
    desc: "13mm equivalent focal length. Expanding spatial bounds for high-contrast architectural and cityscape captures.",
    coords: { top: "22.0%", left: "23.4%" },
    images: [
      { src: "/images/0_5x/20251121_095049 (1).jpg", name: "Urban Perspective", iso: "100", aperture: "f/2.2", shutter: "1/500s", aspect: "9/16" },
      { src: "/images/0_5x/20260126_174529.jpg", name: "Stark Structures", iso: "200", aperture: "f/2.2", shutter: "1/320s", aspect: "9/16" },
      { src: "/images/0_5x/20260206_182217.jpg", name: "High-Contrast Edge", iso: "100", aperture: "f/2.2", shutter: "1/800s", aspect: "3/4" },
      { src: "/images/0_5x/20260519_143737.jpg", name: "Monochrome Geometry", iso: "400", aperture: "f/2.2", shutter: "1/200s", aspect: "9/16" },
    ],
  },
  {
    zoom: "1x",
    name: "Main Wide Lens",
    desc: "24mm equivalent focal length. Capturing organic urban geometries and street layout perspectives.",
    coords: { top: "44.0%", left: "23.4%" },
    images: [
      { src: "/images/1x/1774467048169.png", name: "Signal Overlay Grid", iso: "100", aperture: "f/1.8", shutter: "1/1000s", aspect: "9/16" },
      { src: "/images/1x/20250424_224514 (1).jpg", name: "Street Crossing Patterns", iso: "160", aperture: "f/1.8", shutter: "1/640s", aspect: "16/9" },
      { src: "/images/1x/20260308_174337.jpg", name: "Concrete Shadows", iso: "100", aperture: "f/1.8", shutter: "1/1200s", aspect: "9/16" },
      { src: "/images/1x/VideoCapture_20240920-190610 (1).jpg", name: "Dynamic Horizon Frame", iso: "200", aperture: "f/1.8", shutter: "1/400s", aspect: "21/9" },
    ],
  },
  {
    zoom: "3x",
    name: "Telephoto Lens",
    desc: "72mm equivalent focal length. Compressing architectural elements and distant details into dense graphic patterns.",
    coords: { top: "44.0%", left: "59.0%" },
    images: [
      { src: "/images/3x/20240307_073923 (1).jpg", name: "Compressed Facade Crops", iso: "100", aperture: "f/2.4", shutter: "1/250s", aspect: "16/9" },
      { src: "/images/3x/20240403_205715.jpg", name: "Abstract Grate Structure", iso: "125", aperture: "f/2.4", shutter: "1/320s", aspect: "9/20" },
      { src: "/images/3x/20250216_173836 (1).jpg", name: "Symmetric Architectural Lines", iso: "200", aperture: "f/2.4", shutter: "1/200s", aspect: "16/9" },
      { src: "/images/3x/20260227_212306 (2).jpg", name: "High-Altitude Outlines", iso: "100", aperture: "f/2.4", shutter: "1/500s", aspect: "9/16" },
    ],
  },
  {
    zoom: "10x",
    name: "Periscope Telephoto",
    desc: "240mm equivalent focal length. Abstract crops of skyscrapers and details beyond human vision.",
    coords: { top: "66.0%", left: "23.4%" },
    images: [
      { src: "/images/10x/1774523644782.jpg", name: "Abstract Skylight Beams", iso: "100", aperture: "f/4.9", shutter: "1/125s", aspect: "16/9" },
      { src: "/images/10x/20240223_191531.jpg", name: "Telemetry Signal Outline", iso: "400", aperture: "f/4.9", shutter: "1/60s", aspect: "16/9" },
      { src: "/images/10x/20251121_161908 (1).jpg", name: "Tonal Structural Grid", iso: "160", aperture: "f/4.9", shutter: "1/160s", aspect: "9/16" },
      { src: "/images/10x/20260519_143828.jpg", name: "Macro Metal Framing", iso: "100", aperture: "f/4.9", shutter: "1/200s", aspect: "9/16" },
    ],
  },
];

const allImages = SLIDER_CONFIG.flatMap((lens, lensIdx) => 
  lens.images.map(img => ({ ...img, lensIdx }))
);

const getAspectFrac = (aspectStr: string): number => {
  const parts = aspectStr.split("/");
  if (parts.length === 2) {
    const num = parseFloat(parts[0]);
    const den = parseFloat(parts[1]);
    if (!isNaN(num) && !isNaN(den) && den !== 0) {
      return num / den;
    }
  }
  return 1.0;
};

export default function CreativeLens() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Preload all slider images on mount
  useEffect(() => {
    SLIDER_CONFIG.forEach((lens) => {
      lens.images.forEach((imgObj) => {
        const img = new window.Image();
        img.src = imgObj.src;
      });
    });
  }, []);

  useGSAP(() => {
    const slider = sliderRef.current;
    const trigger = triggerRef.current;
    if (!slider || !trigger) return;

    const cards = gsap.utils.toArray<HTMLDivElement>(".gallery-card");

    const updateCardWidths = () => {
      const container = sliderContainerRef.current;
      const sld = sliderRef.current;
      if (!container || !sld) return;

      const containerRect = container.getBoundingClientRect();
      const sliderRect = sld.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      const isMobile = window.innerWidth < 768;
      const baseWidth = isMobile ? 220 : 300;
      const gap = 24;
      const paddingLeft = 48; // px-12

      // Read phase
      const targetWidths = cards.map((card, idx) => {
        if (!card) return baseWidth;
        const img = allImages[idx];
        const aspectFrac = getAspectFrac(img.aspect);
        const targetWidth = baseWidth * aspectFrac;

        // Calculate unexpanded center of this card
        const unexpandedCardCenter = sliderRect.left + paddingLeft + idx * (baseWidth + gap) + baseWidth / 2;
        const dist = Math.abs(unexpandedCardCenter - containerCenter);

        // Define threshold for expansion: within 45% of container width from center
        const maxDist = containerRect.width * 0.45;
        let t = 1 - Math.min(dist / maxDist, 1);
        
        // Smoothstep interpolation (ease-in-out)
        t = t * t * (3 - 2 * t);

        const width = baseWidth + (targetWidth - baseWidth) * t;
        return width;
      });

      // Write phase
      cards.forEach((card, idx) => {
        if (card) {
          gsap.set(card, { width: targetWidths[idx] });
        }
      });
    };

    // Horizontal Scroll Trigger
    const scrollTween = gsap.to(slider, {
      x: () => -(slider.scrollWidth - window.innerWidth * 0.72),
      ease: "none",
      scrollTrigger: {
        trigger: trigger,
        pin: containerRef.current,
        scrub: 0.5,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const progress = self.progress;
          let newIndex = 0;
          if (progress < 0.25) newIndex = 0;
          else if (progress < 0.5) newIndex = 1;
          else if (progress < 0.75) newIndex = 2;
          else newIndex = 3;

          setActiveIndex(newIndex);
          updateCardWidths();
        },
        onRefresh: () => {
          updateCardWidths();
        },
      },
    });

    // Run initial sizing with a slight delay to let layout settle
    const timer = setTimeout(updateCardWidths, 100);
    return () => {
      clearTimeout(timer);
    };
  }, { scope: triggerRef });

  const activeLens = SLIDER_CONFIG[activeIndex];
  const targetHighlight = activeLens.coords;

  // Flatten the image array to calculate indices for progress dots
  const allImages = SLIDER_CONFIG.flatMap((lens, lensIdx) => 
    lens.images.map(img => ({ ...img, lensIdx }))
  );

  return (
    <div ref={triggerRef} className="relative h-[600vh] w-full bg-black select-none">
      {/* Pinned Container */}
      <div 
        ref={containerRef} 
        className="relative h-screen w-full flex flex-col lg:flex-row items-stretch justify-between overflow-hidden border-b border-neutral-900"
      >
        {/* LEFT COLUMN: Camera Cluster Graphic & Highlight (28% width) */}
        <div className="w-full lg:w-[28%] h-[35%] lg:h-full flex flex-col justify-center items-center bg-[#050505] border-b lg:border-b-0 lg:border-r border-neutral-900 z-20 relative p-4 md:p-8">
          {/* Section HUD Info Placeholder */}

          {/* Section Heading Title */}
          <div className="mb-6 text-center select-none z-10 px-4">
            <h2 className="text-xl md:text-2xl font-sans font-light tracking-tight text-white leading-normal">
              The <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 font-bold px-1.5">
                greatest gear
                {/* Sparkle 1 */}
                <span className="absolute -top-1 -right-1.5 w-3 h-3 text-purple-400 animate-pulse">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                </span>
                {/* Sparkle 2 */}
                <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 text-indigo-400 animate-pulse delay-75">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                  </svg>
                </span>
              </span> ever I had
            </h2>
          </div>

          <div className="hidden md:flex relative w-48 md:w-56 aspect-[1568/2720] bg-[#0c0c0c] border border-neutral-900 rounded-[2.8rem] shadow-[inset_0_0_40px_rgba(0,0,0,1)] p-4 flex items-center justify-center overflow-hidden">
            {/* Transparent S21 camera module crop */}
            <div className="relative w-full aspect-[1568/2720]">
              <Image
                src="/images/s21_camera.png"
                alt="S21 Ultra Camera Module"
                width={1024}
                height={682}
                priority
                className="absolute max-w-none h-full w-auto"
                style={{ left: "-52.9%" }}
              />

              {/* Focus target circle tracking active lens coordinate */}
              <motion.div
                layout
                animate={{
                  top: targetHighlight.top,
                  left: targetHighlight.left,
                }}
                transition={{ type: "spring", stiffness: 100, damping: 18 }}
                className="absolute w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/80 shadow-[0_0_15px_rgba(255,255,255,0.6)] pointer-events-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
              >
                {/* Dynamic crosshair elements inside the focus circle */}
                <div className="w-full h-px bg-white/25 absolute" />
                <div className="h-full w-px bg-white/25 absolute" />
                <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm shadow-white animate-pulse" />
              </motion.div>
            </div>
          </div>

          {/* Focal details box */}
          <div className="mt-6 w-full max-w-[240px] bg-black/60 border border-neutral-900 p-4 rounded-xl font-mono text-[10px] text-neutral-400 flex flex-col gap-2 shadow-lg">
            <div className="text-white font-bold uppercase tracking-widest flex items-center gap-1.5 font-sans text-xs border-b border-neutral-900 pb-1.5">
              <ZoomIn className="w-3.5 h-3.5 text-white" />
              <span>ACTIVE: {activeLens.zoom}</span>
            </div>
            <span>SPEC: {activeLens.name}</span>
            <p className="text-[9px] text-neutral-500 leading-relaxed font-light">{activeLens.desc}</p>
          </div>
        </div>

        {/* RIGHT COLUMN: Camille Mormal Horizontal Photo Slider (72% width) */}
        <div 
          ref={sliderContainerRef}
          className="flex-1 lg:w-[72%] h-[65%] lg:h-full flex flex-col justify-center relative z-10 px-4 md:px-8 bg-black"
        >
          {/* Main Slider Track */}
          <div className="overflow-hidden w-full flex items-center py-6">
            <div
              ref={sliderRef}
              className="flex gap-6 items-center px-12 will-change-transform"
            >
              {SLIDER_CONFIG.map((lens, lensIdx) => (
                <div key={lens.zoom} className="flex gap-6 items-center">
                  {lens.images.map((img, imgIdx) => {
                    const isFocusGroup = activeIndex === lensIdx;
                    return (
                      <div
                        key={`${lens.zoom}-${imgIdx}`}
                        className={`relative gallery-card h-[220px] md:h-[300px] w-[220px] md:w-[300px] flex-shrink-0 border rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between p-4 group cursor-pointer pointer-events-auto transition-[opacity,transform,border-color,background-color,box-shadow] duration-500 bg-neutral-950/60 ${
                          isFocusGroup 
                            ? "border-neutral-800 shadow-neutral-950/80 scale-100" 
                            : "border-neutral-950 opacity-40 scale-[0.97]"
                        }`}
                      >
                        {/* Technical header */}
                        <div className="w-full flex justify-between items-center text-[8px] font-mono text-neutral-500 z-10">
                          <span>0{imgIdx + 1}</span>
                          <span className="w-1 h-1 bg-neutral-800 group-hover:bg-white rounded-full transition-colors" />
                        </div>

                        {/* Image area */}
                        <div className="absolute inset-0">
                          <Image
                            src={img.src}
                            alt={img.name}
                            fill
                            sizes="(max-width: 768px) 220px, 280px"
                            className="object-cover grayscale brightness-[0.85] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700 ease-out"
                          />
                          
                          {/* Centered '+' sign hover overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/15">
                            <div className="w-8 h-8 rounded-full border border-white/20 bg-black/60 backdrop-blur flex items-center justify-center">
                              <span className="text-white font-sans text-lg font-light leading-none">+</span>
                            </div>
                          </div>
                        </div>

                        {/* Technical HUD Footer (Specs Only, No Title) */}
                        <div className="w-full bg-black/75 backdrop-blur-md border border-neutral-900/60 p-2 rounded-lg z-10">
                          <div className="flex justify-between text-[8px] font-mono text-neutral-500 group-hover:text-white transition-colors">
                            <span>ISO {img.iso}</span>
                            <span>{img.aperture}</span>
                            <span>{img.shutter}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Slider Progress HUD Footer */}
          <div className="absolute bottom-10 left-12 right-12 flex justify-between items-center text-[10px] font-mono text-neutral-500 pointer-events-none">
            <div className="flex gap-2 pointer-events-auto">
              {SLIDER_CONFIG.map((lens, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === activeIndex
                      ? "w-8 bg-white"
                      : "w-2 bg-neutral-800 hover:bg-neutral-600 cursor-pointer"
                  }`}
                  onClick={() => {
                    const scrollPercent = [0.1, 0.35, 0.6, 0.85][idx];
                    const scrollHeight = triggerRef.current?.getBoundingClientRect().height || 0;
                    const topPos = (triggerRef.current?.offsetTop || 0) + scrollPercent * scrollHeight;
                    window.scrollTo({ top: topPos, behavior: "smooth" });
                  }}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
