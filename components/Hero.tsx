import React, { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scrollToGenetics = () => {
    const element = document.getElementById('genetics');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Parallax State
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetX = width / 2;
    let targetY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
        targetX = e.clientX;
        targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation constants
    const helixX = width * 0.85; // Position on right
    let time = 0;

    const drawGrid = (vpX: number, vpY: number) => {
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.1)'; // Faint Teal
        ctx.lineWidth = 1;

        // Draw Vertical Lines converging to vanishing point
        const numLines = 40;
        for (let i = 0; i <= numLines; i++) {
            const x = (width / numLines) * i;
            // Introduce parallax offset to x based on mouse
            const offsetX = (x - width/2) * 1.5; 
            
            ctx.beginPath();
            // Start at bottom/top edges
            ctx.moveTo(x, height);
            ctx.lineTo(vpX + offsetX * 0.1, vpY);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(vpX + offsetX * 0.1, vpY);
            ctx.stroke();
        }

        // Draw Horizontal Lines (simulating depth)
        const horizon = vpY;
        const floorHeight = height - horizon;
        
        for (let i = 1; i < 20; i++) {
            const d = i / 20;
            const yOffset = Math.pow(d, 3) * floorHeight; 
            
            const y = horizon + yOffset;
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();

            // Ceiling mirror
            const yCeil = horizon - yOffset;
            ctx.beginPath();
            ctx.moveTo(0, yCeil);
            ctx.lineTo(width, yCeil);
            ctx.stroke();
        }
    };

    const drawDNA = (t: number) => {
        const amplitude = 40;
        const frequency = 0.02;
        const gap = 200; // Height of strand
        const strandYStart = height * 0.2;
        const strandYEnd = height * 0.8;
        const step = 10;
        
        // Pulse logic: travels down every 5 seconds
        const pulseSpeed = 0.0005; 
        const pulsePos = (Date.now() * pulseSpeed) % 1; 
        const pulseY = strandYStart + pulsePos * (strandYEnd - strandYStart);

        ctx.lineWidth = 2;

        for (let y = strandYStart; y < strandYEnd; y += step) {
            // Helix Math
            const yOffset = y - strandYStart;
            const x1 = helixX + Math.sin(yOffset * frequency + t * 0.02) * amplitude;
            const x2 = helixX + Math.sin(yOffset * frequency + t * 0.02 + Math.PI) * amplitude;

            // Base opacity
            let opacity = 0.2;
            let color = '45, 212, 191'; // Teal

            // Pulse Glow Effect
            const distToPulse = Math.abs(y - pulseY);
            if (distToPulse < 80) {
                opacity = 0.2 + (1 - distToPulse / 80) * 0.8;
                // Add Magenta tint near pulse
                if (distToPulse < 30) color = '255, 0, 255'; 
            }

            // Draw Rungs
            if (y % (step * 2) === 0) {
                ctx.strokeStyle = `rgba(${color}, ${opacity * 0.5})`;
                ctx.beginPath();
                ctx.moveTo(x1, y);
                ctx.lineTo(x2, y);
                ctx.stroke();
            }

            // Draw Nodes
            ctx.fillStyle = `rgba(${color}, ${opacity})`;
            
            ctx.beginPath();
            ctx.arc(x1, y, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x2, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth parallax
      const dx = targetX - mouseX;
      const dy = targetY - mouseY;
      mouseX += dx * 0.05;
      mouseY += dy * 0.05;

      const vpX = width / 2 - (mouseX - width / 2) * 0.1;
      const vpY = height / 2 - (mouseY - height / 2) * 0.1;

      drawGrid(vpX, vpY);
      drawDNA(time);

      time++;
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section id="hero" className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[#020617] selection:bg-luxury-teal selection:text-black border-b border-slate-900">
      
      {/* Canvas Background (Grid & DNA) */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 pointer-events-none opacity-50"
      />
      
      {/* --- Ambient Aurora Effects (Symmetry: Magenta Left / Teal Center / Gold Right) --- */}
      
      {/* 1. Magenta Nebula (Left Center) - Directly behind "ELITE" start for symmetry with DNA Helix */}
      <div className="absolute top-1/2 left-[10%] -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[140px] animate-pulse-slow pointer-events-none mix-blend-screen z-0" />
      
      {/* 2. Central Teal Glow (Deep) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(45,212,191,0.08)_0%,transparent_70%)] pointer-events-none z-0" />
      
      {/* 3. Gold/Purple Subtle Nebula (Bottom Right) */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-900/30 rounded-full blur-[100px] animate-pulse pointer-events-none mix-blend-screen z-0" />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none z-0"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 flex flex-col items-center justify-center h-full">
        
        <div className="text-center relative">
            <span className="inline-block font-sans text-luxury-teal text-[10px] md:text-xs tracking-[0.5em] uppercase mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                A Private Study in Rare Canine Genetics
            </span>
            
            <h1 className="flex flex-col items-center justify-center font-serif font-bold tracking-tight leading-none mb-8">
                <span className="text-5xl md:text-8xl lg:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-200 bg-[length:200%_auto] animate-shine drop-shadow-2xl">
                    ELITE
                </span>
                
                {/* DNA Text: Embossed Glass with Metallic Sweep */}
                <div className="relative inline-block mt-[-0.1em]">
                    {/* Base Text */}
                    <span 
                        className="relative z-10 text-6xl md:text-9xl lg:text-[11rem] tracking-[0.05em] font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-300 via-slate-500 to-slate-700" 
                        style={{ 
                            textShadow: '0px 2px 4px rgba(0,0,0,0.9), 0px -1px 0px rgba(255,255,255,0.4)',
                            WebkitTextStroke: '1px rgba(255,255,255,0.1)' 
                        }}
                    >
                        DNA
                    </span>
                    
                    {/* Metallic Beam Overlay (Sweep Animation) - Speed set to 3s via animate-shine */}
                    <span 
                        className="absolute inset-0 z-20 text-6xl md:text-9xl lg:text-[11rem] tracking-[0.05em] font-black text-transparent bg-clip-text bg-gradient-to-r from-transparent via-white/80 to-transparent bg-[length:200%_auto] animate-shine pointer-events-none"
                        style={{ mixBlendMode: 'overlay' }}
                    >
                        DNA
                    </span>
                </div>
            </h1>
            
            <div className="flex items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                <div className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-luxury-teal/50" />
                <p className="font-serif text-slate-400 text-sm md:text-lg tracking-widest uppercase whitespace-nowrap">
                    Specializing in Rare Loci and Structural Excellence
                </p>
                <div className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-luxury-teal/50" />
            </div>

            <div className="mt-12 flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-1000 delay-500">
                <button 
                    onClick={scrollToGenetics}
                    className="group relative px-8 py-4 bg-transparent border border-luxury-teal/30 text-white font-sans text-xs font-bold uppercase tracking-[0.2em] hover:bg-luxury-teal/10 hover:border-luxury-teal transition-all duration-500 overflow-hidden"
                >
                    <span className="relative z-10">Explore Genetics</span>
                    {/* Automated Sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 skew-x-[-20deg] animate-button-sweep" />
                </button>
            </div>
        </div>

      </div>

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToGenetics}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-luxury-teal/50 hover:text-luxury-teal transition-colors animate-bounce cursor-pointer z-20"
      >
        <ArrowDown size={24} />
      </button>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none z-20" />
    </section>
  );
};

export default Hero;