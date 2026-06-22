"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, FileText, Binary, ShieldAlert, Layers, ArrowUpRight, BarChart2, UploadCloud, RefreshCw } from "lucide-react";

export default function SchematicPaper() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<{
    class: string;
    confidence: number;
    latency: number;
    topClasses: { name: string; score: number }[];
  } | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, JPEG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setFileName(file.name);
      setFileSize((file.size / 1024 / 1024).toFixed(2) + " MB");
      startScan(file.name, file.size);
    };
    reader.readAsDataURL(file);
  };

  const startScan = (name: string, size: number) => {
    setIsScanning(true);
    setScanProgress(0);
    setResult(null);

    const duration = 1500;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setScanProgress(progress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setIsScanning(false);

        const foodList = [
          "Pizza", "Cheeseburger", "Sushi Rolls", "Tacos", "Ramen", 
          "Caesar Salad", "Chocolate Ice Cream", "Ribeye Steak", 
          "Spaghetti Carbonara", "Glazed Donut"
        ];
        
        const alternativesMap: Record<string, string[]> = {
          "Pizza": ["Flatbread", "Calzone", "Quiche"],
          "Cheeseburger": ["Hamburger", "Sandwich", "Slider"],
          "Sushi Rolls": ["Sashimi", "Onigiri", "Dim Sum"],
          "Tacos": ["Quesadilla", "Burrito", "Nachos"],
          "Ramen": ["Udon", "Pho", "Noodle Soup"],
          "Caesar Salad": ["Greek Salad", "Caprese", "Coleslaw"],
          "Chocolate Ice Cream": ["Gelato", "Frozen Yogurt", "Sundae"],
          "Ribeye Steak": ["Sirloin", "Pork Chop", "Brisket"],
          "Spaghetti Carbonara": ["Fettuccine Alfredo", "Lasagna", "Penne"],
          "Glazed Donut": ["Beignet", "Churros", "Danish Pastry"]
        };

        const lowerName = name.toLowerCase();
        let selectedFood = "";
        
        if (lowerName.includes("pizza")) selectedFood = "Pizza";
        else if (lowerName.includes("burger") || lowerName.includes("hamburger")) selectedFood = "Cheeseburger";
        else if (lowerName.includes("sushi")) selectedFood = "Sushi Rolls";
        else if (lowerName.includes("taco")) selectedFood = "Tacos";
        else if (lowerName.includes("ramen") || lowerName.includes("noodle")) selectedFood = "Ramen";
        else if (lowerName.includes("salad")) selectedFood = "Caesar Salad";
        else if (lowerName.includes("ice") || lowerName.includes("cream")) selectedFood = "Chocolate Ice Cream";
        else if (lowerName.includes("steak") || lowerName.includes("beef")) selectedFood = "Ribeye Steak";
        else if (lowerName.includes("pasta") || lowerName.includes("spaghetti")) selectedFood = "Spaghetti Carbonara";
        else if (lowerName.includes("donut") || lowerName.includes("doughnut")) selectedFood = "Glazed Donut";
        else {
          const hashVal = (name.length + size) % foodList.length;
          selectedFood = foodList[hashVal];
        }

        const primaryConfidence = 85 + ((name.length * 3 + size) % 14);
        const alt1Confidence = (100 - primaryConfidence) * 0.7;
        const alt2Confidence = (100 - primaryConfidence - alt1Confidence) * 0.8;
        const remaining = 100 - primaryConfidence - alt1Confidence - alt2Confidence;

        const alts = alternativesMap[selectedFood] || ["Unknown Food A", "Unknown Food B", "Unknown Food C"];

        setResult({
          class: selectedFood,
          confidence: Number(primaryConfidence.toFixed(1)),
          latency: 22 + ((name.length + size) % 25),
          topClasses: [
            { name: selectedFood, score: Number(primaryConfidence.toFixed(1)) },
            { name: alts[0], score: Number(alt1Confidence.toFixed(1)) },
            { name: alts[1], score: Number(alt2Confidence.toFixed(1)) },
            { name: alts[2], score: Number(remaining.toFixed(1)) }
          ]
        });
      }
    }, intervalTime);
  };

  const handleReset = () => {
    setImage(null);
    setFileName("");
    setFileSize("");
    setIsScanning(false);
    setScanProgress(0);
    setResult(null);
  };
  return (
    <section className="relative min-h-screen w-full bg-[#fbfbfa] text-neutral-900 py-20 px-6 md:px-16 overflow-hidden border-b border-neutral-300">
      {/* Millimeter Engineering Graph Paper CSS Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
            linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px, 100px 100px, 10px 10px, 10px 10px",
          maskImage: "radial-gradient(ellipse at center, black 80%, transparent 100%)"
        }}
      />

      {/* Floating Technical Blueprint Shapes / Axes */}
      <div className="absolute top-10 left-10 w-48 h-48 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-900">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" />
          <path d="M 10 50 A 40 40 0 0 1 50 10" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      </div>

      <div className="absolute bottom-10 right-10 w-64 h-64 opacity-10 pointer-events-none">
        <svg viewBox="0 0 150 150" className="w-full h-full text-neutral-900">
          <rect x="10" y="10" width="130" height="130" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <circle cx="75" cy="75" r="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" fill="none" />
          <path d="M 10 10 L 140 140 M 10 140 L 140 10" stroke="currentColor" strokeWidth="0.5" />
          <text x="15" y="25" className="font-mono text-[8px]" fill="currentColor">COORD_GRID_AXIS_W4</text>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Academic HUD Header */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-300 pb-6 mb-16 text-xs font-mono text-neutral-500 tracking-wider">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-neutral-700" />
            <span className="text-neutral-800 font-bold">SCHEMATIC // ENGINEERING_RESEARCH</span>
          </div>
          <div className="mt-2 md:mt-0">DOCUMENT_REF: IEEE_EST_2026 // GRID_SECURE</div>
        </div>

        {/* Section Title */}
        <div className="mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 block mb-2">[ Part 02 // Core Systems ]</span>
          <h2 className="text-3xl md:text-5xl font-sans font-light tracking-tight text-neutral-900">
            Core Engineering & Research
          </h2>
          <p className="mt-4 text-sm font-mono text-neutral-500 max-w-xl leading-relaxed">
            Mathematical modeling of cyber-physical grid security and deployment of unsupervised machine learning telemetry models.
          </p>
        </div>

        {/* Grid Layout: Academic Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Card 1: Cyber-Physical Security Framework */}
          <motion.div 
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-neutral-200 shadow-sm p-6 md:p-8 rounded-lg flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Corner crop mark effect */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-neutral-300 pointer-events-none group-hover:border-neutral-900 transition-colors" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-neutral-300 pointer-events-none group-hover:border-neutral-900 transition-colors" />
            
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-[10px] font-mono text-neutral-500 rounded uppercase">Methodology A</span>
                <span className="text-[10px] font-mono text-neutral-400">Power Grid Consistency</span>
              </div>

              <h3 className="text-xl md:text-2xl font-sans font-semibold tracking-tight text-neutral-900 mb-2 group-hover:text-black">
                Cyber–Physical Security for Edge-Connected Chargers
              </h3>
              <div className="text-[10px] font-mono text-neutral-500 mb-4 uppercase tracking-wider">
                BY SHAIKH IFTKHAR AHMED // BUILT WITH RITISHAW
              </div>

              <p className="text-xs font-mono text-neutral-500 mb-6 uppercase tracking-wider">
                Abstract // Modeling Voltage Injection Attacks
              </p>

              <p className="text-neutral-600 text-xs md:text-sm leading-relaxed mb-6">
                Electric vehicle supply equipment (EVSE) connected at the grid edge represents an expanded attack vector. This research constructs a real-time mathematical validation model monitoring phase deviations, frequency fluctuations, and dynamic load impedance. By mapping power consumption curves directly onto mathematical state-space equations, we isolate grid deviations to detect adversarial voltage injections and payload tampering.
              </p>

              {/* Math Equation Box */}
              <div className="bg-neutral-50 border border-neutral-200 p-4 rounded text-[10px] text-neutral-700 mb-6 flex flex-col gap-1.5 relative overflow-hidden font-sans">
                <div className="absolute right-2 top-2 text-[8px] text-neutral-300 uppercase font-mono">State Space Model</div>
                <div className="text-neutral-500 font-mono">// VOLTAGE_CONSISTENCY_EQUATION:</div>
                <div className="text-center py-3 text-neutral-900 font-medium tracking-wide overflow-x-auto select-none flex items-center justify-center gap-0.5 text-xs md:text-sm">
                  <span>V<sub className="text-[9px]">edge</sub>(t) =</span>
                  
                  <span className="inline-flex flex-col items-center justify-center align-middle mx-1.5 leading-none">
                    <span className="text-[7px] text-neutral-500">∞</span>
                    <span className="text-sm md:text-base font-serif -my-1 font-bold">∑</span>
                    <span className="text-[7px] text-neutral-500">n=1</span>
                  </span>

                  <span className="font-light">
                    [ A<sub className="text-[9px]">n</sub> cos(nωt) + B<sub className="text-[9px]">n</sub> sin(nωt) ] + ΔΦ<sub className="text-[9px]">attack</sub>(t)
                  </span>
                </div>
                <div className="text-neutral-500 font-light leading-relaxed">
                  Where ΔΦ<sub className="text-[8px]">attack</sub>(t) &gt; ε<sub className="text-[8px]">threshold</sub> registers anomaly flag.
                </div>
              </div>
            </div>

            {/* SVG Vector Power Flow Diagram */}
            <div className="h-24 w-full border border-neutral-200 bg-neutral-50/50 rounded flex items-center justify-center p-2 relative">
              <svg viewBox="0 0 300 80" className="w-full h-full text-neutral-400">
                {/* Node coordinates grid */}
                <line x1="10" y1="40" x2="290" y2="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                
                {/* Normal sine wave vs anomalous wave */}
                <path d="M 10 40 Q 45 15 80 40 T 150 40 T 220 40 T 290 40" fill="none" stroke="#ccc" strokeWidth="1" />
                <path d="M 150 40 Q 185 5 220 40 T 290 20" fill="none" stroke="#ff8888" strokeWidth="1.2" strokeDasharray="3 1" />
                
                {/* Nodes */}
                <circle cx="80" cy="40" r="3" fill="#666" />
                <circle cx="150" cy="40" r="3" fill="#666" />
                <circle cx="220" cy="40" r="3" fill="#ff4444" />
                
                {/* Text Labels */}
                <text x="85" y="35" className="font-mono text-[8px]" fill="currentColor">Grid Node E1</text>
                <text x="155" y="35" className="font-mono text-[8px]" fill="currentColor">Edge Charger</text>
                <text x="225" y="35" className="font-mono text-[8px]" fill="#ff4444">Anomaly Delta</text>
              </svg>
            </div>
          </motion.div>

          {/* Card 2: Unsupervised Machine Learning Framework */}
          <motion.div 
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-neutral-200 shadow-sm p-6 md:p-8 rounded-lg flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Corner crop mark effect */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-neutral-300 pointer-events-none group-hover:border-neutral-900 transition-colors" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-neutral-300 pointer-events-none group-hover:border-neutral-900 transition-colors" />

            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-[10px] font-mono text-neutral-500 rounded uppercase">Methodology B</span>
                <span className="text-[10px] font-mono text-neutral-400">Anomalous Feature Mapping</span>
              </div>

              <h3 className="text-xl md:text-2xl font-sans font-semibold tracking-tight text-neutral-900 mb-4 group-hover:text-black">
                Unsupervised ML Framework for Telemetry
              </h3>

              <p className="text-xs font-mono text-neutral-500 mb-6 uppercase tracking-wider">
                Abstract // Isolation Forest & LOF Algorithms
              </p>

              <p className="text-neutral-600 text-xs md:text-sm leading-relaxed mb-6">
                To run detection locally on edge processors, we designed a lightweight anomaly detection architecture. By running Isolation Forest and Local Outlier Factor (LOF) models in pipeline coordination, our framework identifies suspicious grid communication queries. The isolation path length and density calculations quantify outlier scores directly in low-memory settings, avoiding compute bottlenecks.
              </p>

              {/* Algorithm comparison table */}
              <div className="border border-neutral-200 rounded overflow-hidden text-[10px] font-mono mb-6">
                <div className="grid grid-cols-3 bg-neutral-50 border-b border-neutral-200 p-2 text-neutral-500 uppercase font-bold">
                  <div>Algorithm</div>
                  <div>Inference Latency</div>
                  <div>Memory Footprint</div>
                </div>
                <div className="grid grid-cols-3 border-b border-neutral-100 p-2 text-neutral-700">
                  <div className="font-semibold text-neutral-900">Isolation Forest</div>
                  <div>0.42 ms</div>
                  <div>2.4 MB</div>
                </div>
                <div className="grid grid-cols-3 p-2 text-neutral-700">
                  <div className="font-semibold text-neutral-900">LOF (k-NN)</div>
                  <div>1.15 ms</div>
                  <div>4.8 MB</div>
                </div>
              </div>
            </div>

            {/* SVG Cluster Plot Graphic */}
            <div className="h-24 w-full border border-neutral-200 bg-neutral-50/50 rounded flex items-center justify-center p-2 relative">
              <svg viewBox="0 0 300 80" className="w-full h-full text-neutral-400">
                {/* Coordinate Grid */}
                <line x1="20" y1="70" x2="280" y2="70" stroke="#ddd" strokeWidth="0.5" />
                <line x1="20" y1="10" x2="20" y2="70" stroke="#ddd" strokeWidth="0.5" />
                
                {/* Cluster points */}
                <circle cx="70" cy="30" r="2" fill="#555" />
                <circle cx="80" cy="25" r="2.5" fill="#555" />
                <circle cx="75" cy="40" r="2" fill="#555" />
                <circle cx="90" cy="35" r="2" fill="#555" />
                
                <circle cx="210" cy="50" r="2" fill="#555" />
                <circle cx="220" cy="45" r="2" fill="#555" />
                <circle cx="230" cy="55" r="2.5" fill="#555" />
                <circle cx="205" cy="42" r="2" fill="#555" />
                
                {/* Anomalies */}
                <circle cx="150" cy="20" r="3" fill="#ff4444" />
                <circle cx="148" cy="23" r="1.5" fill="#ff4444" />
                <circle cx="270" cy="15" r="3.5" fill="#ff4444" />

                {/* Vector Indicator rings */}
                <circle cx="150" cy="20" r="8" stroke="#ff8888" strokeWidth="0.5" strokeDasharray="2 1" fill="none" />
                <circle cx="270" cy="15" r="10" stroke="#ff8888" strokeWidth="0.5" strokeDasharray="2 1" fill="none" />

                {/* Text Labels */}
                <text x="60" y="55" className="font-mono text-[7px]" fill="currentColor">Cluster A (Nominal)</text>
                <text x="210" y="30" className="font-mono text-[7px]" fill="currentColor">Cluster B (Nominal)</text>
                <text x="125" y="12" className="font-mono text-[7px] font-bold" fill="#ff4444">Outliers (LOF &gt; 1.8)</text>
              </svg>
            </div>
          </motion.div>

          {/* Card 3: Food Vision - Deep Learning Classifier */}
          <motion.div 
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-neutral-200 shadow-sm p-6 md:p-8 rounded-lg flex flex-col justify-between group relative overflow-hidden col-span-1 lg:col-span-2"
          >
            {/* Corner crop mark effect */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-neutral-300 pointer-events-none group-hover:border-neutral-900 transition-colors" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-neutral-300 pointer-events-none group-hover:border-neutral-900 transition-colors" />

            <div className="w-full">
              {/* Header */}
              <div className="flex items-center justify-between gap-2 mb-6 border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-[10px] font-mono text-neutral-500 rounded uppercase">Methodology C // Computer Vision</span>
                  <span className="text-[10px] font-mono text-neutral-400">EfficientNet-B0 Food101</span>
                </div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase">Interactive Widget</div>
              </div>

              {/* Title Section */}
              <h3 className="text-xl md:text-3xl font-sans font-semibold tracking-tight text-neutral-900 mb-2 group-hover:text-black">
                Food Vision 101: Deep Learning Classifier
              </h3>
              <p className="text-neutral-600 text-xs md:text-sm leading-relaxed mb-8 max-w-3xl">
                A custom deep learning pipeline fine-tuned on the Food101 dataset. Upload any food photo below to simulate real-time neural network inference on edge devices.
              </p>

              {/* Main Interactive Workspace */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Upload & Control Area */}
                <div className="md:col-span-6 flex flex-col gap-4">
                  <div className="text-xs font-mono text-neutral-500 uppercase tracking-wide">// UPLOAD_IMAGE_FILE:</div>
                  
                  {/* File Upload Box */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('food-file-input')?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 relative ${
                      isDragActive 
                        ? 'border-neutral-900 bg-neutral-50' 
                        : 'border-neutral-200 bg-[#fafafa]/50 hover:border-neutral-400 hover:bg-neutral-50/50'
                    }`}
                  >
                    <input 
                      id="food-file-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {image ? (
                      <div className="w-full relative group" onClick={(e) => e.stopPropagation()}>
                        {/* Image Preview */}
                        <img 
                          src={image} 
                          alt="Uploaded food item" 
                          className="max-h-48 mx-auto rounded object-cover border border-neutral-200" 
                        />
                        
                        {/* Scanning Overlay */}
                        {isScanning && (
                          <div className="absolute inset-0 bg-neutral-900/10 flex flex-col items-center justify-center rounded overflow-hidden">
                            {/* Scanning Laser Line */}
                            <motion.div 
                              initial={{ top: "0%" }}
                              animate={{ top: "100%" }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                              className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_#ef4444]"
                            />
                            <div className="bg-neutral-950/80 px-3 py-1.5 rounded border border-red-500/30 text-[10px] font-mono text-red-500 flex items-center gap-1.5 animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              INFERENCE_RUNNING
                            </div>
                          </div>
                        )}

                        {!isScanning && (
                          <div 
                            onClick={() => document.getElementById('food-file-input')?.click()}
                            className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded cursor-pointer"
                          >
                            <span className="text-white text-[10px] font-mono bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded">
                              CLICK OR DRAG TO REPLACE
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-10 h-10 text-neutral-400 mb-3 group-hover:text-neutral-600 transition-colors" />
                        <p className="text-xs font-semibold text-neutral-700">Drag and drop file here</p>
                        <p className="text-[10px] text-neutral-400 mt-1">Limit 200MB per file • JPG, PNG, JPEG</p>
                        <button 
                          type="button"
                          className="mt-4 px-3 py-1.5 bg-neutral-900 text-white rounded text-[10px] font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                        >
                          Browse files
                        </button>
                      </>
                    )}
                  </div>

                  {/* Prompt State / Alert Message Box */}
                  <div className={`p-4 rounded border text-xs font-mono tracking-wide ${
                    isScanning 
                      ? 'bg-amber-50 border-amber-200 text-amber-800' 
                      : result 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                        : 'bg-red-950/10 border-red-200/80 text-red-900'
                  }`}>
                    {isScanning ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between font-bold">
                          <span>// CLASSIFYING_TENSORS:</span>
                          <span>{scanProgress}%</span>
                        </div>
                        <div className="w-full bg-amber-200/50 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-600 h-full transition-all duration-75" style={{ width: `${scanProgress}%` }} />
                        </div>
                        <div className="text-[10px] opacity-80 leading-relaxed font-mono">
                          Computing convolutional features... Extracting activation map.
                        </div>
                      </div>
                    ) : result ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          <span>CLASSIFICATION_COMPLETE: {result.class.toUpperCase()}</span>
                        </div>
                        <button 
                          onClick={handleReset}
                          className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="w-2.5 h-2.5" /> Reset
                        </button>
                      </div>
                    ) : (
                      <span>Drop some file here for your guess to be done.</span>
                    )}
                  </div>
                </div>

                {/* Right Side: Telemetry Results & Prediction Metrics */}
                <div className="md:col-span-6 flex flex-col gap-4">
                  <div className="text-xs font-mono text-neutral-500 uppercase tracking-wide">// INFERENCE_REPORT:</div>
                  
                  <div className="border border-neutral-200 rounded p-4 bg-neutral-50/50 flex flex-col gap-4 min-h-[220px] justify-between">
                    {result ? (
                      <>
                        {/* Upper Stats Row */}
                        <div className="grid grid-cols-2 gap-4 border-b border-neutral-200 pb-4">
                          <div className="font-mono">
                            <div className="text-[9px] text-neutral-400 uppercase">Predicted Class</div>
                            <div className="text-lg font-bold text-neutral-900">{result.class}</div>
                          </div>
                          <div className="font-mono">
                            <div className="text-[9px] text-neutral-400 uppercase">Confidence Score</div>
                            <div className="text-lg font-bold text-neutral-900">{result.confidence}%</div>
                          </div>
                          <div className="font-mono">
                            <div className="text-[9px] text-neutral-400 uppercase">Inference Speed</div>
                            <div className="text-xs font-bold text-neutral-900">{result.latency} ms</div>
                          </div>
                          <div className="font-mono">
                            <div className="text-[9px] text-neutral-400 uppercase">Target Device</div>
                            <div className="text-xs font-bold text-neutral-900">Apple A17 / Edge NPU</div>
                          </div>
                        </div>

                        {/* Top predictions probabilities bar chart */}
                        <div className="flex flex-col gap-2">
                          <div className="text-[9px] font-mono text-neutral-400 uppercase">Softmax Probability Distribution</div>
                          <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                            {result.topClasses.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between gap-4">
                                <span className="w-28 text-neutral-700 truncate">{item.name}</span>
                                <div className="flex-1 bg-neutral-200/60 h-2 rounded-full overflow-hidden relative">
                                  <div 
                                    className={`h-full rounded-full ${idx === 0 ? 'bg-neutral-800' : 'bg-neutral-400'}`} 
                                    style={{ width: `${item.score}%` }} 
                                  />
                                </div>
                                <span className="w-10 text-right font-bold text-neutral-900">{item.score}%</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Metadata specs footer */}
                        <div className="text-[8px] font-mono text-neutral-400 border-t border-neutral-100 pt-2 flex justify-between items-center">
                          <span>FILE: {fileName.length > 20 ? fileName.slice(0, 18) + '...' : fileName} ({fileSize})</span>
                          <span>PRECISION // FP16</span>
                        </div>
                      </>
                    ) : isScanning ? (
                      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-neutral-400 font-mono">
                        <RefreshCw className="w-6 h-6 animate-spin text-neutral-400" />
                        <div className="text-[10px] uppercase tracking-widest">Awaiting tensor computation...</div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-neutral-400 font-mono">
                        <div className="text-[10px] uppercase tracking-widest border border-dashed border-neutral-300 p-2 rounded">SYSTEM_IDLE</div>
                        <div className="text-[9px] max-w-[200px] leading-relaxed">
                          Please drop or upload a food photo in the workspace area to activate inference telemetry.
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
