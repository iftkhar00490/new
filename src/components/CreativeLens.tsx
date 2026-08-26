"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, Sparkles, Filter, Grid, SlidersHorizontal } from "lucide-react";
import lensDataset from "@/data/lens_dataset.json";

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
  badgeLabel: string;
  btnLabel: string;
  name: string;
  desc: string;
  images: SliderImage[];
}

const LENS_METADATA = [
  { zoom: "0.5x", badgeLabel: "0.5X ULTRA WIDE", btnLabel: "ULTRA WIDE" },
  { zoom: "1x", badgeLabel: "1X MAIN", btnLabel: "MAIN" },
  { zoom: "3x", badgeLabel: "3X TELE", btnLabel: "3X TELE" },
  { zoom: "10x", badgeLabel: "10X SUPER TELE", btnLabel: "10X SUPER TELE" },
];

const SLIDER_CONFIG: LensData[] = lensDataset.map((item, idx) => ({
  ...item,
  badgeLabel: LENS_METADATA[idx]?.badgeLabel || item.zoom,
  btnLabel: LENS_METADATA[idx]?.btnLabel || item.zoom,
}));

const SCRAMBLE_CHARS = "0123456789%#&*+!=?/░▒▓█";

// Flatten all 56 images into a single master collection for full directory view
const ALL_56_PHOTOS: (SliderImage & { zoom: string })[] = SLIDER_CONFIG.flatMap((lens) =>
  lens.images.map((img) => ({ ...img, zoom: lens.zoom }))
);

