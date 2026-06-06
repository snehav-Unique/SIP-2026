import { useEffect, useRef } from "react";

interface Dot {
  baseX: number;
  baseY: number;
  pulse: number;
  delay: number;
}

interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

const DOT_SPACING = 34;
const INTERACTION_RADIUS = 150;
const PRIMARY_ORANGE = "249, 115, 22";

export function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<PointerState>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let dots: Dot[] = [];
    let time = 0;

    const buildGrid = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const columns = Math.ceil(window.innerWidth / DOT_SPACING) + 2;
      const rows = Math.ceil(window.innerHeight / DOT_SPACING) + 2;
      dots = [];

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          dots.push({
            baseX: column * DOT_SPACING - DOT_SPACING,
            baseY: row * DOT_SPACING - DOT_SPACING,
            pulse: Math.random() * Math.PI * 2,
            delay: (row + column) * 0.045,
          });
        }
      }
    };

    const updatePointer = (x: number, y: number) => {
      pointerRef.current = { x, y, active: true };
    };

    const handlePointerMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      updatePointer(touch.clientX, touch.clientY);
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    const draw = () => {
      time += 0.018;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const pointer = pointerRef.current;

      dots.forEach((dot) => {
        const distanceX = dot.baseX - pointer.x;
        const distanceY = dot.baseY - pointer.y;
        const distance = Math.hypot(distanceX, distanceY);
        const influence =
          pointer.active && distance < INTERACTION_RADIUS
            ? 1 - distance / INTERACTION_RADIUS
            : 0;

        const angle = Math.atan2(distanceY, distanceX);
        const ripple = Math.sin(time * 3.2 - distance * 0.045);
        const displacement = influence * (26 + ripple * 9);
        const x = dot.baseX + Math.cos(angle) * displacement;
        const y = dot.baseY + Math.sin(angle) * displacement;
        const wave = (Math.sin(time + dot.delay + dot.pulse) + 1) / 2;
        const radius = 1.15 + wave * 0.9 + influence * 2.4;
        const opacity = 0.18 + wave * 0.12 + influence * 0.42;

        if (influence > 0.1) {
          ctx.beginPath();
          ctx.arc(x, y, radius * 5.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${PRIMARY_ORANGE}, ${influence * 0.09})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PRIMARY_ORANGE}, ${opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    buildGrid();
    draw();

    window.addEventListener("resize", buildGrid);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handlePointerLeave);

    return () => {
      window.removeEventListener("resize", buildGrid);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none bg-white"
    />
  );
}
