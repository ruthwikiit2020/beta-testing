import React, { useRef, useEffect } from "react";

/** Inline Noise overlay (no external imports). */
interface NoiseProps {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number; // 0–255
}

const Noise: React.FC<NoiseProps> = ({
  patternSize = 250, // (reserved for future scaling)
  patternScaleX = 1,  // (reserved)
  patternScaleY = 1,  // (reserved)
  patternRefreshInterval = 2,
  patternAlpha = 15,
}) => {
  const grainRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let animationId = 0;
    const canvasSize = 1024;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      // Cover viewport
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
    };

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      if (frame % patternRefreshInterval === 0) drawGrain();
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };

    window.addEventListener("resize", resize);
    resize();
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationId);
    };
  }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      ref={grainRef}
      className="pointer-events-none absolute inset-0"
      style={{ imageRendering: "pixelated" }}
    />
  );
};

/** Compact Noise component for demo */
const CompactNoise: React.FC<{ patternRefreshInterval?: number; patternAlpha?: number }> = ({ patternRefreshInterval = 2, patternAlpha = 12 }) => {
  const r = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = r.current; if (!c) return;
    const x = c.getContext("2d", { alpha: true }); if (!x) return;
    let f=0,id=0,S=1024;
    const resize=()=>{c.width=S;c.height=S;c.style.width="100vw";c.style.height="100vh";};
    const draw=()=>{const img=x.createImageData(S,S);const d=img.data;for(let i=0;i<d.length;i+=4){const v=Math.random()*255;d[i]=v;d[i+1]=v;d[i+2]=v;d[i+3]=patternAlpha;}x.putImageData(img,0,0);};
    const loop=()=>{if(f%patternRefreshInterval===0)draw();f++;id=requestAnimationFrame(loop);};
    addEventListener("resize",resize);resize();loop();return()=>{removeEventListener("resize",resize);cancelAnimationFrame(id);};
  },[patternRefreshInterval,patternAlpha]);
  return <canvas ref={r} className="pointer-events-none absolute inset-0" style={{ imageRendering: "pixelated" }}/>;
};

/** Dark theme with green grid and noise */
export function BackgroundNoiseEffect() {
  return (
    <div className="fixed inset-0 -z-10 bg-slate-950">
      {/* Grid pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1e293b33_1px,transparent_1px),linear-gradient(to_bottom,#1e293b33_1px,transparent_1px)] bg-[size:24px_24px]" />
      {/* Green blur glow */}
      <div className="absolute left-1/3 top-1/4 z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 opacity-25 blur-[140px]" />
      {/* Noise overlay */}
      <Noise patternRefreshInterval={2} patternAlpha={18} />
    </div>
  );
}

/** Light theme with grid and green glow */
export function BackgroundNoiseEffectLight() {
  return (
    <div className="fixed inset-0 -z-10 bg-white">
      {/* subtle grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#cbd5e133_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e133_1px,transparent_1px)] bg-[size:24px_24px]" />
      {/* blur glow */}
      <div className="absolute left-1/3 top-1/4 z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 opacity-25 blur-[140px]" />
      <CompactNoise patternAlpha={18} />
    </div>
  );
}

/** Default export component (dark theme with green grid) */
export default function Component() {
  return (
    <div className="fixed inset-0 -z-10 bg-slate-950">
      {/* Grid pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1e293b33_1px,transparent_1px),linear-gradient(to_bottom,#1e293b33_1px,transparent_1px)] bg-[size:24px_24px]" />
      {/* Green blur glow */}
      <div className="absolute left-1/3 top-1/4 z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 opacity-25 blur-[140px]" />
      {/* Noise overlay */}
      <Noise patternRefreshInterval={2} patternAlpha={18} />
    </div>
  );
}

/** Light theme demo component */
export function LightThemeComponent() {
  return (
    <div className="fixed inset-0 -z-10 bg-white">
      {/* subtle grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#cbd5e133_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e133_1px,transparent_1px)] bg-[size:24px_24px]" />
      {/* blur glow */}
      <div className="absolute left-1/3 top-1/4 z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 opacity-25 blur-[140px]" />
      <CompactNoise patternAlpha={18} />
    </div>
  );
}

/** Customizable wrapper component */
interface BackgroundNoiseWrapperProps {
  children: React.ReactNode;
  variant?: 'dark' | 'light';
  className?: string;
}

export function BackgroundNoiseWrapper({ 
  children, 
  variant = 'dark', 
  className = "" 
}: BackgroundNoiseWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      {variant === 'dark' ? <BackgroundNoiseEffect /> : <BackgroundNoiseEffectLight />}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}