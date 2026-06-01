import { useEffect, useRef } from "react";

export function EngineeringBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Engineering shapes configuration
    const hexagons: Array<{
      x: number;
      y: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }> = [];

    const circuits: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      offset: number;
      speed: number;
    }> = [];

    const gears: Array<{
      x: number;
      y: number;
      radius: number;
      teeth: number;
      rotation: number;
      speed: number;
    }> = [];

    // Initialize hexagons (representing structure and honeycomb patterns)
    for (let i = 0; i < 15; i++) {
      hexagons.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 30 + Math.random() * 60,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.003,
        opacity: 0.12 + Math.random() * 0.12,
      });
    }

    // Initialize circuit paths (representing connectivity and logic)
    for (let i = 0; i < 10; i++) {
      circuits.push({
        x1: Math.random() * canvas.width,
        y1: Math.random() * canvas.height,
        x2: Math.random() * canvas.width,
        y2: Math.random() * canvas.height,
        offset: 0,
        speed: 0.3 + Math.random() * 0.4,
      });
    }

    // Initialize gears (representing mechanical precision)
    for (let i = 0; i < 8; i++) {
      gears.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 25 + Math.random() * 40,
        teeth: 8 + Math.floor(Math.random() * 8),
        rotation: 0,
        speed: (Math.random() - 0.5) * 0.005,
      });
    }

    // Draw hexagon
    const drawHexagon = (
      x: number,
      y: number,
      size: number,
      rotation: number,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = size * Math.cos(angle);
        const py = size * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(249, 115, 22, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    };

    // Draw circuit line with moving dots
    const drawCircuit = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      offset: number
    ) => {
      // Main line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "rgba(249, 115, 22, 0.15)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Moving dot on the line
      const t = (offset % 100) / 100;
      const dotX = x1 + (x2 - x1) * t;
      const dotY = y1 + (y2 - y1) * t;

      ctx.beginPath();
      ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(249, 115, 22, 0.4)";
      ctx.fill();

      // Add glow effect
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(249, 115, 22, 0.3)";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Small nodes at endpoints
      ctx.beginPath();
      ctx.arc(x1, y1, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(249, 115, 22, 0.25)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x2, y2, 5, 0, Math.PI * 2);
      ctx.fill();
    };

    // Draw gear
    const drawGear = (
      x: number,
      y: number,
      radius: number,
      teeth: number,
      rotation: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      ctx.beginPath();
      const toothHeight = radius * 0.2;
      const toothWidth = (Math.PI * 2) / (teeth * 2);

      for (let i = 0; i < teeth; i++) {
        const angle = (Math.PI * 2 * i) / teeth;
        const nextAngle = (Math.PI * 2 * (i + 1)) / teeth;

        // Outer tooth edge
        const x1 = (radius + toothHeight) * Math.cos(angle + toothWidth / 2);
        const y1 = (radius + toothHeight) * Math.sin(angle + toothWidth / 2);
        const x2 = (radius + toothHeight) * Math.cos(nextAngle - toothWidth / 2);
        const y2 = (radius + toothHeight) * Math.sin(nextAngle - toothWidth / 2);

        // Inner tooth edge
        const x3 = radius * Math.cos(nextAngle - toothWidth / 2);
        const y3 = radius * Math.sin(nextAngle - toothWidth / 2);
        const x4 = radius * Math.cos(angle + toothWidth / 2);
        const y4 = radius * Math.sin(angle + toothWidth / 2);

        if (i === 0) ctx.moveTo(x4, y4);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(249, 115, 22, 0.18)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Center circle
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(249, 115, 22, 0.18)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    };

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update hexagons
      hexagons.forEach((hex) => {
        drawHexagon(hex.x, hex.y, hex.size, hex.rotation, hex.opacity);
        hex.rotation += hex.rotationSpeed;

        // Slow drift movement
        hex.x += Math.sin(hex.rotation) * 0.3;
        hex.y += Math.cos(hex.rotation) * 0.3;

        // Wrap around screen
        if (hex.x < -100) hex.x = canvas.width + 100;
        if (hex.x > canvas.width + 100) hex.x = -100;
        if (hex.y < -100) hex.y = canvas.height + 100;
        if (hex.y > canvas.height + 100) hex.y = -100;
      });

      // Draw and update circuits
      circuits.forEach((circuit) => {
        drawCircuit(circuit.x1, circuit.y1, circuit.x2, circuit.y2, circuit.offset);
        circuit.offset += circuit.speed;
      });

      // Draw and update gears
      gears.forEach((gear) => {
        drawGear(gear.x, gear.y, gear.radius, gear.teeth, gear.rotation);
        gear.rotation += gear.speed;
      });

      // Draw grid pattern
      ctx.strokeStyle = "rgba(249, 115, 22, 0.06)";
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