export default function CreativeLens() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeLensIdx, setActiveLensIdx] = useState(0);
  const [subBatchIdx, setSubBatchIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState<(SliderImage & { zoom?: string }) | null>(null);
  const [archiveFilter, setArchiveFilter] = useState<string>("ALL");

  const activeLensIdxRef = useRef(0);
  const subBatchIdxRef = useRef(0);

  // Keep refs in sync with state
  useEffect(() => {
    activeLensIdxRef.current = activeLensIdx;
  }, [activeLensIdx]);

  useEffect(() => {
    subBatchIdxRef.current = subBatchIdx;
  }, [subBatchIdx]);

  // Robust real-time scroll progress calculation
  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const totalDist = trackRef.current.offsetHeight - window.innerHeight;
      if (totalDist <= 0) return;

      // Progress from 0 to 1 as the sticky section scrolls through its 360vh track
      const scrolled = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, scrolled / totalDist));

      const totalLenses = SLIDER_CONFIG.length;
      const lensFloat = rawProgress * totalLenses;
      const newLensIdx = Math.min(Math.floor(lensFloat), totalLenses - 1);

      // Sub-batch rotation inside active lens
      const lensFraction = lensFloat - newLensIdx;
      const activeImagesCount = SLIDER_CONFIG[newLensIdx].images.length;
      const numSubBatches = Math.max(1, Math.ceil(activeImagesCount / 8));
      const newSubBatch = Math.min(
        Math.floor(lensFraction * numSubBatches),
        numSubBatches - 1
      );

      if (newLensIdx !== activeLensIdxRef.current) {
        activeLensIdxRef.current = newLensIdx;
        subBatchIdxRef.current = 0;
        setActiveLensIdx(newLensIdx);
        setSubBatchIdx(0);
      } else if (newSubBatch !== subBatchIdxRef.current) {
        subBatchIdxRef.current = newSubBatch;
        setSubBatchIdx(newSubBatch);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      handleScroll();
    }, 600);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(refreshTimer);
    };
  }, []);

  const scrollToLens = (idx: number) => {
    setActiveLensIdx(idx);
    setSubBatchIdx(0);
    activeLensIdxRef.current = idx;
    subBatchIdxRef.current = 0;
    if (trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const trackTop = rect.top + scrollTop;
      const trackHeight = trackRef.current.offsetHeight - window.innerHeight;
      const targetScroll = trackTop + (idx / SLIDER_CONFIG.length) * trackHeight + 20;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  const currentLens = SLIDER_CONFIG[activeLensIdx] || SLIDER_CONFIG[0];
  
  // Slice images for current sub-batch so all 56 photos cycle through
  const startImgIdx = (subBatchIdx * 8) % Math.max(1, currentLens.images.length);
  const currentImages = Array.from({ length: 8 }, (_, i) => {
    const imgIdx = (startImgIdx + i) % currentLens.images.length;
    return currentLens.images[imgIdx];
  });

  // Filtered images for 56-photo darkroom directory
  const filteredArchivePhotos =
    archiveFilter === "ALL"
      ? ALL_56_PHOTOS
      : ALL_56_PHOTOS.filter((img) => img.zoom === archiveFilter);

  return (
    <div ref={sectionRef} className="relative bg-black text-white selection:bg-white selection:text-black">
      {/* 1. PINNED STICKY VIEWPORT CONTAINER (h-[360vh]) */}
      <div ref={trackRef} className="relative h-[360vh]">
        <div className="sticky top-0 h-screen bg-black flex flex-col justify-between p-4 md:p-8 overflow-hidden border-t border-neutral-900 z-10">
          
          {/* STUDIO FREIGHT HEADER BAR WITH FOCAL LENGTH SWITCHER */}
          <div className="w-full flex justify-between items-center font-mono text-[11px] text-neutral-400 z-30 px-2 gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-bold text-white tracking-widest uppercase hidden sm:inline">SIA.COM • OPTICAL ARCHIVE</span>
              <span className="font-bold text-white tracking-widest uppercase sm:hidden">OPTICAL ARCHIVE</span>
            </div>

            {/* FOCAL LENGTH SELECTOR HUD (0.5X | 1X | 3X | 10X) */}
            <div className="flex items-center gap-1 bg-neutral-950/90 backdrop-blur-md p-1 rounded-full border border-neutral-800 shadow-xl">
              {SLIDER_CONFIG.map((lens, idx) => {
                const isActive = activeLensIdx === idx;
                return (
                  <button
                    key={lens.zoom}
                    onClick={() => scrollToLens(idx)}
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? "bg-white text-black font-bold shadow-md scale-105"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                    <span>{lens.zoom.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-6 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold shrink-0">
              <span>{ALL_56_PHOTOS.length} ARCHIVAL CAPTURES</span>
            </div>
          </div>

          {/* ASYMMETRICAL UNEVEN PHOTO MATRIX WITH CENTERED UNCONTAINED TEXT */}
          <div className="flex-1 my-2 flex items-center justify-center max-w-7xl mx-auto w-full relative overflow-hidden">
            
            {/* CENTER STAGE: DYNAMIC LENS TITLE ELEVATED TO Z-50 ABOVE ALL PHOTO CARDS */}
            <div className="absolute z-50 flex flex-col items-center justify-center text-center px-4 py-3 max-w-[200px] sm:max-w-md md:max-w-2xl pointer-events-none mx-auto">
              <AnimatePresence>
                <motion.h2
                  key={currentLens.zoom}
                  initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="text-2xl sm:text-4xl md:text-6xl font-serif font-light text-white tracking-tight leading-tight drop-shadow-[0_8px_32px_rgba(0,0,0,1)] w-full text-center"
                >
                  {currentLens.name}
                </motion.h2>
              </AnimatePresence>

              <p className="text-[10px] sm:text-[11px] md:text-xs font-mono text-neutral-300 mt-2 leading-relaxed max-w-[180px] sm:max-w-sm md:max-w-lg drop-shadow-[0_4px_16px_rgba(0,0,0,1)] bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                {currentLens.desc} ({currentLens.images.length} Captures)
              </p>
            </div>

            {/* ASYMMETRICAL SURROUNDING PHOTO CLUSTERS WITH OPTICAL WARP ZOOM TRANSITION */}
            <AnimatePresence>
              <motion.div
                key={`${currentLens.zoom}-${subBatchIdx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 w-full h-full p-2 grid grid-cols-12 grid-rows-12 gap-2.5 md:gap-3 pointer-events-none"
              >
                {/* Slot 1: TOP LEFT */}
                <motion.div
                  initial={{ opacity: 0, scale: 1.08, rotate: -1.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.02 }}
                  onClick={() => setSelectedImage(currentImages[0])}
                  className={`${
                    currentImages[0].aspect === "16/9" ? "col-span-5 row-span-2 aspect-[16/9] -ml-1 -mt-1 z-20" : "col-span-3 row-span-4 aspect-[9/16]"
                  } bg-neutral-950/90 border border-neutral-800/90 rounded-xl overflow-hidden pointer-events-auto cursor-pointer relative group shadow-2xl transition-all hover:z-40 hover:border-neutral-500 will-change-transform`}
                >
                  <Image 
                    src={currentImages[0].src} 
                    alt={currentImages[0].name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                    <span className="text-[10px] font-bold text-white truncate">{currentImages[0].name}</span>
                    <span className="text-[8px] font-mono text-neutral-400">{currentImages[0].iso} ISO • {currentImages[0].aperture}</span>
                  </div>
                </motion.div>

                {/* Slot 2: TOP MID-LEFT OVERLAP */}
                <motion.div
                  initial={{ opacity: 0, scale: 1.08, rotate: 1.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
                  onClick={() => setSelectedImage(currentImages[1])}
                  className={`${
                    currentImages[1].aspect === "16/9" ? "col-span-5 row-span-2 aspect-[16/9] col-start-4 row-start-1 -ml-2 z-30" : "col-span-2 row-span-4 aspect-[9/16] col-start-4 row-start-1"
                  } bg-neutral-950/90 border border-neutral-800/90 rounded-xl overflow-hidden pointer-events-auto cursor-pointer relative group shadow-2xl transition-all hover:z-40 hover:border-neutral-500 will-change-transform`}
                >
                  <Image 
                    src={currentImages[1].src} 
                    alt={currentImages[1].name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </motion.div>

                {/* Slot 3: TOP RIGHT */}
                <motion.div
                  initial={{ opacity: 0, scale: 1.08, rotate: -1.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
                  onClick={() => setSelectedImage(currentImages[2])}
                  className={`${
                    currentImages[2].aspect === "16/9" ? "col-span-4 row-span-2 aspect-[16/9] col-start-9 row-start-1 z-10" : "col-span-2 row-span-4 aspect-[9/16] col-start-11 row-start-1"
                  } bg-neutral-950/90 border border-neutral-800/90 rounded-xl overflow-hidden pointer-events-auto cursor-pointer relative group shadow-2xl transition-all hover:z-40 hover:border-neutral-500 will-change-transform`}
                >
                  <Image 
                    src={currentImages[2].src} 
                    alt={currentImages[2].name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </motion.div>

                {/* Slot 4: MID RIGHT OVERLAP */}
                <motion.div
                  initial={{ opacity: 0, scale: 1.08, rotate: 1.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                  onClick={() => setSelectedImage(currentImages[3])}
                  className={`${
                    currentImages[3].aspect === "16/9" ? "col-span-5 row-span-2 aspect-[16/9] col-start-8 row-start-3 z-30 -mt-1" : "col-span-3 row-span-4 aspect-[9/16] col-start-9 row-start-3"
                  } bg-neutral-950/90 border border-neutral-800/90 rounded-xl overflow-hidden pointer-events-auto cursor-pointer relative group shadow-2xl transition-all hover:z-40 hover:border-neutral-500 will-change-transform`}
                >
                  <Image 
                    src={currentImages[3].src} 
                    alt={currentImages[3].name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </motion.div>

                {/* Slot 5: MID LEFT OVERLAP */}
                <motion.div
                  initial={{ opacity: 0, scale: 1.08, rotate: -1.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  onClick={() => setSelectedImage(currentImages[4])}
                  className={`${
                    currentImages[4].aspect === "16/9" ? "col-span-5 row-span-2 aspect-[16/9] col-start-1 row-start-5 z-20" : "col-span-3 row-span-4 aspect-[9/16] col-start-1 row-start-5"
                  } bg-neutral-950/90 border border-neutral-800/90 rounded-xl overflow-hidden pointer-events-auto cursor-pointer relative group shadow-2xl transition-all hover:z-40 hover:border-neutral-500 will-change-transform`}
                >
                  <Image 
                    src={currentImages[4].src} 
                    alt={currentImages[4].name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </motion.div>

                {/* Slot 6: MID FAR-RIGHT */}
                <motion.div
                  initial={{ opacity: 0, scale: 1.08, rotate: 1.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
                  onClick={() => setSelectedImage(currentImages[5])}
                  className={`${
                    currentImages[5].aspect === "16/9" ? "col-span-4 row-span-2 aspect-[16/9] col-start-9 row-start-5 z-10 -ml-2" : "col-span-2 row-span-4 aspect-[9/16] col-start-11 row-start-5"
                  } bg-neutral-950/90 border border-neutral-800/90 rounded-xl overflow-hidden pointer-events-auto cursor-pointer relative group shadow-2xl transition-all hover:z-40 hover:border-neutral-500 will-change-transform`}
                >
                  <Image 
                    src={currentImages[5].src} 
                    alt={currentImages[5].name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </motion.div>

                {/* Slot 7: BOTTOM LEFT */}
                <motion.div
                  initial={{ opacity: 0, scale: 1.08, rotate: -1.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.14 }}
                  onClick={() => setSelectedImage(currentImages[6])}
                  className={`${
                    currentImages[6].aspect === "16/9" ? "col-span-4 row-span-2 aspect-[16/9] col-start-1 row-start-9 z-10" : "col-span-2 row-span-4 aspect-[9/16] col-start-1 row-start-9"
                  } bg-neutral-950/90 border border-neutral-800/90 rounded-xl overflow-hidden pointer-events-auto cursor-pointer relative group shadow-2xl transition-all hover:z-40 hover:border-neutral-500 will-change-transform`}
                >
                  <Image 
                    src={currentImages[6].src} 
                    alt={currentImages[6].name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </motion.div>

                {/* Slot 8: BOTTOM MID-LEFT OVERLAP */}
                <motion.div
                  initial={{ opacity: 0, scale: 1.08, rotate: 1.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
                  onClick={() => setSelectedImage(currentImages[7])}
                  className={`${
                    currentImages[7].aspect === "16/9" ? "col-span-5 row-span-2 aspect-[16/9] col-start-4 row-start-9 z-30 -ml-2" : "col-span-3 row-span-4 aspect-[9/16] col-start-3 row-start-9"
                  } bg-neutral-950/90 border border-neutral-800/90 rounded-xl overflow-hidden pointer-events-auto cursor-pointer relative group shadow-2xl transition-all hover:z-40 hover:border-neutral-500 will-change-transform`}
                >
                  <Image 
                    src={currentImages[7].src} 
                    alt={currentImages[7].name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </motion.div>

                {/* Slot 9: BOTTOM MID-RIGHT OVERLAP */}
                <motion.div
                  initial={{ opacity: 0, scale: 1.08, rotate: -1.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
                  onClick={() => setSelectedImage(currentImages[0])}
                  className={`${
                    currentImages[0].aspect === "16/9" ? "col-span-5 row-span-2 aspect-[16/9] col-start-7 row-start-9 z-10" : "col-span-3 row-span-4 aspect-[9/16] col-start-7 row-start-9"
                  } bg-neutral-950/90 border border-neutral-800/90 rounded-xl overflow-hidden pointer-events-auto cursor-pointer relative group shadow-2xl transition-all hover:z-40 hover:border-neutral-500 will-change-transform`}
                >
                  <Image 
                    src={currentImages[0].src} 
                    alt={currentImages[0].name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </motion.div>

                {/* Slot 10: BOTTOM RIGHT OVERLAP */}
                <motion.div
                  initial={{ opacity: 0, scale: 1.08, rotate: 1.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  onClick={() => setSelectedImage(currentImages[1])}
                  className={`${
                    currentImages[1].aspect === "16/9" ? "col-span-4 row-span-2 aspect-[16/9] col-start-9 row-start-9 z-20 -ml-2" : "col-span-3 row-span-4 aspect-[9/16] col-start-10 row-start-9"
                  } bg-neutral-950/90 border border-neutral-800/90 rounded-xl overflow-hidden pointer-events-auto cursor-pointer relative group shadow-2xl transition-all hover:z-40 hover:border-neutral-500 will-change-transform`}
                >
                  <Image 
                    src={currentImages[1].src} 
                    alt={currentImages[1].name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </motion.div>

              </motion.div>
            </AnimatePresence>

          </div>

          {/* EDITORIAL FOOTER */}
          <div className="w-full flex justify-between items-center font-mono text-[10px] text-neutral-500 tracking-wider uppercase border-t border-neutral-900 pt-3 z-30 px-2">
            <div className="flex items-center gap-1.5">
              <a href="https://www.instagram.com/shaikh.visuals/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">IG</a>
              <span>/</span>
              <a href="https://www.linkedin.com/in/shaikh-iftkhar-986429197" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LI</a>
              <span>/</span>
              <a href="https://github.com/iftkhar00490" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GH</a>
            </div>
            <span>©2026 / Terms</span>
          </div>
        </div>
      </div>

      {/* 2. LIGHTBOX INSPECTION MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] bg-neutral-950 border border-neutral-850 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-neutral-900 flex justify-between items-center bg-black/60 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-white font-bold">{selectedImage.name}</span>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Photo Viewport */}
              <div className="relative w-full h-[60vh] bg-black flex items-center justify-center overflow-hidden">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Modal EXIF Telemetry Footer */}
              <div className="p-4 bg-neutral-950 border-t border-neutral-900 grid grid-cols-3 gap-2 font-mono text-[10px] text-center">
                <div className="bg-neutral-900/60 p-2 rounded-lg border border-neutral-850">
                  <span className="text-neutral-500 block">SENSITIVITY</span>
                  <span className="text-white font-bold">{selectedImage.iso} ISO</span>
                </div>
                <div className="bg-neutral-900/60 p-2 rounded-lg border border-neutral-850">
                  <span className="text-neutral-500 block">APERTURE</span>
                  <span className="text-white font-bold">{selectedImage.aperture}</span>
                </div>
                <div className="bg-neutral-900/60 p-2 rounded-lg border border-neutral-850">
                  <span className="text-neutral-500 block">SHUTTER</span>
                  <span className="text-white font-bold">{selectedImage.shutter}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
