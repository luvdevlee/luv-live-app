"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "@/hooks";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Thiết lập canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Tạo particles
    const createParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.6 + 0.1,
          hue: Math.random() * 60 + 200, // Blue to purple range
        });
      }
      
      particlesRef.current = particles;
    };

    createParticles();

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      
      if (theme === "dark") {
        gradient.addColorStop(0, "rgba(10, 10, 10, 1)");
        gradient.addColorStop(0.3, "rgba(15, 15, 35, 0.9)");
        gradient.addColorStop(0.6, "rgba(20, 25, 50, 0.8)");
        gradient.addColorStop(1, "rgba(25, 30, 60, 0.7)");
      } else {
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.3, "rgba(248, 250, 252, 0.9)");
        gradient.addColorStop(0.6, "rgba(241, 245, 249, 0.8)");
        gradient.addColorStop(1, "rgba(226, 232, 240, 0.7)");
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floating gradient orbs
      const time = Date.now() * 0.0005;
      
      // Large orb 1
      const orb1X = canvas.width * 0.2 + Math.sin(time) * 100;
      const orb1Y = canvas.height * 0.3 + Math.cos(time * 0.8) * 80;
      
      const orbGradient1 = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, 300);
      orbGradient1.addColorStop(0, theme === "dark" ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.1)");
      orbGradient1.addColorStop(1, "rgba(59, 130, 246, 0)");
      
      ctx.fillStyle = orbGradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Large orb 2
      const orb2X = canvas.width * 0.8 + Math.sin(time * 1.2) * 120;
      const orb2Y = canvas.height * 0.7 + Math.cos(time * 0.6) * 100;
      
      const orbGradient2 = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, 250);
      orbGradient2.addColorStop(0, theme === "dark" ? "rgba(139, 92, 246, 0.12)" : "rgba(139, 92, 246, 0.08)");
      orbGradient2.addColorStop(1, "rgba(139, 92, 246, 0)");
      
      ctx.fillStyle = orbGradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animate particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) particle.speedX *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.speedY *= -1;

        // Pulsing effect
        const pulseOpacity = particle.opacity + Math.sin(time * 2 + index) * 0.2;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 70%, ${theme === "dark" ? "70%" : "50%"}, ${Math.max(0, pulseOpacity)})`;
        ctx.fill();

        // Draw connection lines
        particlesRef.current.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const distance = Math.sqrt(
              Math.pow(particle.x - otherParticle.x, 2) + 
              Math.pow(particle.y - otherParticle.y, 2)
            );

            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `hsla(${particle.hue}, 50%, ${theme === "dark" ? "60%" : "40%"}, ${0.1 * (1 - distance / 100)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
      });

      // Subtle geometric patterns
      const drawGeometricPattern = () => {
        ctx.strokeStyle = theme === "dark" ? "rgba(59, 130, 246, 0.05)" : "rgba(59, 130, 246, 0.03)";
        ctx.lineWidth = 1;
        
        const spacing = 150;
        for (let x = 0; x < canvas.width; x += spacing) {
          for (let y = 0; y < canvas.height; y += spacing) {
            const offsetX = Math.sin(time + x * 0.01) * 20;
            const offsetY = Math.cos(time + y * 0.01) * 20;
            
            ctx.beginPath();
            ctx.moveTo(x + offsetX, y + offsetY);
            ctx.lineTo(x + spacing/2 + offsetX, y + spacing/2 + offsetY);
            ctx.stroke();
          }
        }
      };

      drawGeometricPattern();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
      style={{
        background: theme === "dark" 
          ? "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)"
      }}
    />
  );
}
