'use client';

import React, { useEffect, useRef, useState } from 'react';

interface RobotWalkingDividerProps {
  direction?: 'right-to-left' | 'left-to-right';
  speed?: number;
  label?: string;
  className?: string;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxLife: number;
  life: number;
  color: string;
  type: 'fire' | 'sparkle' | 'ring';

  constructor(x: number, y: number, vx: number, vy: number, size: number, color: string, life: number, type: 'fire' | 'sparkle' | 'ring' = 'fire') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.maxLife = life;
    this.life = life;
    this.color = color;
    this.type = type;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    if (this.type === 'fire') {
      this.size *= 0.93;
    } else if (this.type === 'sparkle') {
      this.size *= 0.96;
    } else if (this.type === 'ring') {
      this.size += 1.2;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const progress = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = progress;

    if (this.type === 'fire') {
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, Math.max(1, this.size));
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, this.color);
      grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.5, this.size), 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'sparkle') {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'ring') {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = Math.max(0.8, 2.5 * progress);
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.size * 1.5, this.size * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

export default function RobotWalkingDivider({
  direction = 'right-to-left',
  speed = 1.0,
  label,
  className = '',
}: RobotWalkingDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let lastTimestamp = 0;

    // Load NISB Logo for the Robot's chest
    const logoImg = new Image();
    logoImg.src = '/icon.png';
    let logoLoaded = false;
    logoImg.onload = () => {
      logoLoaded = true;
    };
    if (logoImg.complete) {
      logoLoaded = true;
    }

    const getAccentColors = () => {
      if (typeof window === 'undefined') return { glow: '#00d2ff', dark: '#0066aa' };
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      if (accent) {
        return { glow: accent, dark: '#005588' };
      }
      return { glow: '#00d2ff', dark: '#0066aa' };
    };

    let themeColors = getAccentColors();

    const handleThemeChange = () => {
      themeColors = getAccentColors();
    };
    window.addEventListener('nisb:themeChange', handleThemeChange);

    const isR2L = direction === 'right-to-left';

    const particles: Particle[] = [];

    const state = {
      time: 0,
      robotX: 0,
      baseY: 50,
      hoverY: 50,
      scale: 0.32,
      tilt: 0,
      bobAngle: 0,
      armSwing: 0,
      legSway: 0,
      flameFlicker: 0,
      blinkTimer: 0,
      isBlinking: false,
      isWaving: false,
      waveTimer: 0,
      hasWaved: false,
      turnProgress: 0,
      expression: 'default' as 'default' | 'happy' | 'alert' | 'joy' | 'curious',
    };

    function resize() {
      if (!canvas || !containerRef.current) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width > 0 ? rect.width : (typeof window !== 'undefined' ? window.innerWidth : 800);
      height = rect.height > 0 ? rect.height : 100;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.scale(dpr, dpr);

      state.baseY = height * 0.44;
      state.scale = Math.min(0.36, Math.max(0.26, height / 290));

      if (state.robotX === 0) {
        state.robotX = isR2L ? width + 60 : -60;
      }
    }

    resize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && container) {
      resizeObserver = new ResizeObserver(() => {
        resize();
      });
      resizeObserver.observe(container);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('nisb:landingReady', resize);

    const timer1 = setTimeout(resize, 100);
    const timer2 = setTimeout(resize, 1200);

    // ── STYLING HELPERS ──
    const strokeColor = '#000000';
    const strokeW = 3.2;
    const whiteBody = '#f4f6f9';
    const slateJoint = '#a2b6c1';

    function drawShadow(botX: number, botY: number, groundY: number, sc: number) {
      ctx!.save();
      const distToGround = Math.max(20, groundY - botY);
      const shadowScale = Math.max(0.35, 1.05 - distToGround / 280) * sc;
      const shadowAlpha = Math.max(0.1, 0.42 - distToGround / 400);

      ctx!.translate(botX, groundY);
      ctx!.scale(shadowScale, shadowScale * 0.3);

      const grad = ctx!.createRadialGradient(0, 0, 0, 0, 0, 55);
      grad.addColorStop(0, `rgba(0, 0, 0, ${shadowAlpha})`);
      grad.addColorStop(0.6, `rgba(6, 182, 212, ${shadowAlpha * 0.25})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx!.fillStyle = grad;
      ctx!.beginPath();
      ctx!.arc(0, 0, 55, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    function drawJetFlames(cyanColor: string) {
      const flameColor = cyanColor;
      const innerFlame = '#e0f2fe';
      const leftX = -26;
      const rightX = 26;
      const baseY = 108;

      [leftX, rightX].forEach((fx, idx) => {
        ctx!.save();
        ctx!.translate(fx, baseY);

        const flicker = Math.sin(state.flameFlicker + idx * 2.5) * 4;
        const flameH = 34 + flicker;

        ctx!.fillStyle = flameColor;
        ctx!.beginPath();
        ctx!.moveTo(-13, 0);
        ctx!.quadraticCurveTo(-16, flameH * 0.4, -9, flameH * 0.7);
        ctx!.quadraticCurveTo(-12, flameH * 0.85, -5, flameH);
        ctx!.quadraticCurveTo(0, flameH + 7, 4, flameH * 0.75);
        ctx!.quadraticCurveTo(7, flameH * 0.95, 11, flameH * 0.6);
        ctx!.quadraticCurveTo(15, flameH * 0.3, 13, 0);
        ctx!.closePath();
        ctx!.fill();

        ctx!.fillStyle = innerFlame;
        ctx!.beginPath();
        ctx!.moveTo(-7, 0);
        ctx!.quadraticCurveTo(-7, flameH * 0.4, -3, flameH * 0.65);
        ctx!.quadraticCurveTo(0, flameH * 0.75, 3, flameH * 0.55);
        ctx!.quadraticCurveTo(7, flameH * 0.3, 7, 0);
        ctx!.closePath();
        ctx!.fill();

        ctx!.restore();
      });
    }

    function drawLegs() {
      ctx!.save();
      ctx!.lineWidth = strokeW;
      ctx!.strokeStyle = strokeColor;
      ctx!.fillStyle = slateJoint;

      const swayL = Math.sin(state.legSway) * 2;
      const swayR = -Math.sin(state.legSway) * 2;

      // Left Leg
      ctx!.save();
      ctx!.translate(-26, 48);
      ctx!.rotate((swayL * Math.PI) / 180);
      ctx!.beginPath();
      ctx!.moveTo(0, 0);
      ctx!.quadraticCurveTo(-15, 26, -14, 58);
      ctx!.lineTo(11, 58);
      ctx!.quadraticCurveTo(9, 26, 0, 0);
      ctx!.closePath();
      ctx!.fill();
      ctx!.stroke();
      ctx!.restore();

      // Right Leg
      ctx!.save();
      ctx!.translate(26, 48);
      ctx!.rotate((swayR * Math.PI) / 180);
      ctx!.beginPath();
      ctx!.moveTo(0, 0);
      ctx!.quadraticCurveTo(-9, 26, -11, 58);
      ctx!.lineTo(14, 58);
      ctx!.quadraticCurveTo(15, 26, 0, 0);
      ctx!.closePath();
      ctx!.fill();
      ctx!.stroke();
      ctx!.restore();

      ctx!.restore();
    }

    function drawArms(isWaving = false, waveTimer = 0) {
      const armWave = Math.sin(state.armSwing) * 0.08;

      ctx!.save();
      ctx!.lineWidth = strokeW;
      ctx!.strokeStyle = strokeColor;

      // Left Arm
      ctx!.save();
      ctx!.translate(-38, -4);
      ctx!.rotate(-armWave - 0.15);

      ctx!.fillStyle = whiteBody;
      ctx!.beginPath();
      ctx!.moveTo(0, 0);
      ctx!.lineTo(-11, 15);
      ctx!.stroke();

      ctx!.fillStyle = slateJoint;
      ctx!.beginPath();
      ctx!.moveTo(-9, 15);
      ctx!.quadraticCurveTo(-32, 38, -26, 50);
      ctx!.lineTo(-4, 50);
      ctx!.quadraticCurveTo(8, 34, -7, 15);
      ctx!.closePath();
      ctx!.fill();
      ctx!.stroke();
      ctx!.restore();

      // Right Arm (Normal side vs Active High Wave! 👋)
      if (isWaving) {
        // High waving right arm
        const waveAngle = Math.sin(state.time * 11) * 0.45;
        ctx!.save();
        ctx!.translate(38, -12);

        // Shoulder joint
        ctx!.fillStyle = whiteBody;
        ctx!.beginPath();
        ctx!.arc(0, 0, 8, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.stroke();

        // Upper arm raised high
        const rElbowX = 22;
        const rElbowY = -26;
        ctx!.beginPath();
        ctx!.moveTo(0, 0);
        ctx!.lineTo(rElbowX, rElbowY);
        ctx!.stroke();

        // Forearm & waving hand
        ctx!.save();
        ctx!.translate(rElbowX, rElbowY);
        ctx!.rotate(-Math.PI / 2 + waveAngle);

        ctx!.fillStyle = slateJoint;
        ctx!.beginPath();
        ctx!.roundRect(0, -6, 26, 12, 5);
        ctx!.fill();
        ctx!.stroke();

        // Hand
        ctx!.fillStyle = '#ffffff';
        ctx!.beginPath();
        ctx!.ellipse(30, 0, 6, 6.5, 0, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.stroke();

        ctx!.restore();
        ctx!.restore();
      } else {
        // Normal floating arm
        ctx!.save();
        ctx!.translate(38, -4);
        ctx!.rotate(armWave + 0.15);

        ctx!.fillStyle = whiteBody;
        ctx!.beginPath();
        ctx!.moveTo(0, 0);
        ctx!.lineTo(11, 15);
        ctx!.stroke();

        ctx!.fillStyle = slateJoint;
        ctx!.beginPath();
        ctx!.moveTo(9, 15);
        ctx!.quadraticCurveTo(32, 38, 26, 50);
        ctx!.lineTo(4, 50);
        ctx!.quadraticCurveTo(-8, 34, 7, 15);
        ctx!.closePath();
        ctx!.fill();
        ctx!.stroke();
        ctx!.restore();
      }

      ctx!.restore();
    }

    function drawPelvis() {
      ctx!.save();
      ctx!.lineWidth = strokeW;
      ctx!.strokeStyle = strokeColor;

      // Waist Joint Ring
      ctx!.fillStyle = slateJoint;
      ctx!.beginPath();
      ctx!.roundRect(-22, 22, 44, 10, 4);
      ctx!.fill();
      ctx!.stroke();

      // Pelvis Body
      ctx!.fillStyle = whiteBody;
      ctx!.beginPath();
      ctx!.moveTo(-28, 30);
      ctx!.lineTo(-32, 48);
      ctx!.lineTo(-10, 52);
      ctx!.lineTo(10, 52);
      ctx!.lineTo(32, 48);
      ctx!.lineTo(28, 30);
      ctx!.closePath();
      ctx!.fill();
      ctx!.stroke();

      ctx!.restore();
    }

    function drawChest(cyanColor: string) {
      ctx!.save();
      ctx!.lineWidth = strokeW;
      ctx!.strokeStyle = strokeColor;
      ctx!.fillStyle = whiteBody;

      // Chest Chassis Outline
      ctx!.beginPath();
      ctx!.moveTo(-44, -14);
      ctx!.lineTo(-33, 25);
      ctx!.quadraticCurveTo(0, 30, 33, 25);
      ctx!.lineTo(44, -14);
      ctx!.quadraticCurveTo(0, -22, -44, -14);
      ctx!.closePath();
      ctx!.fill();
      ctx!.stroke();

      // ── NISB LOGO ON ROBOT CHEST ──
      const badgeCenterX = 0;
      const badgeCenterY = 4;
      const badgeRadius = 14;

      // Outer Chrome Rim / Badge Frame
      ctx!.fillStyle = '#0f172a';
      ctx!.beginPath();
      ctx!.arc(badgeCenterX, badgeCenterY, badgeRadius + 2.5, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.stroke();

      // Glowing Theme Ambient Halo behind Logo
      ctx!.save();
      ctx!.shadowColor = cyanColor;
      ctx!.shadowBlur = 10;
      ctx!.fillStyle = cyanColor;
      ctx!.beginPath();
      ctx!.arc(badgeCenterX, badgeCenterY, badgeRadius + 0.5, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();

      // Inner Badge Base (Pure White circle for high contrast logo)
      ctx!.fillStyle = '#ffffff';
      ctx!.beginPath();
      ctx!.arc(badgeCenterX, badgeCenterY, badgeRadius, 0, Math.PI * 2);
      ctx!.fill();

      // Render NISB Logo Image clipped to circular medallion
      if (logoLoaded && logoImg.width > 0) {
        ctx!.save();
        ctx!.beginPath();
        ctx!.arc(badgeCenterX, badgeCenterY, badgeRadius - 1.5, 0, Math.PI * 2);
        ctx!.clip();

        const imgSize = (badgeRadius - 1.5) * 2;
        ctx!.drawImage(
          logoImg,
          badgeCenterX - imgSize / 2,
          badgeCenterY - imgSize / 2,
          imgSize,
          imgSize
        );
        ctx!.restore();
      } else {
        // Fallback: NISB Text / Power Core
        ctx!.fillStyle = '#0284c7';
        ctx!.font = '900 8px monospace';
        ctx!.textAlign = 'center';
        ctx!.textBaseline = 'middle';
        ctx!.fillText('NISB', badgeCenterX, badgeCenterY);
      }

      // Glass specular reflection sheen over the chest logo
      ctx!.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx!.beginPath();
      ctx!.arc(badgeCenterX - 4, badgeCenterY - 4, 4, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.restore();
    }

    function drawHead(cyanColor: string, isFrontWaving = false) {
      ctx!.save();
      ctx!.lineWidth = strokeW;
      ctx!.strokeStyle = strokeColor;

      // Chin Collar Ring
      ctx!.fillStyle = slateJoint;
      ctx!.beginPath();
      ctx!.roundRect(-26, -30, 52, 10, 5);
      ctx!.fill();
      ctx!.stroke();

      // Side Ear Cylinders & Nubs
      // Left Ear
      ctx!.fillStyle = slateJoint;
      ctx!.beginPath();
      ctx!.roundRect(-46, -58, 8, 22, 3);
      ctx!.fill();
      ctx!.stroke();

      ctx!.fillStyle = strokeColor;
      ctx!.beginPath();
      ctx!.arc(-47, -47, 3.5, 0, Math.PI * 2);
      ctx!.fill();

      // Right Ear
      ctx!.fillStyle = slateJoint;
      ctx!.beginPath();
      ctx!.roundRect(38, -58, 8, 22, 3);
      ctx!.fill();
      ctx!.stroke();

      ctx!.fillStyle = strokeColor;
      ctx!.beginPath();
      ctx!.arc(47, -47, 3.5, 0, Math.PI * 2);
      ctx!.fill();

      // Head Helmet (White Outer Shell)
      ctx!.fillStyle = whiteBody;
      ctx!.beginPath();
      ctx!.roundRect(-38, -72, 76, 50, 16);
      ctx!.fill();
      ctx!.stroke();

      // Black OLED Visor Screen
      ctx!.fillStyle = '#05070b';
      ctx!.beginPath();
      ctx!.roundRect(-30, -66, 60, 38, 12);
      ctx!.fill();
      ctx!.stroke();

      // Visor Screen Eyes / Expressions
      drawScreenFace(cyanColor, isFrontWaving);

      ctx!.restore();
    }

    function drawScreenFace(cyanColor: string, isFrontWaving = false) {
      ctx!.save();
      const eyeColor = cyanColor;

      ctx!.fillStyle = eyeColor;
      ctx!.strokeStyle = eyeColor;
      ctx!.shadowColor = eyeColor;
      ctx!.shadowBlur = 10;
      ctx!.lineWidth = 3.2;
      ctx!.lineCap = 'round';
      ctx!.lineJoin = 'round';

      if (state.isBlinking) {
        ctx!.beginPath();
        ctx!.moveTo(-16, -46);
        ctx!.lineTo(-6, -46);
        ctx!.moveTo(6, -46);
        ctx!.lineTo(16, -46);
        ctx!.stroke();
        ctx!.restore();
        return;
      }

      // If waving, always show super cute happy smiling "^ ^" eyes!
      if (isFrontWaving) {
        ctx!.beginPath();
        ctx!.arc(-11, -44, 6, Math.PI, 0);
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.arc(11, -44, 6, Math.PI, 0);
        ctx!.stroke();
        ctx!.restore();
        return;
      }

      switch (state.expression) {
        case 'happy': // ^ ^
          ctx!.beginPath();
          ctx!.arc(-11, -44, 6, Math.PI, 0);
          ctx!.stroke();
          ctx!.beginPath();
          ctx!.arc(11, -44, 6, Math.PI, 0);
          ctx!.stroke();
          break;

        case 'alert': // X X
          const d = 4.5;
          ctx!.beginPath();
          ctx!.moveTo(-11 - d, -47 - d);
          ctx!.lineTo(-11 + d, -47 + d);
          ctx!.moveTo(-11 + d, -47 - d);
          ctx!.lineTo(-11 - d, -47 + d);
          ctx!.moveTo(11 - d, -47 - d);
          ctx!.lineTo(11 + d, -47 + d);
          ctx!.moveTo(11 + d, -47 - d);
          ctx!.lineTo(11 - d, -47 + d);
          ctx!.stroke();
          break;

        case 'joy': // > <
          ctx!.beginPath();
          ctx!.moveTo(-15, -51);
          ctx!.lineTo(-7, -46);
          ctx!.lineTo(-15, -41);
          ctx!.moveTo(15, -51);
          ctx!.lineTo(7, -46);
          ctx!.lineTo(15, -41);
          ctx!.stroke();
          break;

        case 'curious': // o _ O
          ctx!.beginPath();
          ctx!.arc(-11, -47, 3.5, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.beginPath();
          ctx!.arc(11, -47, 6, 0, Math.PI * 2);
          ctx!.fill();
          break;

        case 'default':
        default:
          // Vertical capsule pill eyes | |
          ctx!.beginPath();
          ctx!.roundRect(-14, -52, 6, 12, 3);
          ctx!.fill();
          ctx!.beginPath();
          ctx!.roundRect(8, -52, 6, 12, 3);
          ctx!.fill();
          break;
      }

      ctx!.restore();
    }

    function drawSpeechBubble(cyanColor: string, speechPop: number) {
      if (speechPop <= 0.05) return;
      ctx!.save();
      const bubbleY = -95;
      ctx!.translate(12, bubbleY);
      ctx!.scale(speechPop, speechPop);

      const bubbleW = 95;
      const bubbleH = 32;
      const bX = -bubbleW / 2;
      const bY = -bubbleH / 2;

      ctx!.shadowColor = cyanColor;
      ctx!.shadowBlur = 14 * speechPop;
      ctx!.fillStyle = 'rgba(4, 9, 20, 0.94)';
      ctx!.strokeStyle = cyanColor;
      ctx!.lineWidth = 1.8;

      ctx!.beginPath();
      ctx!.roundRect(bX, bY, bubbleW, bubbleH, 10);
      ctx!.fill();
      ctx!.stroke();

      ctx!.beginPath();
      ctx!.moveTo(-6, bY + bubbleH);
      ctx!.lineTo(-12, bY + bubbleH + 7);
      ctx!.lineTo(0, bY + bubbleH);
      ctx!.closePath();
      ctx!.fill();
      ctx!.stroke();

      ctx!.shadowBlur = 0;

      ctx!.font = '900 12.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
      ctx!.textAlign = 'center';
      ctx!.textBaseline = 'middle';
      ctx!.fillStyle = '#ffffff';
      ctx!.fillText('Hii! 👋', 0, 0);

      ctx!.restore();
    }

    function emitThrusterParticles(botX: number, botY: number, sc: number, dir: number) {
      const legOffsets = [-26 * sc, 26 * sc];
      legOffsets.forEach((offsetX) => {
        const footX = botX + offsetX;
        const footY = botY + 110 * sc;

        if (Math.random() < 0.6) {
          const spread = (Math.random() - 0.5) * 6;
          const pVx = -dir * (Math.random() * 2 + 1) + spread * 0.1;
          const pVy = Math.random() * 3 + 2;
          const size = Math.random() * 5 + 2.5;
          const color = Math.random() > 0.3 ? themeColors.glow : '#67e8f9';
          particles.push(new Particle(footX + spread, footY, pVx, pVy, size, color, 20, 'fire'));
        }
      });

      if (Math.random() < 0.04) {
        particles.push(new Particle(botX, height * 0.82, 0, 0, 6, 'rgba(6, 182, 212, 0.35)', 25, 'ring'));
      }
    }

    function animate(timestamp: number) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      state.bobAngle += dt * 3.5;
      state.armSwing += dt * 3.5;
      state.legSway += dt * 2.5;
      state.flameFlicker += dt * 12;

      // Natural blink cycle
      state.blinkTimer += dt * 60;
      if (state.blinkTimer > 200) {
        state.isBlinking = true;
        if (state.blinkTimer > 212) {
          state.isBlinking = false;
          state.blinkTimer = 0;
        }
      }

      const moveSpeed = 110 * speed;
      const wrapPadding = 70;
      const centerX = width * 0.5;

      // Check center crossing for waving greeting
      if (!state.hasWaved && Math.abs(state.robotX - centerX) < 22) {
        state.isWaving = true;
        state.waveTimer = 0;
        state.hasWaved = true;
      }

      let speechPop = 0;

      if (state.isWaving) {
        state.waveTimer += dt;
        state.time += dt * 4;

        if (state.waveTimer < 0.25) {
          state.turnProgress = Math.min(1, state.waveTimer / 0.25);
        } else if (state.waveTimer < 1.9) {
          state.turnProgress = 1;
          speechPop = Math.min(1, (state.waveTimer - 0.25) * 5);
        } else if (state.waveTimer < 2.2) {
          state.turnProgress = Math.max(0, 1 - (state.waveTimer - 1.9) / 0.3);
          speechPop = Math.max(0, 1 - (state.waveTimer - 1.9) * 5);
        } else {
          state.isWaving = false;
          state.turnProgress = 0;
          speechPop = 0;
        }
      } else {
        state.time += dt * 4.0;
        state.turnProgress = 0;

        if (isR2L) {
          state.robotX -= moveSpeed * dt;
          if (state.robotX < -wrapPadding) {
            state.robotX = width + wrapPadding;
            state.hasWaved = false;
          }
        } else {
          state.robotX += moveSpeed * dt;
          if (state.robotX > width + wrapPadding) {
            state.robotX = -wrapPadding;
            state.hasWaved = false;
          }
        }
      }

      // Smooth hovering height
      state.hoverY = state.baseY + Math.sin(state.bobAngle) * 6;

      // Dynamic tilt based on movement
      const desiredTilt = state.isWaving ? 0 : (isR2L ? -1 : 1) * 0.08;
      state.tilt += (desiredTilt - state.tilt) * 0.1;

      // Clear Canvas
      ctx!.clearRect(0, 0, width, height);

      const groundY = height * 0.84;

      // Subtle track guideline with gradient
      ctx!.save();
      const trackGrad = ctx!.createLinearGradient(0, 0, width, 0);
      trackGrad.addColorStop(0, 'rgba(255,255,255,0)');
      trackGrad.addColorStop(0.2, 'rgba(255,255,255,0.03)');
      trackGrad.addColorStop(0.5, 'rgba(255,255,255,0.07)');
      trackGrad.addColorStop(0.8, 'rgba(255,255,255,0.03)');
      trackGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx!.fillStyle = trackGrad;
      ctx!.fillRect(0, groundY + 1, width, 1);
      ctx!.restore();

      // 1. Emit & Update Particles
      emitThrusterParticles(state.robotX, state.hoverY, state.scale, isR2L ? -1 : 1);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx!);
        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      // 2. Floor Contact Drop Shadow
      drawShadow(state.robotX, state.hoverY, groundY, state.scale);

      // 3. Render AERO-BOT Companion
      ctx!.save();
      ctx!.translate(state.robotX, state.hoverY);
      ctx!.rotate(state.tilt);

      const isFacingFront = state.turnProgress > 0.5;

      if (!isFacingFront) {
        // Horizontal orientation based on movement direction
        if (isR2L) {
          ctx!.scale(-state.scale, state.scale);
        } else {
          ctx!.scale(state.scale, state.scale);
        }
      } else {
        ctx!.scale(state.scale, state.scale);
      }

      // A. Dual Jet Flames below legs
      drawJetFlames(themeColors.glow);

      // B. Legs
      drawLegs();

      // C. Arms
      drawArms(isFacingFront, state.waveTimer);

      // D. Pelvis & Waist Ring
      drawPelvis();

      // E. Chest with NISB Logo
      drawChest(themeColors.glow);

      // F. Head, Ears & OLED Visor Screen
      drawHead(themeColors.glow, isFacingFront);

      // G. Speech Bubble ("Hii! 👋")
      if (isFacingFront) {
        drawSpeechBubble(themeColors.glow, speechPop);
      }

      ctx!.restore();

      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      if (resizeObserver) resizeObserver.disconnect();
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', resize);
      window.removeEventListener('nisb:landingReady', resize);
      window.removeEventListener('nisb:themeChange', handleThemeChange);
    };
  }, [isVisible, direction, speed]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full z-10 overflow-hidden select-none pointer-events-none h-[85px] sm:h-[105px] md:h-[120px] ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {label && (
        <div className="absolute top-2 left-6 z-10 opacity-30 text-[8px] font-mono tracking-widest uppercase text-white/50 pointer-events-none">
          {label}
        </div>
      )}
    </div>
  );
}
