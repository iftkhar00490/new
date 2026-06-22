"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sliders, Cpu, Activity, Compass, Shield, Zap } from "lucide-react";

type TabType = "VISION" | "LOGIC" | "ROADMAP";

export default function AutomotiveCore() {
  const [activeTab, setActiveTab] = useState<TabType>("VISION");
  const [speed, setSpeed] = useState(124);
  const [rpm, setRpm] = useState(7200);
  const [tractionControl, setTractionControl] = useState(4);
  const [brakeBias, setBrakeBias] = useState(54); // 54% Front
  
  // Real-time micro-fluctuations in telemetry data to simulate active engine feed
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const target = prev + delta;
        return target >= 120 && target <= 128 ? target : prev;
      });
      setRpm((prev) => {
        const delta = Math.floor(Math.random() * 80) - 40;
        const target = prev + delta;
        return target >= 7100 && target <= 7350 ? target : prev;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden flex flex-col justify-center items-center py-20 px-6 md:px-16 border-b border-neutral-900 select-none">
      {/* Unbranded Supercar Cockpit Background Image */}
      <Image
        src="/images/cockpit.png"
        alt="Italian Supercar Cockpit"
        fill
        className="object-cover opacity-25 grayscale mix-blend-luminosity pointer-events-none"
        priority
      />

      {/* Futuristic Aluminum Bezel Cage Overlay */}
      <div className="absolute inset-0 pointer-events-none border-x-4 border-neutral-900/60 max-w-7xl mx-auto flex justify-between">
        <div className="w-px h-full bg-neutral-900/40" />
        <div className="w-px h-full bg-neutral-900/40" />
      </div>
      
      {/* HUD Bar Top */}
      <div className="w-full max-w-5xl flex justify-between items-center text-[9px] font-mono text-neutral-500 mb-8 z-10">
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-red-500" />
          <span>VEHICLE_BUS: CONNECTED [ CAN_ID: 0x7E8 ]</span>
        </div>
        <div>MOCK_TELEMETRY // ITALIAN_DYNAMICS_LAB</div>
      </div>

      {/* Main Infotainment Display Container */}
      <div className="w-full max-w-5xl bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 flex flex-col gap-6">
        
        {/* TOP PANEL: Live Engine Telemetry Block */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-neutral-800 pb-6">
          <div className="bg-neutral-900/50 border border-neutral-800 p-3 rounded-lg flex flex-col justify-between">
            <span className="text-[9px] font-mono text-neutral-500 uppercase">Speedometer</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-sans font-light tracking-tight text-white">{speed}</span>
              <span className="text-xs font-mono text-neutral-500">KM/H</span>
            </div>
            {/* Speed indicator bar */}
            <div className="w-full h-1 bg-neutral-800 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${(speed / 280) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 p-3 rounded-lg flex flex-col justify-between">
            <span className="text-[9px] font-mono text-neutral-500 uppercase">Tachometer</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-sans font-light tracking-tight text-white">{rpm}</span>
              <span className="text-xs font-mono text-neutral-500">RPM</span>
            </div>
            {/* RPM indicator bar */}
            <div className="w-full h-1 bg-neutral-800 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-red-600 transition-all duration-300"
                style={{ width: `${(rpm / 9000) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 p-3 rounded-lg flex flex-col justify-between">
            <span className="text-[9px] font-mono text-neutral-500 uppercase">Core Drive System</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-sans font-light tracking-tight text-red-500">M4</span>
              <span className="text-xs font-mono text-neutral-500">SEQUENTIAL</span>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 mt-1">✓ GEAR_LOCK_ACTIVE</span>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 p-3 rounded-lg flex flex-col justify-between">
            <span className="text-[9px] font-mono text-neutral-500 uppercase">Thermals & Health</span>
            <div className="flex justify-between items-center mt-2">
              <span className="text-lg font-sans text-neutral-300">Oil: 96°C</span>
              <span className="text-lg font-sans text-neutral-300">PSI: 2.4</span>
            </div>
            <span className="text-[9px] font-mono text-neutral-500 mt-1">COOLANT: NORMAL</span>
          </div>
        </div>

        {/* MIDDLE SECTION: Interactive Tabs & Content Panel */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Sub-navigation Controls (Tactile Dashboard Buttons) */}
          <div className="flex lg:flex-col gap-2.5 w-full lg:w-1/4">
            {(["VISION", "LOGIC", "ROADMAP"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3.5 px-4 rounded-xl font-mono text-xs text-left tracking-widest border transition-all duration-300 flex items-center justify-between hover:scale-[1.02] active:scale-95 ${
                  activeTab === tab
                    ? "bg-white text-black border-white font-bold"
                    : "bg-neutral-900/60 text-neutral-400 border-neutral-800/80 hover:text-white hover:border-neutral-700"
                }`}
              >
                <span>[ {tab} ]</span>
                <span className={`w-1.5 h-1.5 rounded-full ${activeTab === tab ? "bg-black" : "bg-neutral-600"}`} />
              </button>
            ))}

            {/* Tactile sliders in control panel */}
            <div className="hidden lg:flex flex-col gap-4 bg-neutral-900/30 border border-neutral-800/60 p-4 rounded-xl mt-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] uppercase">
                <Sliders className="w-3.5 h-3.5" />
                <span>Active Aerodynamics</span>
              </div>
              
              {/* Traction Control Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[9px] text-neutral-500">
                  <span>TC Sensitivity</span>
                  <span className="text-white font-bold">LVL {tractionControl}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={tractionControl}
                  onChange={(e) => setTractionControl(Number(e.target.value))}
                  className="w-full accent-white bg-neutral-800 h-1 rounded-lg cursor-pointer"
                />
              </div>

              {/* Brake Bias Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[9px] text-neutral-500">
                  <span>Brake Bias (F/R)</span>
                  <span className="text-white font-bold">{brakeBias}% Front</span>
                </div>
                <input
                  type="range"
                  min="48"
                  max="62"
                  value={brakeBias}
                  onChange={(e) => setBrakeBias(Number(e.target.value))}
                  className="w-full accent-white bg-neutral-800 h-1 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Tab Content Area */}
          <div className="flex-1 bg-neutral-900/30 border border-neutral-800/60 rounded-xl p-5 md:p-6 min-h-[300px] relative overflow-hidden flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col justify-between"
              >
                {activeTab === "VISION" && (
                  <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3 text-neutral-400 font-mono text-[10px]">
                        <Compass className="w-3.5 h-3.5 text-neutral-500" />
                        <span>METRICS // SYSTEM_DYNAMICS</span>
                      </div>
                      <h4 className="text-lg font-sans font-bold text-white mb-2">Automotive Telemetry & Telematics</h4>
                      <p className="text-xs font-mono text-neutral-400 leading-relaxed mb-4">
                        Investment in low-latency vehicle analytics, platform physics, and real-time suspension dynamics. Driving high-rate telemetry collection from inertial measurement units (IMUs) and suspension load cells to compute slip ratios and lateral G forces.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-neutral-400">
                        <div className="bg-black/40 p-2 border border-neutral-800 rounded">
                          <span className="text-neutral-500 block">LATERAL_G</span>
                          <span className="text-white font-bold">1.25 G</span>
                        </div>
                        <div className="bg-black/40 p-2 border border-neutral-800 rounded">
                          <span className="text-neutral-500 block">SLIP_ANGLE</span>
                          <span className="text-white font-bold">1.4°</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive G-Force Circle */}
                    <div className="w-full md:w-36 flex flex-col items-center gap-2">
                      <span className="text-[8px] font-mono text-neutral-500 uppercase">Vector G-Force Plot</span>
                      <div className="w-28 h-28 border border-neutral-800 rounded-full flex items-center justify-center relative bg-black/35">
                        <div className="absolute w-full h-px bg-neutral-800/50" />
                        <div className="absolute h-full w-px bg-neutral-800/50" />
                        <div className="w-16 h-16 border border-neutral-800/60 rounded-full absolute" />
                        <div className="w-8 h-8 border border-neutral-800/40 rounded-full absolute" />
                        {/* Interactive Dot representing vector drift */}
                        <motion.div 
                          className="w-2.5 h-2.5 bg-red-500 rounded-full absolute shadow-lg shadow-red-500/50"
                          animate={{ 
                            x: [10, -5, 20, -12, 10], 
                            y: [-15, 20, -5, -20, -15] 
                          }}
                          transition={{ 
                            duration: 5, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "LOGIC" && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-neutral-400 font-mono text-[10px]">
                      <Cpu className="w-3.5 h-3.5 text-neutral-500" />
                      <span>ARCH // EDGE_BUS_INTEGRATION</span>
                    </div>
                    <h4 className="text-lg font-sans font-bold text-white mb-2">CAN Bus & Pipeline Architecture</h4>
                    <p className="text-xs font-mono text-neutral-400 leading-relaxed mb-4">
                      The core telemetry stack operates directly on the vehicle’s Controller Area Network (CAN) bus. Under the hood, an edge node (NVIDIA Jetson) intercepts OBD-II data and IMU measurements at 100Hz. This data is filtered, formatted as lightweight binary payloads, and broadcasted over a WebSocket tunnel back to our analytics canvas.
                    </p>

                    {/* SVG Flow Diagram */}
                    <div className="w-full border border-neutral-800 bg-black/40 rounded p-3 text-neutral-400">
                      <svg viewBox="0 0 400 60" className="w-full h-full font-mono text-[8px]" fill="none" stroke="currentColor">
                        {/* Nodes */}
                        <rect x="10" y="15" width="60" height="30" rx="4" fill="#0c0c0c" stroke="#333" />
                        <text x="22" y="33" fill="#fff">CAN Bus</text>

                        <path d="M 70 30 L 110 30" stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />

                        <rect x="110" y="15" width="80" height="30" rx="4" fill="#0c0c0c" stroke="#333" />
                        <text x="120" y="33" fill="#fff">Edge Node (Jetson)</text>

                        <path d="M 190 30 L 230 30" stroke="#fff" strokeWidth="1" />

                        <rect x="230" y="15" width="70" height="30" rx="4" fill="#0c0c0c" stroke="#333" />
                        <text x="238" y="33" fill="#fff">Binary Frame</text>

                        <path d="M 300 30 L 330 30" stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />

                        <rect x="330" y="15" width="60" height="30" rx="4" fill="#0c0c0c" stroke="#ff4444" />
                        <text x="345" y="33" fill="#ff4444">Telemetry</text>
                      </svg>
                    </div>
                  </div>
                )}

                {activeTab === "ROADMAP" && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-neutral-400 font-mono text-[10px]">
                      <Activity className="w-3.5 h-3.5 text-neutral-500" />
                      <span>ROADMAP // EDGE_DEPLOYS</span>
                    </div>
                    <h4 className="text-lg font-sans font-bold text-white mb-2">ECU Edge ML Integration</h4>
                    <p className="text-xs font-mono text-neutral-400 leading-relaxed mb-4">
                      Deploying localized Machine Learning models directly into automotive ECUs. By analyzing thermals, fluid compression profiles, and vibrational dynamics, our models execute real-time predictive wear analysis. This provides driver warnings for clutch slippage, tire degradation, and brake pad decay before hardware failures occur.
                    </p>

                    {/* Timeline */}
                    <div className="flex flex-col gap-3 font-mono text-[10px]">
                      <div className="flex items-start gap-4">
                        <span className="text-red-500 font-bold whitespace-nowrap">PHASE 1 (Q3 2026)</span>
                        <span className="text-neutral-300">OBD-II telemetry logging tunnel and low-latency cloud synchronization</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <span className="text-neutral-500 whitespace-nowrap">PHASE 2 (Q4 2026)</span>
                        <span className="text-neutral-400">Localized Isolation Forest model on Jetson for telemetry anomaly flags</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <span className="text-neutral-500 whitespace-nowrap">PHASE 3 (Q1 2027)</span>
                        <span className="text-neutral-400">Direct integration of lightweight neural models for brake wear prediction</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Bottom mini status */}
            <div className="border-t border-neutral-800/80 pt-4 mt-6 flex justify-between items-center text-[8px] font-mono text-neutral-500">
              <div className="flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-neutral-500" />
                <span>INTEGRITY_SHIELD: ACTIVE [ SEC_LEVEL_3 ]</span>
              </div>
              <span>ACTIVE_SCREEN: {activeTab}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
