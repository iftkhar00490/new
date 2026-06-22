"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface TextParticlesProps {
  text: string;
}

export default function TextParticles({ text }: TextParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high-res canvas dimensions (2x scaling for retina)
    const scale = 2;
    const width = 280;
    const height = 110;
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(scale, scale);

    // Create offscreen canvas to draw text and extract pixels
    const offscreen = document.createElement("canvas");
    offscreen.width = width;
    offscreen.height = height;
    const octx = offscreen.getContext("2d");
    if (!octx) return;

    // Draw text on offscreen canvas
    octx.font = "900 42px Geist, system-ui, -apple-system, sans-serif";
    octx.fillStyle = "#ffffff";
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillText(text, width / 2, height / 2 + 5);

    // Extract pixel coordinates
    const imgData = octx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const particles: Particle[] = [];
    const gap = 3; // spacing between particles

    for (let y = 0; y < height; y += gap) {
      for (let x = 0; x < width; x += gap) {
        const index = (y * width + x) * 4;
        const alpha = data[index + 3];

        if (alpha > 128) {
          // Add random jitter to spawn coordinates for entrance effect
          particles.push({
            x: x + (Math.random() * 30 - 15),
            y: y + (Math.random() * 30 - 15),
            originX: x,
            originY: y,
            vx: 0,
            vy: 0,
            size: Math.random() * 1.5 + 0.8,
            color: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.7})`, // high-contrast white with variance
          });
        }
      }
    }

    // Animation physics configuration
    const mouseRadius = 45;
    const forceFactor = 0.08;
    const stiffness = 0.06;
    const friction = 0.88;

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Interaction physics
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius) {
            const force = (mouseRadius - dist) / mouseRadius;
            const angle = Math.atan2(dy, dx);
            // Push velocity away from cursor
            p.vx += Math.cos(angle) * force * 5.0 * forceFactor;
            p.vy += Math.sin(angle) * force * 5.0 * forceFactor;
          }
        }

        // Return to origin springs
        const dxOrig = p.originX - p.x;
        const dyOrig = p.originY - p.y;
        p.vx += dxOrig * stiffness;
        p.vy += dyOrig * stiffness;

        // Apply friction
        p.vx *= friction;
        p.vy *= friction;

        // Update coordinates
        p.x += p.vx;
        p.y += p.vy;

        // Render particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Translate window coordinate to canvas relative coordinate
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [text]);

  return (
    <div className="relative w-full h-[120px] flex items-center justify-center">
      {/* Decorative technical coordinate ticks around particles box */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-neutral-800" />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-neutral-800" />
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-neutral-800" />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-neutral-800" />
      
      <canvas 
        ref={canvasRef} 
        className="cursor-crosshair block select-none bg-black"
      />
    </div>
  );
}
