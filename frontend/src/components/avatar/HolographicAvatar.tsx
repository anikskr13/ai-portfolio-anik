import { useEffect, useRef } from "react";
import { Sparkles, Activity, Mic, Volume2 } from "lucide-react";

export type AvatarState = "idle" | "listening" | "thinking" | "speaking";

interface HolographicAvatarProps {
  state: AvatarState;
  isAudioPlaying?: boolean;
}

export const HolographicAvatar: React.FC<HolographicAvatarProps> = ({
  state,
  isAudioPlaying = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Number of 3D particles in the neural sphere
    const particleCount = 120;
    const particles: {
      theta: number;
      phi: number;
      radius: number;
      speed: number;
      size: number;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        theta: Math.random() * Math.PI * 2,
        phi: Math.acos(Math.random() * 2 - 1),
        radius: 75 + Math.random() * 15,
        speed: (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 2 + 1,
      });
    }

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Color palette based on state
      let primaryColor = "rgba(6, 182, 212, "; // Cyan (idle)
      let secondaryColor = "rgba(139, 92, 246, "; // Violet

      let rotSpeed = 1;
      let pulseMagnitude = 1;

      if (state === "listening") {
        primaryColor = "rgba(16, 185, 129, "; // Emerald
        secondaryColor = "rgba(5, 150, 105, ";
        rotSpeed = 1.4;
        pulseMagnitude = 1.15 + Math.sin(time * 6) * 0.1;
      } else if (state === "thinking") {
        primaryColor = "rgba(236, 72, 153, "; // Pink / Magenta
        secondaryColor = "rgba(168, 85, 247, "; // Purple
        rotSpeed = 2.8;
        pulseMagnitude = 1.05 + Math.sin(time * 8) * 0.08;
      } else if (state === "speaking") {
        primaryColor = "rgba(59, 130, 246, "; // Blue
        secondaryColor = "rgba(14, 165, 233, "; // Sky
        rotSpeed = 1.8;
        pulseMagnitude = 1.2 + Math.sin(time * 10) * 0.15;
      }

      // Draw outer ambient glowing background circle
      const bgGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        20,
        centerX,
        centerY,
        120 * pulseMagnitude
      );
      bgGrad.addColorStop(0, primaryColor + "0.25)");
      bgGrad.addColorStop(0.5, secondaryColor + "0.1)");
      bgGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 120 * pulseMagnitude, 0, Math.PI * 2);
      ctx.fill();

      // Draw Gyroscope Orbital Rings (Hologram Rings)
      const drawRing = (
        tiltAngle: number,
        spinSpeed: number,
        radiusX: number,
        radiusY: number,
        alpha: number
      ) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(tiltAngle + time * spinSpeed * rotSpeed);

        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX * pulseMagnitude, radiusY * pulseMagnitude, 0, 0, Math.PI * 2);
        ctx.strokeStyle = primaryColor + `${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 12]);
        ctx.stroke();

        ctx.restore();
      };

      drawRing(0.4, 0.3, 100, 42, 0.5);
      drawRing(-0.6, -0.4, 108, 46, 0.4);
      drawRing(1.2, 0.25, 114, 50, 0.3);

      // Draw Center Core Energy Sphere
      const coreGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        5,
        centerX,
        centerY,
        45 * pulseMagnitude
      );
      coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
      coreGrad.addColorStop(0.3, primaryColor + "0.8)");
      coreGrad.addColorStop(0.8, secondaryColor + "0.4)");
      coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 45 * pulseMagnitude, 0, Math.PI * 2);
      ctx.fill();

      // Render 3D Rotating Particles on sphere
      particles.forEach((p) => {
        p.theta += p.speed * rotSpeed;

        // Spherical to 3D Cartesian coordinates
        const x = p.radius * Math.sin(p.phi) * Math.cos(p.theta);
        const y = p.radius * Math.sin(p.phi) * Math.sin(p.theta);
        const z = p.radius * Math.cos(p.phi);

        // Simple 3D rotation around Y and X axis
        const rotY_X = x * Math.cos(time * 0.4 * rotSpeed) + z * Math.sin(time * 0.4 * rotSpeed);
        const rotY_Z = -x * Math.sin(time * 0.4 * rotSpeed) + z * Math.cos(time * 0.4 * rotSpeed);

        const rotX_Y = y * Math.cos(0.4) - rotY_Z * Math.sin(0.4);
        const rotX_Z = y * Math.sin(0.4) + rotY_Z * Math.cos(0.4);

        // Perspective projection
        const depth = (rotX_Z + 140) / 280; // normalized 0 to 1
        const projX = centerX + rotY_X * pulseMagnitude;
        const projY = centerY + rotX_Y * pulseMagnitude;

        if (depth > 0) {
          ctx.beginPath();
          ctx.arc(projX, projY, p.size * Math.max(0.5, depth), 0, Math.PI * 2);
          const alpha = Math.min(1, Math.max(0.2, depth * 0.9));
          ctx.fillStyle = depth > 0.5 ? primaryColor + `${alpha})` : secondaryColor + `${alpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = primaryColor + "1)";
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      // Soundwave frequency bars if speaking
      if (state === "speaking" || isAudioPlaying) {
        const barCount = 16;
        const barWidth = 3;
        const spacing = 7;
        const totalW = barCount * spacing;
        const startX = centerX - totalW / 2;

        for (let b = 0; b < barCount; b++) {
          const barHeight =
            12 + Math.sin(time * 12 + b * 0.6) * 10 + Math.random() * 8;
          ctx.fillStyle = "rgba(6, 182, 212, 0.85)";
          ctx.fillRect(
            startX + b * spacing,
            centerY + 85 - barHeight / 2,
            barWidth,
            barHeight
          );
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, isAudioPlaying]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Glow Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent rounded-3xl blur-2xl -z-10 pointer-events-none" />

      {/* Main Hologram Canvas */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="w-full h-full drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]"
        />

        {/* Center Digital Silhouette Avatar Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-28 h-28 rounded-full border border-cyan-400/40 p-1 flex items-center justify-center bg-slate-950/40 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <div className="w-full h-full rounded-full overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-cyan-950/80 via-slate-900 to-indigo-950/80">
              {/* Silhouette SVG Avatar */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-16 h-16 text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              >
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                {/* Cyber Visor Eye Line */}
                <line
                  x1="9"
                  y1="7"
                  x2="15"
                  y2="7"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              </svg>

              {/* Scanning Laser Line */}
              <div className="absolute inset-x-0 h-[2px] bg-cyan-400/80 shadow-[0_0_10px_#22d3ee] animate-bounce opacity-70" />
            </div>

            {/* Orbiting Mini Pulse Dot */}
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-[0_0_10px_#22d3ee] animate-ping" />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 border-2 border-slate-950" />
          </div>
        </div>
      </div>

      {/* State Status Badge */}
      <div className="mt-1 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md text-xs font-mono tracking-wider shadow-inner">
        {state === "idle" && (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-cyan-300">ANIK AI CLONE • ONLINE</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400 ml-1" />
          </>
        )}
        {state === "listening" && (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-300 font-semibold">LISTENING TO YOU...</span>
            <Mic className="w-3.5 h-3.5 text-emerald-400 ml-1 animate-pulse" />
          </>
        )}
        {state === "thinking" && (
          <>
            <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping" />
            <span className="text-fuchsia-300 font-semibold">NEURAL SYNAPSE REASONING...</span>
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 ml-1 animate-spin" />
          </>
        )}
        {state === "speaking" && (
          <>
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span className="text-blue-300 font-semibold">VOICE SYNTHESIS ACTIVE</span>
            <Volume2 className="w-3.5 h-3.5 text-blue-400 ml-1 animate-bounce" />
          </>
        )}
      </div>
    </div>
  );
};
