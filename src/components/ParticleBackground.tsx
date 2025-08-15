// src/components/ParticleBackground.tsx

import React, { useRef, useEffect } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const opts = {
      particleColor: "rgb(200,200,200)",
      lineColor: "rgb(200,200,200)",
      particleAmount: 40,
      defaultSpeed: 1,
      variantSpeed: 1,
      defaultRadius: 2,
      variantRadius: 2,
      linkRadius: 200,
    };

    let particles: any[] = []; // Use any[] for simplicity with this direct port

    class Particle {
      x: number;
      y: number;
      speed: number;
      directionAngle: number;
      color: string;
      radius: number;
      vector: { x: number, y: number };

      constructor(xPos?: number, yPos?: number) {
        this.x = xPos || Math.random() * w;
        this.y = yPos || Math.random() * h;
        this.speed = opts.defaultSpeed + Math.random() * opts.variantSpeed;
        this.directionAngle = Math.floor(Math.random() * 360);
        this.color = opts.particleColor;
        this.radius = opts.defaultRadius + Math.random() * opts.variantRadius;
        this.vector = {
          x: Math.cos(this.directionAngle) * this.speed,
          y: Math.sin(this.directionAngle) * this.speed
        };
      }

      update() {
        this.border();
        this.x += this.vector.x;
        this.y += this.vector.y;
      }

      border() {
        if (this.x >= w || this.x <= 0) {
          this.vector.x *= -1;
        }
        if (this.y >= h || this.y <= 0) {
          this.vector.y *= -1;
        }
        if (this.x > w) this.x = w;
        if (this.y > h) this.y = h;
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    function setup() {
      for (let i = 0; i < opts.particleAmount; i++) {
        particles.push(new Particle());
      }
    }

    function checkDistance(x1: number, y1: number, x2: number, y2: number) {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    function linkPoints(point: Particle, hubs: Particle[]) {
      for (let i = 0; i < hubs.length; i++) {
        let distance = checkDistance(point.x, point.y, hubs[i].x, hubs[i].y);
        let opacity = 1 - distance / opts.linkRadius;
        if (opacity > 0) {
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = `rgba(200, 200, 200, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(hubs[i].x, hubs[i].y);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
    
    let animationFrameId: number;
    
    function loop() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      for (let i = 0; i < particles.length; i++) {
        linkPoints(particles[i], particles.slice(i));
      }
      animationFrameId = requestAnimationFrame(loop);
    }
    
    setup();
    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 bg-dark-blue"
    />
  );
};

export default ParticleBackground;
