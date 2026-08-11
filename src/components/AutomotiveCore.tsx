"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sliders, Cpu, Activity, Compass, Shield, Zap,
  Play, Pause, SkipForward, SkipBack, Search, Mic, 
  Video, Volume2, VolumeX, Settings, Navigation, Music, LayoutGrid, Plus, Minus,
  AlertTriangle, Sun, Moon, Battery, CheckCircle, Radio, Mountain
} from "lucide-react";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  src: string;
  duration: number;
}

const defaultPlaylist: Track[] = [
  {
    id: "1",
    title: "Pashmina",
    artist: "Amit Trivedi",
    album: "Fitoor",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 270,
  },
  {
    id: "2",
    title: "Nightcall",
    artist: "Kavinsky",
    album: "Outrun",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&q=80",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 258,
  },
  {
    id: "3",
    title: "Starboy",
    artist: "The Weeknd",
    album: "Starboy",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 230,
  },
  {
    id: "4",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: 200,
  },
];

export default function AutomotiveCore() {
  // Infotainment Tablet states
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [activeApp, setActiveApp] = useState<"MAP" | "MUSIC" | "CAMERA" | "TELEMETRY">("TELEMETRY");
  const [volume, setVolume] = useState(0.75);
  const [climateTemp, setClimateTemp] = useState(19);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<"MAP" | "MUSIC">("MAP");
  const [voiceActive, setVoiceActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Time & Date states
  const [currentTimeStr, setCurrentTimeStr] = useState("21:45");
  const [currentDateStr, setCurrentDateStr] = useState("Mon Jul 20");

  // Spotify Audio States
  const [playlist, setPlaylist] = useState<Track[]>(defaultPlaylist);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(270);

  // Porsche Sport Chrono & Motorsport Telemetry states
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(84380); // in ms
  const [driveMode, setDriveMode] = useState<"NORMAL" | "SPORT" | "SPORT+" | "TRACK">("SPORT+");
  const [launchControlActive, setLaunchControlActive] = useState(false);
  const [sportExhaustActive, setSportExhaustActive] = useState(true);
  const [pasmSport, setPasmSport] = useState(true);
  const [boostPressure, setBoostPressure] = useState(1.45); // BAR
  const [wheelAngle, setWheelAngle] = useState<-15 | 0 | 15>(0);
  const [espStatus, setEspStatus] = useState(true); // true = Active, false = Off
  const [paintColor, setPaintColor] = useState("#707378"); // Default Authentic Anthracite Slate Grey

  // Mobile Platform Detection hook
  const { isMobile } = useIsMobile();
  const [forceMobile3D, setForceMobile3D] = useState(false);

  // Three.js Model Engine states
  const [modelLoading, setModelLoading] = useState(true);
  const [modelProgress, setModelProgress] = useState(0);

  // Volume Drag state
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);

  // Element Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const carModelRef = useRef<THREE.Object3D | null>(null);
  const cachedGltfRef = useRef<any>(null);
  const volumeTrackRef = useRef<HTMLDivElement>(null);

  // Current track selector
  const currentTrack = playlist[currentTrackIndex] || defaultPlaylist[0];

  // Toast notification system helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Porsche Sport Chrono Stopwatch Precision Hook
  useEffect(() => {
    let interval: any;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  const formatStopwatch = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const millis = Math.floor((ms % 1000) / 10);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}.${millis < 10 ? "0" : ""}${millis}`;
  };

  // Clock updating hook
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
      setCurrentDateStr(now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Dynamically pull tracks from user's playlist on load
  useEffect(() => {
    const loadUserPlaylist = async () => {
      try {
        const queries = [
          "Pashmina Amit Trivedi",
          "Yeh Fitoor Mera Arijit Singh",
          "Awari Momina Mustehsan",
          "Teri Yeh Baatein Kho Gaye Hum Kahan"
        ];
        const loaded: Track[] = [];
        
        for (const query of queries) {
          const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=1&entity=song`);
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            const item = data.results[0];
            loaded.push({
              id: item.trackId.toString(),
              title: item.trackName,
              artist: item.artistName,
              album: item.collectionName,
              cover: item.artworkUrl100.replace("100x100bb", "300x300bb"),
              src: item.previewUrl,
              duration: 30, // Preview MP3s are 30s
            });
          }
        }
        
        if (loaded.length > 0) {
          setPlaylist(loaded);
        }
      } catch (err) {
        console.error("Failed to load custom user playlist:", err);
      }
    };
    loadUserPlaylist();
  }, []);

  // HTML5 Audio Engine Integration
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleTimeUpdate = () => setAudioCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setAudioDuration(audio.duration || 30);
    const handleEnded = () => handleNext();

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Synchronize audio elements
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    const audio = audioRef.current;
    const wasPlaying = isPlaying;

    audio.src = currentTrack.src;
    audio.load();

    if (wasPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex, playlist]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  // Leaflet Map Initialization Hook
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).L) {
      setLeafletLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!leafletLoaded || typeof window === "undefined" || !(window as any).L || !mapContainerRef.current) return;

    if (!mapRef.current) {
      const L = (window as any).L;
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([48.8519, 2.3562], 15);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      const pulseIcon = L.divIcon({
        className: "relative flex items-center justify-center",
        html: `
          <div class="custom-marker-pulse"></div>
          <div class="w-3.5 h-3.5 bg-cyan-400 border border-white rounded-full relative z-10 shadow-[0_0_12px_rgba(34,211,238,0.9)]"></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([48.8519, 2.3562], { icon: pulseIcon }).addTo(map);

      mapRef.current = map;
      markerRef.current = marker;
    }
  }, [leafletLoaded]);

  // Adjust map dimensions when visible
  useEffect(() => {
    if (activeApp === "MAP" && mapRef.current) {
      const timer = setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeApp]);

  // Drag-to-Volume handler
  const handleVolumePointerDown = (e: React.PointerEvent) => {
    setIsDraggingVolume(true);
    updateVolume(e);
  };

  const updateVolume = (e: PointerEvent | React.PointerEvent) => {
    if (!volumeTrackRef.current) return;
    const rect = volumeTrackRef.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const percentage = 1 - Math.max(0, Math.min(1, relativeY / rect.height));
    setVolume(percentage);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingVolume) {
        updateVolume(e);
      }
    };
    const handlePointerUp = () => {
      if (isDraggingVolume) {
        setIsDraggingVolume(false);
      }
    };

    if (isDraggingVolume) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDraggingVolume]);

  // ADAS Camera Canvas Loop
  useEffect(() => {
    if (activeApp !== "CAMERA" || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let scanLine = 0;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      const w = canvas.width;
      const h = canvas.height;

      // Dark background
      ctx.fillStyle = "#0a0a0c";
      ctx.fillRect(0, 0, w, h);

      // Perspective ADAS Grid Lines
      ctx.strokeStyle = "rgba(34, 211, 238, 0.15)";
      ctx.lineWidth = 1;
      const vanishX = w / 2;
      const vanishY = h * 0.35;

      for (let i = -4; i <= 4; i++) {
        ctx.beginPath();
        ctx.moveTo(vanishX, vanishY);
        ctx.lineTo(vanishX + i * (w / 6), h);
        ctx.stroke();
      }

      // Horizontal distance lines
      for (let y = vanishY + 30; y < h; y += 35) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Animated Radar Scan Sweep Arc
      scanLine = (scanLine + 2) % h;
      const gradient = ctx.createLinearGradient(0, scanLine - 40, 0, scanLine);
      gradient.addColorStop(0, "rgba(34, 211, 238, 0)");
      gradient.addColorStop(1, "rgba(34, 211, 238, 0.25)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanLine - 40, w, 40);

      // Vehicle Hazard Overlay Targets
      const targetX = w * 0.5;
      const targetY = h * 0.6;
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.strokeRect(targetX - 35, targetY - 25, 70, 50);
      ctx.fillStyle = "#ef4444";
      ctx.font = "10px monospace";
      ctx.fillText("HAZARD: 4.2m", targetX - 35, targetY - 30);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeApp]);

  // Three.js 3D WebGL Kimera EVO 37 Supercar Engine Initialization Hook
  useEffect(() => {
    if (!threeContainerRef.current) return;
    const container = threeContainerRef.current;
    
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(2.8, 0.85, 2.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTexture;
    scene.background = null;
    pmremGenerator.dispose();
    roomEnv.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.0;
    controls.maxDistance = 8.0;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.target.set(0, 0, 0);
    controls.update();

    const resizeHandler = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    window.addEventListener("resize", resizeHandler);
    setTimeout(resizeHandler, 100);

    const hemiLight = new THREE.HemisphereLight(0xf2f4ff, 0x363b42, 0.6);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e8, 1.8);
    keyLight.position.set(-4.0, 6.0, 5.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.bias = -0.00025;
    keyLight.shadow.normalBias = 0.018;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -5;
    keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 5;
    keyLight.shadow.camera.bottom = -5;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa8c4ff, 0.6);
    fillLight.position.set(4.0, 3.0, 3.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfff1c4, 0.9);
    rimLight.position.set(0.5, 4.5, -6.0);
    scene.add(rimLight);

    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.name = "shadow_floor";
    scene.add(floor);

    const loader = new GLTFLoader();
    setModelLoading(true);
    setModelProgress(0);

    let carModel: THREE.Object3D | null = null;

    loader.load(
      "/models/free_1975_porsche_911_930_turbo.glb",
      (gltf) => {
        carModel = gltf.scene;
        carModelRef.current = gltf.scene;
        
        const box = new THREE.Box3().setFromObject(carModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4.6 / maxDim;
        
        // Push the car vertically upwards relative to its natural model origin so it sits perfectly in the upper-middle frame
        const yOffset = 0.35;
        carModel.position.set(-center.x, -center.y + yOffset, -center.z);
        carModel.scale.set(scale, scale, scale);

        const floorObj = scene.getObjectByName("shadow_floor");
        if (floorObj) {
          floorObj.position.y = - (size.y * scale) / 2 + yOffset;
        }
        
        carModel.traverse((node: any) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;

            if (node.material) {
              const mats = Array.isArray(node.material) ? node.material : [node.material];
              mats.forEach((mat: any) => {
                const name = mat.name.toLowerCase();
                
                if (name === "paint" || name.includes("paint") || name.includes("carroceria")) {
                  mat.color.set(paintColor);
                  mat.roughness = 0.18;
                  mat.metalness = 0.85;
                }
                else if (name.includes("glass") || name.includes("930_lights_refraction") || name.includes("cristales")) {
                  mat.transparent = true;
                  mat.opacity = 0.35;
                  mat.depthWrite = false;
                  mat.side = THREE.DoubleSide;
                }
                else if (name.includes("930_chromes") || name.includes("chrome")) {
                  mat.metalness = 0.95;
                  mat.roughness = 0.08;
                  mat.side = THREE.DoubleSide;
                }
                else if (name.includes("930_rim") || name.includes("930_tire") || name.includes("930_plastics") || name.includes("plastic")) {
                  mat.side = THREE.DoubleSide;
                }
              });
            }
          }
        });

        scene.add(carModel);
        setModelLoading(false);
      },
      (xhr) => {
        if (xhr.lengthComputable && xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          setModelProgress(percent);
        }
      },
      (error) => {
        console.error("Error loading Porsche 911 3D model:", error);
        setModelLoading(false);
      }
    );

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();

      if (carModelRef.current) {
        const targetRad = (wheelAngle * Math.PI) / 180;
        carModelRef.current.rotation.y = THREE.MathUtils.lerp(
          carModelRef.current.rotation.y,
          targetRad,
          0.05
        );
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  // Update Body Paint Color dynamically
  useEffect(() => {
    if (!carModelRef.current) return;
    carModelRef.current.traverse((node: any) => {
      if (node.isMesh && node.material) {
        const mats = Array.isArray(node.material) ? node.material : [node.material];
        mats.forEach((mat: any) => {
          const name = mat.name.toLowerCase();
          if (
            name.includes("carroceria") ||
            name.includes("paint") || 
            name.includes("bd01") || 
            name.includes("bd02") || 
            name.includes("primary")
          ) {
            mat.color.set(paintColor);
            mat.needsUpdate = true;
          }
        });
      }
    });
  }, [paintColor]);

  // Audio track change controls
  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev === playlist.length - 1 ? 0 : prev + 1));
    setIsPlaying(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Search Submit Handler
  const triggerSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);

    if (searchMode === "MAP") {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data && data.length > 0) {
          const { lat, lon, display_name } = data[0];
          const newLat = parseFloat(lat);
          const newLon = parseFloat(lon);

          if (mapRef.current) {
            mapRef.current.flyTo([newLat, newLon], 14, { duration: 1.5 });
            if (markerRef.current) {
              markerRef.current.setLatLng([newLat, newLon]);
            }
          }
          setActiveApp("MAP");
          showToast(`Navigating to: ${display_name.split(",")[0]}`);
        } else {
          showToast("Location not found on map");
        }
      } catch (err) {
        console.error("Geocoding failed:", err);
        showToast("Search failed");
      }
    } else {
      try {
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&limit=8&entity=song`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const newTracks: Track[] = data.results.map((item: any) => ({
            id: item.trackId.toString(),
            title: item.trackName,
            artist: item.artistName,
            album: item.collectionName,
            cover: item.artworkUrl100.replace("100x100bb", "300x300bb"),
            src: item.previewUrl,
            duration: 30,
          }));
          setPlaylist(newTracks);
          setCurrentTrackIndex(0);
          setIsPlaying(true);
          setActiveApp("MUSIC");
          showToast(`Loaded ${newTracks.length} tracks for "${searchQuery}"`);
        } else {
          showToast("No music tracks found");
        }
      } catch (err) {
        console.error("Music search failed:", err);
        showToast("Music search failed");
      }
    }

    setSearchLoading(false);
  };

  const restoreDefaultPlaylist = () => {
    setPlaylist(defaultPlaylist);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
    showToast("Reset to default playlist");
  };

  return (
    <div className="w-full min-h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden select-none p-4 font-sans antialiased">
      {/* Script Tag for Leaflet map tiles */}
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
        onLoad={() => setLeafletLoaded(true)}
      />

      {/* Unbranded Supercar Cockpit Ambient Background Image */}
      <Image
        src="/images/cockpit.png"
        alt="Italian Supercar Cockpit"
        fill
        className="object-cover opacity-25 grayscale mix-blend-luminosity pointer-events-none"
        priority
      />

      {/* Bezel Ambient Overlay Cage */}
      <div className="absolute inset-0 pointer-events-none border-x-4 border-neutral-900/60 max-w-7xl mx-auto flex justify-between">
        <div className="w-px h-full bg-neutral-900/40" />
        <div className="w-px h-full bg-neutral-900/40" />
      </div>

      {/* MOBILE DISPLAY SHOWCASE CARD (Visible ONLY on Mobile Screens) */}
      <div className="flex md:hidden w-full max-w-md bg-neutral-950/95 border border-neutral-850 rounded-2xl p-4 flex-col gap-4 font-sans relative overflow-hidden shadow-2xl z-10 backdrop-blur-xl">
        {/* Glowing Accent Header */}
        <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <span className="w-2 h-2 bg-red-500 rounded-full absolute" />
            <span className="font-mono text-xs font-bold text-white tracking-wider ml-4">1975 PORSCHE 911 930 TURBO</span>
          </div>
          <span className="font-mono text-[9px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-2 py-0.5 rounded-full uppercase">
            Cockpit HUD
          </span>
        </div>

        {/* Dynamic High-Res Cockpit Screenshot */}
        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-neutral-800 group bg-black shadow-inner">
          <Image
            src="/images/porsche_cockpit_preview.png"
            alt="1975 Porsche 911 930 Turbo Telematics Cockpit Experience"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3.5">
            <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest">Interactive Telematics Experience</span>
            <h4 className="text-sm font-bold text-white">Sport Chrono & Motorsport Suite</h4>
          </div>
        </div>

        {/* Telematics Feature Grid */}
        <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
          <div className="bg-neutral-900/60 border border-neutral-800/80 p-2.5 rounded-lg flex flex-col gap-0.5">
            <span className="text-neutral-500">ENGINE & BOOST</span>
            <span className="text-white font-bold">3.0L Flat-6 • 1.45 BAR</span>
          </div>
          <div className="bg-neutral-900/60 border border-neutral-800/80 p-2.5 rounded-lg flex flex-col gap-0.5">
            <span className="text-neutral-500">SPORT CHRONO</span>
            <span className="text-red-400 font-bold">01:24.380 LAP</span>
          </div>
          <div className="bg-neutral-900/60 border border-neutral-800/80 p-2.5 rounded-lg flex flex-col gap-0.5">
            <span className="text-neutral-500">BODY PAINT</span>
            <span className="text-neutral-300 font-bold">Anthracite Slate Grey</span>
          </div>
          <div className="bg-neutral-900/60 border border-neutral-800/80 p-2.5 rounded-lg flex flex-col gap-0.5">
            <span className="text-neutral-500">DRIVE MODE</span>
            <span className="text-red-400 font-bold">SPORT+ ACTIVE</span>
          </div>
        </div>

        {/* Mobile Experience Callout */}
        <div className="pt-1 flex flex-col gap-2">
          <div className="p-3 bg-neutral-900/40 border border-neutral-850 rounded-xl flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span>Full 3D WebGL Cockpit Available</span>
            </div>
            <span className="text-[9px] text-neutral-500 uppercase">Desktop Optimized</span>
          </div>
          <p className="text-[10px] font-mono text-center text-neutral-500">
            💡 Visit on desktop for full 3D supercar OrbitControls, WebGL paint swatches, & Spotify integration.
          </p>
        </div>
      </div>

      {/* DESKTOP 3D INFOTAINMENT TABLET FRAME (Visible ONLY on Desktop Screens) */}
      <div className="hidden md:flex w-full max-w-6xl bg-neutral-950/80 border-4 border-neutral-900 rounded-3xl p-1 relative shadow-[0_0_80px_rgba(0,0,0,0.85)] z-10 flex-col backdrop-blur-xl">
          <div className="w-full bg-[#070709] rounded-[20px] overflow-hidden flex flex-col relative border border-neutral-850 min-h-[640px] h-[660px] justify-between">
            
            {/* 1. SCREEN TOP STATUS BAR */}
            <div className="w-full border-b border-neutral-900 bg-black/40 px-5 py-3 flex justify-between items-center font-mono text-xs text-neutral-400 z-20">
            {/* Left side: Battery & Range stats */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Battery className="w-4 h-4 text-cyan-400 rotate-90" />
                <span className="font-bold text-white">82%</span>
              </div>
              <span className="text-[11px] text-neutral-500">324 km remaining</span>
            </div>

            {/* Center: Search Bar */}
            <form onSubmit={triggerSearch} className="flex items-center gap-1.5 bg-neutral-900/90 border border-neutral-800 rounded-full px-3.5 py-1.5 w-72 transition-all hover:border-neutral-700 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500/25">
              <Search className="w-3.5 h-3.5 text-neutral-500" />
              <input
                type="text"
                placeholder={searchMode === "MAP" ? "Search coordinates/city..." : "Search Spotify tracks..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-white text-xs w-full focus:outline-none placeholder-neutral-600 font-mono"
              />
              {searchLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchMode(searchMode === "MAP" ? "MUSIC" : "MAP")}
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold transition-all ${
                    searchMode === "MAP"
                      ? "bg-cyan-950 text-cyan-400 border border-cyan-800"
                      : "bg-red-950 text-red-400 border border-red-800"
                  }`}
                  title={`Switch search engine to ${searchMode === "MAP" ? "Music" : "Map"}`}
                >
                  {searchMode}
                </button>
              )}
            </form>

            {/* Right side: Time/Date & Temperature */}
            <div className="flex items-center gap-4">
              <span className="font-bold text-white">{currentTimeStr}</span>
              <span className="text-[10px] text-neutral-500">{currentDateStr}</span>
              <div className="flex items-center gap-1 text-white">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>19°C</span>
              </div>
            </div>
          </div>

          {/* 2. INTERACTIVE APP VIEW WORKSPACE */}
          <div className="flex-1 flex items-stretch overflow-hidden relative">
            
            {/* LEFT COLUMN: Spotify Player & Controls */}
            <div className="w-[32%] border-r border-neutral-900 p-4 bg-black/25 flex flex-col justify-between gap-4 z-10">
              
              {/* Quick Controls Section */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setVoiceActive(true)}
                    className="p-3 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 active:scale-95 rounded-xl transition-all flex items-center justify-center flex-1"
                    title="Activate Voice AI Assist"
                  >
                    <Mic className="w-4 h-4 text-cyan-400" />
                  </button>
                  <button
                    onClick={() => setActiveApp("CAMERA")}
                    className={`p-3 border active:scale-95 rounded-xl transition-all flex items-center justify-center flex-1 ${
                      activeApp === "CAMERA"
                        ? "bg-orange-950/60 border-orange-500 text-orange-400"
                        : "bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-300"
                    }`}
                    title="Toggle Backup Camera"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => setActiveApp("TELEMETRY")}
                  className="py-2.5 px-4 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 active:scale-95 rounded-xl transition-all text-left text-xs font-mono flex items-center justify-between text-neutral-300"
                >
                  <span>Quick controls</span>
                  <Sliders className="w-3.5 h-3.5 text-neutral-500" />
                </button>
              </div>

              {/* Spotify Player HUD Card */}
              <div className="bg-neutral-950/60 border border-neutral-900/85 p-3.5 rounded-2xl flex flex-col gap-3 relative shadow-inner">
                {/* Album Cover Art */}
                <div className="aspect-square w-full relative rounded-lg overflow-hidden group bg-neutral-900">
                  <Image
                    src={currentTrack.cover}
                    alt={currentTrack.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full text-white transition-all scale-90 group-hover:scale-100"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>
                  </div>
                </div>

                {/* Track Details */}
                <div>
                  <h3 className="text-sm font-bold text-white truncate">{currentTrack.title}</h3>
                  <p className="text-xs text-neutral-400 font-mono truncate">{currentTrack.artist}</p>
                </div>

                {/* Scrubbing Bar */}
                <div className="flex flex-col gap-1">
                  <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden relative cursor-pointer">
                    <div 
                      className="bg-cyan-400 h-full transition-all duration-200"
                      style={{ width: `${(audioCurrentTime / (audioDuration || 1)) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                    <span>{formatTime(audioCurrentTime)}</span>
                    <span>{formatTime(audioDuration)}</span>
                  </div>
                </div>

                {/* Media Playback Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button onClick={handlePrev} className="text-neutral-400 hover:text-white transition-colors">
                    <SkipBack className="w-4 h-4 fill-current" />
                  </button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)} 
                    className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                  <button onClick={handleNext} className="text-neutral-400 hover:text-white transition-colors">
                    <SkipForward className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>

            </div>

            {/* MAIN DYNAMIC SCREEN WORKSPACE (RIGHT SECTION) */}
            <div className="flex-1 relative overflow-hidden bg-[#050508] flex flex-col justify-between">
              
              {/* APP 1: Map View (Leaflet instance with Tactical Vector GPS Fallback) */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 flex flex-col ${
                  activeApp === "MAP" ? "opacity-100 pointer-events-auto z-10" : "opacity-0 pointer-events-none z-0"
                }`}
              >
                {/* Tactical Vector Grid Map Background (Renders immediately so map view is never black) */}
                <div className="absolute inset-0 bg-[#060a12] bg-[linear-gradient(to_right,#0c1a30_1px,transparent_1px),linear-gradient(to_bottom,#0c1a30_1px,transparent_1px)] bg-[size:32px_32px] flex flex-col justify-between p-5 pointer-events-none overflow-hidden z-0">
                  {/* Radar sweep circles */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-cyan-900/30 flex items-center justify-center">
                    <div className="w-56 h-56 rounded-full border border-cyan-800/25 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full border border-dashed border-cyan-700/25" />
                    </div>
                    {/* Pulsing GPS Center Marker */}
                    <div className="absolute w-3.5 h-3.5 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.9)] animate-pulse flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full border border-cyan-400/50 animate-ping absolute" />
                    </div>
                  </div>

                  {/* HUD Header Bar */}
                  <div className="flex justify-between items-center z-10 font-mono text-[9px] text-cyan-400 bg-neutral-950/80 border border-neutral-850 px-3 py-1.5 rounded-lg backdrop-blur-md max-w-fit shadow-md">
                    <span className="font-bold flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-cyan-400 rotate-45" /> TACTICAL GPS NAV • 48.8519° N, 2.3562° E
                    </span>
                  </div>

                  {/* Status overlay */}
                  <div className="self-start z-10 bg-neutral-950/85 border border-neutral-850 p-3 rounded-xl flex flex-col gap-1 text-[9px] font-mono backdrop-blur-md shadow-lg">
                    <span className="text-neutral-500">CURRENT DESTINATION:</span>
                    <span className="text-white font-bold text-xs">PARIS SEINE RIVER • ACTIVE SATELLITE FEED</span>
                    <div className="flex items-center gap-2 mt-1 text-cyan-400">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span>SATELLITE LOCK • 12 SATS CONNECTED</span>
                    </div>
                  </div>
                </div>

                {/* Map Container (Leaflet overlay) */}
                <div ref={mapContainerRef} className="w-full h-full relative z-10" />

                {/* Custom Map UI buttons (overlay zoom controls) */}
                <div className="absolute bottom-5 right-5 z-20 flex flex-col gap-2">
                  <button
                    onClick={() => mapRef.current?.zoomIn()}
                    className="w-8 h-8 rounded-lg bg-neutral-950/85 hover:bg-neutral-900 border border-neutral-850 hover:border-neutral-700 text-white flex items-center justify-center font-bold text-lg backdrop-blur-md active:scale-95 transition-all shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => mapRef.current?.zoomOut()}
                    className="w-8 h-8 rounded-lg bg-neutral-950/85 hover:bg-neutral-900 border border-neutral-850 hover:border-neutral-700 text-white flex items-center justify-center font-bold text-lg backdrop-blur-md active:scale-95 transition-all shadow-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* APP 2: Spotify Playlist Feed / Search Results App */}
              <div
                className={`absolute inset-0 transition-all duration-300 p-5 overflow-y-auto flex flex-col bg-neutral-950/90 backdrop-blur-md ${
                  activeApp === "MUSIC" ? "opacity-100 pointer-events-auto z-10 translate-y-0" : "opacity-0 pointer-events-none z-0 translate-y-4"
                }`}
              >
                <div className="flex justify-between items-center border-b border-neutral-900 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-red-500" />
                    <h4 className="text-sm font-sans font-bold text-white">Active Spotify Feed</h4>
                  </div>
                  <button
                    onClick={restoreDefaultPlaylist}
                    className="text-[10px] font-mono border border-neutral-800 hover:border-neutral-700 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 px-3 py-1 rounded-full transition-all"
                  >
                    Reset to Default Playlist
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  {playlist.map((track, idx) => (
                    <button
                      key={track.id + idx}
                      onClick={() => {
                        setCurrentTrackIndex(idx);
                        setIsPlaying(true);
                      }}
                      className={`flex items-center gap-3 p-2 rounded-xl text-left transition-all ${
                        currentTrackIndex === idx
                          ? "bg-neutral-900 border border-neutral-800 text-white"
                          : "hover:bg-neutral-900/50 text-neutral-400 border border-transparent"
                      }`}
                    >
                      <div className="w-10 h-10 relative rounded overflow-hidden flex-shrink-0 bg-neutral-900">
                        <Image src={track.cover} alt={track.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-[12px] font-bold truncate ${currentTrackIndex === idx ? "text-red-400" : "text-white"}`}>
                            {track.title}
                          </span>
                          <span className="text-[10px] text-neutral-600 font-mono">
                            {currentTrackIndex === idx && isPlaying ? "PLAYING" : ""}
                          </span>
                        </div>
                        <div className="flex justify-between text-[10px] text-neutral-500 mt-0.5 truncate font-mono">
                          <span>{track.artist}</span>
                          <span>{track.album}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* APP 3: ADAS Backup Radar/Camera Feed App */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 flex flex-col ${
                  activeApp === "CAMERA" ? "opacity-100 pointer-events-auto z-10" : "opacity-0 pointer-events-none z-0"
                }`}
              >
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
              </div>

              {/* APP 4: Kimera EVO 37 Supercar Vehicle Dial Screen */}
              <div
                className={`absolute inset-0 transition-all duration-300 p-5 flex flex-col justify-between bg-neutral-950/95 backdrop-blur-md ${
                  activeApp === "TELEMETRY" ? "opacity-100 pointer-events-auto z-10 translate-y-0" : "opacity-0 pointer-events-none z-0 translate-y-4"
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-500" />
                    <h4 className="text-sm font-sans font-bold text-white">1975 Porsche 911 930 Turbo Telematics</h4>
                  </div>
                  <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-[10px] font-mono text-neutral-400 cursor-pointer hover:border-neutral-700">
                    <span>Performance Dial</span>
                    <span className="text-[8px] text-neutral-600">▼</span>
                  </div>
                </div>

                {/* Main Dial Workspace */}
                <div className="flex-1 flex items-stretch mt-3 overflow-hidden">
                  
                  {/* Left Column Stats: Porsche Sport Chrono & Motorsport Package */}
                  <div className="w-[32%] flex flex-col justify-between gap-2.5 text-xs font-mono py-1">
                    
                    {/* 1. Sport Chrono Digital Stopwatch & Lap Timer */}
                    <div className="bg-neutral-900/50 border border-neutral-850 p-3 rounded-xl flex flex-col gap-2 shadow-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5 text-red-500">
                          <Activity className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-bold uppercase tracking-wider text-white">SPORT CHRONO</span>
                        </div>
                        <span className="text-[8px] text-neutral-500">BEST: 01:18.94</span>
                      </div>
                      
                      <div className="flex justify-between items-baseline bg-black/60 border border-neutral-850 px-3 py-1.5 rounded-lg">
                        <span className="text-lg font-bold text-red-500 tracking-wider font-mono">
                          {formatStopwatch(stopwatchTime)}
                        </span>
                        <span className="text-[8px] text-neutral-500">LAP 04</span>
                      </div>

                      <div className="flex gap-1.5 mt-0.5">
                        <button
                          onClick={() => setStopwatchRunning(!stopwatchRunning)}
                          className={`flex-1 py-1 rounded text-[9px] font-bold transition-all ${
                            stopwatchRunning
                              ? "bg-amber-950 text-amber-400 border border-amber-800"
                              : "bg-red-950 text-red-400 border border-red-800 hover:bg-red-900"
                          }`}
                        >
                          {stopwatchRunning ? "PAUSE" : "START LAP"}
                        </button>
                        <button
                          onClick={() => {
                            setStopwatchRunning(false);
                            setStopwatchTime(0);
                          }}
                          className="px-2.5 py-1 bg-neutral-950 text-neutral-400 border border-neutral-800 hover:border-neutral-700 rounded text-[9px] font-bold transition-all"
                        >
                          RESET
                        </button>
                      </div>
                    </div>

                    {/* 2. Turbocharger Boost Pressure Gauge */}
                    <div className="bg-neutral-900/40 border border-neutral-850 p-2.5 rounded-xl flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="text-neutral-500 uppercase font-bold">TURBO BOOST</span>
                        <span className="text-cyan-400 font-bold">1.45 BAR</span>
                      </div>
                      <div className="w-full bg-neutral-950 border border-neutral-850 h-2 rounded-full overflow-hidden relative">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-red-500 rounded-full" style={{ width: "62%" }} />
                      </div>
                      <div className="flex justify-between text-[8px] text-neutral-600">
                        <span>0.0</span>
                        <span>PEAK: 1.80 BAR</span>
                        <span>2.5</span>
                      </div>
                    </div>

                    {/* 3. Motorsport Drive Mode Selector */}
                    <div className="bg-neutral-900/40 border border-neutral-850 p-2.5 rounded-xl flex flex-col gap-1.5">
                      <span className="text-[9px] text-neutral-500 uppercase block font-bold">DRIVE MODE</span>
                      <div className="grid grid-cols-4 gap-1">
                        {(["NORMAL", "SPORT", "SPORT+", "TRACK"] as const).map((m) => (
                          <button
                            key={m}
                            onClick={() => setDriveMode(m)}
                            className={`py-1 rounded text-[8px] font-bold transition-all ${
                              driveMode === m
                                ? "bg-red-600 text-white shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                : "bg-neutral-950 text-neutral-500 hover:text-white border border-neutral-850"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 4. Porsche Vehicle Body Paint Selector */}
                    <div className="bg-neutral-900/40 border border-neutral-850 p-2.5 rounded-xl flex flex-col gap-1.5">
                      <span className="text-[9px] text-neutral-500 uppercase block font-bold">911 BODY PAINT</span>
                      <div className="flex gap-2.5 items-center mt-0.5">
                        {/* Guards Red */}
                        <button
                          onClick={() => setPaintColor("#d21f3c")}
                          className={`w-5.5 h-5.5 rounded-full bg-[#d21f3c] transition-all hover:scale-110 active:scale-95 ${
                            paintColor === "#d21f3c" ? "ring-2 ring-white ring-offset-2 ring-offset-black" : "opacity-75"
                          }`}
                          title="Guards Red"
                        />
                        {/* Riviera Blue */}
                        <button
                          onClick={() => setPaintColor("#0066cc")}
                          className={`w-5.5 h-5.5 rounded-full bg-[#0066cc] transition-all hover:scale-110 active:scale-95 ${
                            paintColor === "#0066cc" ? "ring-2 ring-white ring-offset-2 ring-offset-black" : "opacity-75"
                          }`}
                          title="Riviera Blue"
                        />
                        {/* Signal Yellow */}
                        <button
                          onClick={() => setPaintColor("#ffcc00")}
                          className={`w-5.5 h-5.5 rounded-full bg-[#ffcc00] transition-all hover:scale-110 active:scale-95 ${
                            paintColor === "#ffcc00" ? "ring-2 ring-white ring-offset-2 ring-offset-black" : "opacity-75"
                          }`}
                          title="Signal Yellow"
                        />
                        {/* Acid Green */}
                        <button
                          onClick={() => setPaintColor("#39ff14")}
                          className={`w-5.5 h-5.5 rounded-full bg-[#39ff14] transition-all hover:scale-110 active:scale-95 ${
                            paintColor === "#39ff14" ? "ring-2 ring-white ring-offset-2 ring-offset-black" : "opacity-75"
                          }`}
                          title="Acid Green"
                        />
                        {/* Metallic Carbon */}
                        <button
                          onClick={() => setPaintColor("#222222")}
                          className={`w-5.5 h-5.5 rounded-full bg-[#222222] border border-neutral-700 flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                            paintColor === "#222222" ? "ring-2 ring-white ring-offset-2 ring-offset-black" : "opacity-75"
                          }`}
                          title="Metallic Carbon"
                        >
                          <span className="text-[7px] text-neutral-400 font-bold">CF</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Center Column: 1975 Porsche 911 930 Turbo Viewport */}
                  <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                    {/* 3D Model Container (WebGL) */}
                    <div ref={threeContainerRef} className="w-full h-full min-h-[220px] relative z-10 flex items-center justify-center cursor-grab active:cursor-grabbing" />

                    {/* Loading Screen Overlay */}
                    {modelLoading && (
                      <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm z-20 flex flex-col justify-center items-center gap-3 rounded-2xl">
                        <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
                        <span className="font-mono text-[10px] text-red-400">Loading 1975 Porsche 911... {modelProgress}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Row Motorsport Controls */}
                <div className="grid grid-cols-4 gap-3 border-t border-neutral-900 pt-3 text-xs font-mono">
                  {/* Launch Control */}
                  <button
                    onClick={() => setLaunchControlActive(!launchControlActive)}
                    className={`py-2 px-3 border rounded-xl flex flex-col items-center gap-1 transition-all active:scale-95 ${
                      launchControlActive
                        ? "bg-amber-950/60 border-amber-500 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                        : "bg-neutral-900/60 border-neutral-850 hover:border-neutral-800 text-neutral-400"
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span className="text-[8px] uppercase tracking-wider font-bold">{launchControlActive ? "LAUNCH READY" : "LAUNCH CONTROL"}</span>
                  </button>

                  {/* Sport Exhaust */}
                  <button
                    onClick={() => setSportExhaustActive(!sportExhaustActive)}
                    className={`py-2 px-3 border rounded-xl flex flex-col items-center gap-1 transition-all active:scale-95 ${
                      sportExhaustActive
                        ? "bg-red-950/60 border-red-500 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.25)]"
                        : "bg-neutral-900/60 border-neutral-850 hover:border-neutral-800 text-neutral-400"
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    <span className="text-[8px] uppercase tracking-wider font-bold">{sportExhaustActive ? "SPORT EXHAUST ON" : "EXHAUST QUIET"}</span>
                  </button>

                  {/* PASM Suspension */}
                  <button
                    onClick={() => setPasmSport(!pasmSport)}
                    className={`py-2 px-3 border rounded-xl flex flex-col items-center gap-1 transition-all active:scale-95 ${
                      pasmSport
                        ? "bg-cyan-950/60 border-cyan-500 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.25)]"
                        : "bg-neutral-900/60 border-neutral-850 hover:border-neutral-800 text-neutral-400"
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    <span className="text-[8px] uppercase tracking-wider font-bold">{pasmSport ? "PASM SPORT DAMP" : "PASM COMFORT"}</span>
                  </button>

                  {/* PSM Traction Status */}
                  <button
                    onClick={() => setEspStatus(!espStatus)}
                    className={`py-2 px-3 border rounded-xl flex flex-col items-center gap-1 transition-all active:scale-95 ${
                      !espStatus
                        ? "bg-red-950/60 border-red-500 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.25)]"
                        : "bg-neutral-900/60 border-neutral-850 hover:border-neutral-800 text-neutral-400"
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span className="text-[8px] uppercase tracking-wider font-bold">{espStatus ? "PSM SPORT ON" : "PSM OFF"}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT VOLUME SLIDER COLUMN */}
            <div className="w-[5%] border-l border-neutral-900 p-3 bg-black/40 flex flex-col items-center justify-between gap-4 relative z-10">
              <span className="text-[8px] font-mono text-neutral-500 rotate-90 whitespace-nowrap uppercase tracking-widest mt-4">Volume</span>
              
              <div 
                ref={volumeTrackRef}
                onPointerDown={handleVolumePointerDown}
                className="flex-1 w-6 flex items-center justify-center cursor-pointer py-4 relative group"
              >
                <div className="volume-slider-track w-1">
                  <div 
                    className="volume-slider-fill" 
                    style={{ height: `${volume * 100}%` }}
                  />
                  <div 
                    className="volume-slider-thumb"
                    style={{ bottom: `calc(${volume * 100}% - 6px)` }}
                  />
                </div>
              </div>

              <button 
                onClick={() => setVolume((prev) => (prev > 0 ? 0 : 0.75))}
                className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-all active:scale-90"
              >
                {volume > 0 ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-600" />}
              </button>
            </div>

          </div>

          {/* 3. SCREEN BOTTOM CONTROL DOCK */}
          <div className="w-full border-t border-neutral-900 bg-[#040406] px-6 py-3 flex justify-between items-center select-none z-20">
            {/* Climate Adjuster Left */}
            <div className="flex items-center gap-3 font-mono">
              <button
                onClick={() => setClimateTemp((prev) => Math.max(16, prev - 1))}
                className="w-8 h-8 rounded-full border border-neutral-800 hover:border-neutral-750 bg-neutral-950 hover:bg-neutral-905 transition-all flex items-center justify-center active:scale-90"
              >
                <Minus className="w-3.5 h-3.5 text-neutral-400 hover:text-white" />
              </button>
              <div className="flex flex-col items-center justify-center w-10">
                <span className="text-sm font-bold text-white tracking-tight">{climateTemp}°</span>
                <span className="text-[8px] text-neutral-500 uppercase tracking-widest">Cab Temp</span>
              </div>
              <button
                onClick={() => setClimateTemp((prev) => Math.min(28, prev + 1))}
                className="w-8 h-8 rounded-full border border-neutral-800 hover:border-neutral-750 bg-neutral-950 hover:bg-neutral-905 transition-all flex items-center justify-center active:scale-90"
              >
                <Plus className="w-3.5 h-3.5 text-neutral-400 hover:text-white" />
              </button>
            </div>

            {/* Navigation App Dock Shortcuts */}
            <div className="flex items-center gap-2 bg-neutral-950/80 border border-neutral-900 rounded-full px-2 py-1">
              <button
                onClick={() => setActiveApp("MAP")}
                className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
                  activeApp === "MAP"
                    ? "bg-cyan-950 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.25)]"
                    : "text-neutral-500 hover:text-white"
                }`}
                title="Navigation Map"
              >
                <Navigation className="w-4 h-4 fill-current rotate-45" />
              </button>
              <button
                onClick={() => setActiveApp("MUSIC")}
                className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
                  activeApp === "MUSIC"
                    ? "bg-red-950 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.25)]"
                    : "text-neutral-500 hover:text-white"
                }`}
                title="Spotify Playlist"
              >
                <Music className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={() => setActiveApp("CAMERA")}
                className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
                  activeApp === "CAMERA"
                    ? "bg-orange-950 text-orange-450 shadow-[0_0_12px_rgba(249,115,22,0.25)]"
                    : "text-neutral-500 hover:text-white"
                }`}
                title="ADAS Backup Camera"
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveApp("TELEMETRY")}
                className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
                  activeApp === "TELEMETRY"
                    ? "bg-neutral-850 text-white shadow-[0_0_10px_rgba(255,255,255,0.15)]"
                    : "text-neutral-500 hover:text-white"
                }`}
                title="Telemetry Performance Console"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Right-side quick controls */}
            <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
              <button className="p-2 rounded-lg bg-neutral-950 border border-neutral-900 hover:border-neutral-800 transition-all flex items-center justify-center text-neutral-400 hover:text-white active:scale-95">
                <Settings className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-white">{climateTemp}°</span>
            </div>
          </div>

          {/* VOICE INTERACTIVE WAVE OVERLAY */}
          <AnimatePresence>
            {voiceActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/85 z-50 flex flex-col justify-center items-center gap-6"
              >
                <button
                  onClick={() => setVoiceActive(false)}
                  className="absolute top-5 right-5 text-neutral-500 hover:text-white text-xs font-mono border border-neutral-800 rounded-full px-3 py-1 bg-neutral-900"
                >
                  Close [ESC]
                </button>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">COCKPIT VOICE AI</span>
                  </div>
                  <h4 className="text-md text-white font-sans font-bold">How can I help you drive?</h4>
                  <p className="text-[10px] font-mono text-neutral-500 text-center max-w-sm">
                    Say: &quot;Navigate to Munich&quot;, &quot;Play Tame Impala&quot;, or &quot;Increase temp to 22 degrees&quot;
                  </p>
                </div>

                <div className="flex items-end gap-1.5 h-16">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 bg-cyan-400 rounded-full"
                      animate={{ height: [12, i * 10 + 20, 12] }}
                      transition={{
                        duration: 0.8 + i * 0.1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{ minHeight: "12px" }}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setVoiceActive(false);
                      setSearchQuery("Kavinsky Nightcall");
                      setSearchMode("MUSIC");
                      showToast("Voice command: playing Kavinsky Nightcall");
                      setTimeout(() => {
                        const form = document.querySelector("form");
                        if (form) form.requestSubmit();
                      }, 400);
                    }}
                    className="px-4 py-1.5 text-[10px] font-mono border border-cyan-800/50 bg-cyan-950/40 text-cyan-400 hover:bg-cyan-900 rounded-full transition-all"
                  >
                    Simulate: &quot;Play Nightcall&quot;
                  </button>
                  <button
                    onClick={() => {
                      setVoiceActive(false);
                      setSearchQuery("Munich");
                      setSearchMode("MAP");
                      showToast("Voice command: routing to Munich");
                      setTimeout(() => {
                        const form = document.querySelector("form");
                        if (form) form.requestSubmit();
                      }, 400);
                    }}
                    className="px-4 py-1.5 text-[10px] font-mono border border-cyan-800/50 bg-cyan-950/40 text-cyan-400 hover:bg-cyan-900 rounded-full transition-all"
                  >
                    Simulate: &quot;Go to Munich&quot;
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ACTIVE STATUS TOAST NOTIFICATION */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-neutral-900/90 border border-neutral-850 text-white font-mono text-[10px] py-2 px-4 rounded-full flex items-center gap-2 shadow-2xl backdrop-blur-md"
              >
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Credits Clause */}
      <div className="w-full max-w-5xl text-[8px] font-mono text-neutral-600 mt-6 flex justify-between items-center z-10 px-4">
        <span>PORSCHE 911 930 TURBO // TELEMETRY SUITE</span>
        <span>MOTORSPORT_DYNAMICS // BUILD_VERSION_4.1</span>
      </div>
    </div>
  );
}
