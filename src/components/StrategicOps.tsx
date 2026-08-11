"use client";

import { motion } from "framer-motion";
import { Layers, Calendar, CreditCard, Shield, TrendingUp, Cpu } from "lucide-react";

interface CaseStudy {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  desc: string;
  url?: string;
  metrics: { label: string; value: string }[];
  visual: React.ReactNode;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "geoattendance-sharjah",
    tag: "Field Tracking // Regional Ops",
    title: "Geoattendance App (Sharjah)",
    subtitle: "Sapio Solutions Field Suite",
    desc: "Engineered GPS geofenced check-in, real-time route tracking, and offline sync for field teams in Sharjah. Integrated selfie verification and automated HR timesheet pipelines.",
    url: "https://sapiosolutions.ae/employee-tracking-app-in-sharjah/",
    metrics: [
      { label: "GPS Precision", value: "<5m" },
      { label: "Sync Latency", value: "<250ms" },
      { label: "Proxy Reduction", value: "99.4%" },
    ],
    visual: (
      <svg viewBox="0 0 100 40" className="w-full h-full text-neutral-500" fill="none" stroke="currentColor" strokeWidth="0.75">
        <rect x="5" y="5" width="40" height="30" rx="3" strokeDasharray="2 2" />
        <rect x="55" y="5" width="40" height="30" rx="3" />
        <path d="M 45 20 L 55 20" strokeWidth="1" />
        <circle cx="50" cy="20" r="2" fill="currentColor" />
        <text x="8" y="15" className="font-mono text-[5px]" fill="currentColor">GPS Node</text>
        <text x="58" y="15" className="font-mono text-[5px]" fill="currentColor">HR Sync</text>
      </svg>
    ),
  },
  {
    id: "scube-launch",
    tag: "Product Positioning // Go-To-Market",
    title: "SCube NFC Networking Card",
    subtitle: "Launch Architecture & Strategy",
    desc: "Coordinated digital value propositions, landing platforms, and enterprise onboarding UX for SCube digital contact assets. Mapped out encrypted B2B networking portals and token sharing schemes.",
    metrics: [
      { label: "B2B Onboarding", value: "0-friction" },
      { label: "Antenna Gain", value: "2.4 dBi" },
      { label: "Active Nodes", value: "12,000+" },
    ],
    visual: (
      <svg viewBox="0 0 100 40" className="w-full h-full text-neutral-500" fill="none" stroke="currentColor" strokeWidth="0.75">
        {/* NFC Card shape and antenna loop */}
        <rect x="25" y="4" width="50" height="32" rx="4" />
        <rect x="29" y="8" width="42" height="24" rx="2" strokeDasharray="1 1.5" />
        <circle cx="50" cy="20" r="4" strokeWidth="1" />
        <path d="M 47 20 L 53 20 M 50 17 L 50 23" />
      </svg>
    ),
  },
  {
    id: "sapio-solutions",
    tag: "Corporate Auditing // Outreach Ops",
    title: "Sapio Solutions Digital Audit",
    subtitle: "Ecosystem Strategy & Pipelines",
    desc: "Conducted exhaustive corporate digital footprint audits. Formulated automated outreach strategy operations, implementing programmatic CRM pipelines and cold-conversion templates.",
    metrics: [
      { label: "Campaign CTR", value: "5.82%" },
      { label: "Audit Nodes", value: "14 Touchpoints" },
      { label: "Lead Velocity", value: "+22.4%" },
    ],
    visual: (
      <svg viewBox="0 0 100 40" className="w-full h-full text-neutral-500" fill="none" stroke="currentColor" strokeWidth="0.75">
        {/* Trend chart representation */}
        <path d="M 10 32 L 30 22 L 50 28 L 70 14 L 90 8" strokeWidth="1.2" />
        <circle cx="90" cy="8" r="2" fill="currentColor" />
        <line x1="10" y1="35" x2="90" y2="35" strokeDasharray="2 2" />
        <line x1="10" y1="5" x2="10" y2="35" strokeDasharray="2 2" />
      </svg>
    ),
  },
];

export default function StrategicOps() {
  return (
    <section className="relative bg-neutral-950 text-neutral-300 py-20 px-6 md:px-16 overflow-hidden border-b border-neutral-900">
      {/* Dynamic Grid Background Accent */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" 
        style={{ maskImage: "radial-gradient(ellipse at center, black 70%, transparent 100%)" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HUD Subordinate Header Placeholder */}

        {/* Section Heading */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-sans font-light tracking-tight text-white">
            Strategic Ops & Branding
          </h2>
          <p className="mt-2 text-xs font-mono text-neutral-500 max-w-lg leading-relaxed">
            Case study summaries mapping high-density B2B operations, spatial conference logistics, and branding audit strategies.
          </p>
        </div>

        {/* Compact 3-Column High-Density Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CASE_STUDIES.map((study) => (
            <motion.a
              key={study.id}
              href={study.url || "#"}
              target={study.url ? "_blank" : "_self"}
              rel="noopener noreferrer"
              whileHover={{ y: -3, borderColor: "rgba(255, 255, 255, 0.2)" }}
              transition={{ duration: 0.2 }}
              className="bg-neutral-900/40 border border-neutral-900 p-5 rounded-xl flex flex-col justify-between group hover:bg-neutral-900/60 block cursor-pointer"
            >
              <div>
                {/* Meta details */}
                <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider mb-4 flex justify-between items-center">
                  <span>{study.tag}</span>
                  <span className="w-1.5 h-1.5 bg-neutral-800 rounded-full group-hover:bg-white transition-colors" />
                </div>

                <h3 className="text-base font-sans font-bold text-white mb-1 tracking-tight flex items-center justify-between">
                  <span>{study.title}</span>
                  {study.url && (
                    <span className="text-[9px] font-mono text-neutral-500 group-hover:text-white transition-colors">↗</span>
                  )}
                </h3>
                <h4 className="text-[10px] font-mono text-neutral-400 mb-3 uppercase tracking-wider">
                  {study.subtitle}
                </h4>
                <p className="text-[11px] font-mono text-neutral-500 leading-relaxed mb-6 font-light">
                  {study.desc}
                </p>
              </div>

              <div>
                {/* Inline SVG Visual */}
                <div className="h-16 w-full border border-neutral-900 bg-black/40 rounded-lg flex items-center justify-center p-2 mb-4 group-hover:border-neutral-800 transition-colors">
                  {study.visual}
                </div>

                {/* Technical metrics layout */}
                <div className="grid grid-cols-3 gap-2 border-t border-neutral-900/80 pt-4 font-mono text-[9px]">
                  {study.metrics.map((metric, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-neutral-600 uppercase tracking-tight">{metric.label}</span>
                      <span className="text-neutral-300 font-bold mt-0.5">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
