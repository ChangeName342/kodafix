import { useEffect, useRef } from "react";

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, animId: number;
    type Pt = { x: number; y: number; vx: number; vy: number; r: number; c: string };
    let pts: Pt[] = [];
    const COLORS = ["168,85,247", "6,182,212", "236,72,153", "249,115,22"];
    const c = canvas as HTMLCanvasElement;
    const x = ctx as CanvasRenderingContext2D;

    function resize() {
      W = c.width = window.innerWidth;
      H = c.height = window.innerHeight;
      pts = Array.from({ length: 55 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.5,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    }

    function draw() {
      x.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        x.beginPath();
        x.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        x.fillStyle = `rgba(${p.c},.7)`;
        x.fill();
      });
      pts.forEach((a, i) =>
        pts.slice(i + 1).forEach((b) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            x.beginPath();
            x.moveTo(a.x, a.y);
            x.lineTo(b.x, b.y);
            x.strokeStyle = `rgba(168,85,247,${0.12 * (1 - d / 130)})`;
            x.lineWidth = 0.5;
            x.stroke();
          }
        })
      );
      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}