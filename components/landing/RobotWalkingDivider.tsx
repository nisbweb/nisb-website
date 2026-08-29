'use client';

import React, { useEffect, useRef, useState } from 'react';

interface RobotWalkingDividerProps {
  direction?: 'right-to-left' | 'left-to-right';
  speed?: number;
  label?: string;
  className?: string;
}

export default function RobotWalkingDivider({
  direction = 'right-to-left',
  speed = 1.0,
  label,
  className = '',
}: RobotWalkingDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '120px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let lastTimestamp = 0;

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

    const CUTE_BOT = {
      pelvisHeight: 146,
      thighLength: 82,
      shinLength: 84,
      strideWidth: 64,
      strideLift: 34,
      headRadius: 42,
      armLength: 88,
    };

    const isR2L = direction === 'right-to-left';

    const state = {
      time: 0,
      robotX: 0,
      scale: 0.22,
      isWaving: false,
      waveTimer: 0,
      hasWaved: false,
      turnProgress: 0, // 0 = profile side walking, 1 = front-facing waving
    };

    function resize() {
      if (!canvas || !containerRef.current) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || 100;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.scale(dpr, dpr);

      state.scale = Math.min(0.24, Math.max(0.18, height / 440));

      if (state.robotX === 0) {
        state.robotX = isR2L ? width + 60 : -60;
      }
    }

    resize();
    window.addEventListener('resize', resize);

    function solveIK(ox: number, oy: number, tx: number, ty: number, l1: number, l2: number, bendDir = 1) {
      const dx = tx - ox;
      const dy = ty - oy;
      let dist = Math.sqrt(dx * dx + dy * dy);

      const maxReach = l1 + l2 - 0.001;
      const minReach = Math.abs(l1 - l2) + 0.001;
      dist = Math.max(minReach, Math.min(maxReach, dist));

      const angleToTarget = Math.atan2(dy, dx);
      const cosAlpha = (l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist);
      const alpha = Math.acos(Math.max(-1, Math.min(1, cosAlpha)));

      const jointAngle = angleToTarget + bendDir * alpha;
      const jx = ox + Math.cos(jointAngle) * l1;
      const jy = oy + Math.sin(jointAngle) * l1;

      return {
        joint: { x: jx, y: jy },
        endAngle: Math.atan2(ty - jy, tx - jx),
        baseAngle: jointAngle,
      };
    }

    function getFootTrajectory(phase: number, strideSpan: number, liftHeight: number) {
      const p = ((phase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      let fx = 0,
        fy = 0,
        pitch = 0;

      if (p < Math.PI) {
        const t = p / Math.PI;
        fx = (0.5 - t) * strideSpan * 2;
        fy = 0;
        pitch = Math.sin((t - 0.5) * Math.PI) * 0.18;
      } else {
        const t = (p - Math.PI) / Math.PI;
        fx = (-0.5 + t) * strideSpan * 2;
        fy = -Math.sin(t * Math.PI) * liftHeight;
        pitch = -Math.sin(t * Math.PI) * 0.42;
      }

      return { x: fx, y: fy, pitch };
    }

    function createGlossyWhiteGrad(x: number, y: number, radius: number, isFar = false) {
      const grad = ctx!.createRadialGradient(
        x - radius * 0.35,
        y - radius * 0.35,
        radius * 0.05,
        x,
        y,
        radius * 1.15
      );
      if (isFar) {
        grad.addColorStop(0, '#e2e8f0');
        grad.addColorStop(0.5, '#cbd5e1');
        grad.addColorStop(0.85, '#94a3b8');
        grad.addColorStop(1, '#64748b');
      } else {
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.35, '#f8fafc');
        grad.addColorStop(0.7, '#e2e8f0');
        grad.addColorStop(0.92, '#cbd5e1');
        grad.addColorStop(1, '#94a3b8');
      }
      return grad;
    }

    function createChromeGrad(x1: number, y1: number, x2: number, y2: number) {
      const grad = ctx!.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, '#475569');
      grad.addColorStop(0.35, '#94a3b8');
      grad.addColorStop(0.55, '#f1f5f9');
      grad.addColorStop(0.75, '#64748b');
      grad.addColorStop(1, '#334155');
      return grad;
    }

    function drawGroundContactShadow(x: number, y: number, footL: { x: number; y: number }, footR: { x: number; y: number }, sc: number, isFront = false) {
      ctx!.save();
      ctx!.translate(x, y);

      const grad = ctx!.createRadialGradient(0, 0, 6, 0, 0, 65 * sc);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
      grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx!.fillStyle = grad;
      ctx!.beginPath();
      ctx!.ellipse(0, 0, (isFront ? 64 : 58) * sc, 10 * sc, 0, 0, Math.PI * 2);
      ctx!.fill();

      if (isFront) {
        // Two standing foot shadows
        [-18, 18].forEach((fx) => {
          ctx!.fillStyle = 'rgba(0, 0, 0, 0.4)';
          ctx!.beginPath();
          ctx!.ellipse(fx * sc, 0, 14 * sc, 5 * sc, 0, 0, Math.PI * 2);
          ctx!.fill();
        });
      } else {
        [footL, footR].forEach((f) => {
          const liftFade = Math.max(0, 1 - Math.abs(f.y) / 30);
          if (liftFade > 0.05) {
            ctx!.fillStyle = `rgba(0, 0, 0, ${0.4 * liftFade})`;
            ctx!.beginPath();
            ctx!.ellipse(f.x * sc, 0, 20 * sc * (1 - Math.abs(f.y) * 0.012), 5 * sc, 0, 0, Math.PI * 2);
            ctx!.fill();
          }
        });
      }

      ctx!.restore();
    }

    // ── SIDE PROFILE DRAW ROUTINES (WALKING) ──
    function drawCuteLeg(hipX: number, hipY: number, footRel: { x: number; y: number; pitch: number }, isFar: boolean) {
      const dir = -1;
      const targetX = hipX + footRel.x * dir;
      const targetY = hipY + CUTE_BOT.pelvisHeight + footRel.y;

      const ik = solveIK(hipX, hipY, targetX, targetY, CUTE_BOT.thighLength, CUTE_BOT.shinLength, 1);
      const knee = ik.joint;

      ctx!.save();

      ctx!.fillStyle = isFar ? '#1e293b' : '#334155';
      ctx!.beginPath();
      ctx!.arc(hipX, hipY, 13, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = createGlossyWhiteGrad(hipX, hipY, 12, isFar);
      ctx!.beginPath();
      ctx!.arc(hipX, hipY, 10.5, 0, Math.PI * 2);
      ctx!.fill();

      const thighAngle = Math.atan2(knee.y - hipY, knee.x - hipX);
      const thighDist = Math.hypot(knee.x - hipX, knee.y - hipY);

      ctx!.save();
      ctx!.translate(hipX, hipY);
      ctx!.rotate(thighAngle);

      ctx!.fillStyle = '#475569';
      ctx!.fillRect(4, -3, thighDist - 8, 6);

      ctx!.fillStyle = createGlossyWhiteGrad(thighDist * 0.5, 0, 18, isFar);
      ctx!.beginPath();
      ctx!.roundRect(4, -10.5, thighDist - 6, 21, [10, 8, 8, 10]);
      ctx!.fill();

      if (!isFar) {
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx!.beginPath();
        ctx!.roundRect(8, -8, thighDist - 16, 4.5, 2);
        ctx!.fill();
      }
      ctx!.restore();

      ctx!.fillStyle = isFar ? '#0f172a' : '#1e293b';
      ctx!.beginPath();
      ctx!.arc(knee.x, knee.y, 11, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = createChromeGrad(knee.x - 9, knee.y - 9, knee.x + 9, knee.y + 9);
      ctx!.beginPath();
      ctx!.arc(knee.x, knee.y, 8.5, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = isFar ? '#64748b' : '#cbd5e1';
      ctx!.beginPath();
      ctx!.arc(knee.x, knee.y, 4, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = createGlossyWhiteGrad(knee.x - 5, knee.y, 12, isFar);
      ctx!.beginPath();
      ctx!.ellipse(knee.x - 7, knee.y, 7, 10, -0.15, 0, Math.PI * 2);
      ctx!.fill();

      const shinAngle = Math.atan2(targetY - knee.y, targetX - knee.x);
      const shinDist = Math.hypot(targetX - knee.x, targetY - knee.y);

      ctx!.save();
      ctx!.translate(knee.x, knee.y);
      ctx!.rotate(shinAngle);

      ctx!.fillStyle = '#334155';
      ctx!.fillRect(4, -3, shinDist - 8, 6);

      ctx!.fillStyle = createGlossyWhiteGrad(shinDist * 0.55, 0, 20, isFar);
      ctx!.beginPath();
      ctx!.moveTo(6, -8);
      ctx!.quadraticCurveTo(shinDist * 0.45, -9, shinDist - 4, -14);
      ctx!.lineTo(shinDist - 4, 14);
      ctx!.quadraticCurveTo(shinDist * 0.45, 9, 6, 8);
      ctx!.closePath();
      ctx!.fill();

      if (!isFar) {
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx!.beginPath();
        ctx!.moveTo(10, -5);
        ctx!.lineTo(shinDist - 10, -9);
        ctx!.lineTo(shinDist - 10, -5);
        ctx!.lineTo(10, -2);
        ctx!.closePath();
        ctx!.fill();
      }
      ctx!.restore();

      ctx!.save();
      ctx!.translate(targetX, targetY);
      ctx!.rotate(footRel.pitch);

      ctx!.fillStyle = createChromeGrad(-8, -10, 8, 10);
      ctx!.beginPath();
      ctx!.arc(0, -6, 7.5, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = createGlossyWhiteGrad(-6, -4, 28, isFar);
      ctx!.beginPath();
      ctx!.moveTo(18, 0);
      ctx!.quadraticCurveTo(20, -16, 4, -16);
      ctx!.quadraticCurveTo(-12, -18, -26, -6);
      ctx!.quadraticCurveTo(-34, 0, -28, 4);
      ctx!.lineTo(16, 4);
      ctx!.quadraticCurveTo(18, 4, 18, 0);
      ctx!.closePath();
      ctx!.fill();

      ctx!.fillStyle = '#1e293b';
      ctx!.beginPath();
      ctx!.roundRect(-27, 2, 44, 4, 2);
      ctx!.fill();

      if (!isFar) {
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx!.beginPath();
        ctx!.ellipse(-14, -10, 9, 3.5, -0.2, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.restore();
      ctx!.restore();
    }

    function drawCuteArm(shoulderX: number, shoulderY: number, armSwingAngle: number, isFar: boolean) {
      const upperLength = 48;
      const foreLength = 46;

      const shoulderAngle = Math.PI / 2 + armSwingAngle * 0.7 - 0.2;
      const elbowX = shoulderX + Math.cos(shoulderAngle) * upperLength;
      const elbowY = shoulderY + Math.sin(shoulderAngle) * upperLength;
      const elbowAngle = shoulderAngle + 0.5 + Math.sin(armSwingAngle) * 0.25;

      ctx!.save();

      ctx!.fillStyle = createGlossyWhiteGrad(shoulderX, shoulderY, 14, isFar);
      ctx!.beginPath();
      ctx!.arc(shoulderX, shoulderY, 12.5, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.save();
      ctx!.translate(shoulderX, shoulderY);
      ctx!.rotate(shoulderAngle);
      ctx!.fillStyle = createGlossyWhiteGrad(upperLength * 0.5, 0, 16, isFar);
      ctx!.beginPath();
      ctx!.ellipse(upperLength * 0.5, 0, upperLength * 0.44, 9.5, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();

      ctx!.fillStyle = createChromeGrad(elbowX - 8, elbowY - 8, elbowX + 8, elbowY + 8);
      ctx!.beginPath();
      ctx!.arc(elbowX, elbowY, 8, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.save();
      ctx!.translate(elbowX, elbowY);
      ctx!.rotate(elbowAngle);
      ctx!.fillStyle = createGlossyWhiteGrad(foreLength * 0.5, 0, 16, isFar);
      ctx!.beginPath();
      ctx!.ellipse(foreLength * 0.5, 0, foreLength * 0.46, 10, 0, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = createChromeGrad(foreLength - 2, -6, foreLength + 4, 6);
      ctx!.beginPath();
      ctx!.arc(foreLength + 3, 0, 6, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = isFar ? '#cbd5e1' : '#f1f5f9';
      ctx!.beginPath();
      ctx!.ellipse(foreLength + 10, 0, 6.5, 5.5, 0, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.strokeStyle = isFar ? '#94a3b8' : '#e2e8f0';
      ctx!.lineWidth = 3;
      ctx!.lineCap = 'round';
      ctx!.beginPath();
      ctx!.moveTo(foreLength + 12, -2);
      ctx!.lineTo(foreLength + 19, -4);
      ctx!.moveTo(foreLength + 11, 2);
      ctx!.lineTo(foreLength + 17, 5);
      ctx!.stroke();

      ctx!.restore();
      ctx!.restore();
    }

    function drawCuteTorsoAndHead(pelvisX: number, pelvisY: number, torsoLean: number, glowColor: string, glowDark: string) {
      ctx!.save();
      ctx!.translate(pelvisX, pelvisY);
      ctx!.rotate(torsoLean);

      // 1. Lower pelvis
      ctx!.fillStyle = createGlossyWhiteGrad(0, -10, 24);
      ctx!.beginPath();
      ctx!.ellipse(0, -8, 22, 16, 0, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = '#334155';
      ctx!.fillRect(-12, -32, 24, 14);

      // 2. Chest Torso
      const chestCenterY = -56;
      ctx!.fillStyle = createGlossyWhiteGrad(-4, chestCenterY, 38);
      ctx!.beginPath();
      ctx!.moveTo(-24, chestCenterY - 24);
      ctx!.quadraticCurveTo(-34, chestCenterY, -24, chestCenterY + 28);
      ctx!.quadraticCurveTo(0, chestCenterY + 34, 24, chestCenterY + 28);
      ctx!.quadraticCurveTo(32, chestCenterY, 22, chestCenterY - 24);
      ctx!.quadraticCurveTo(0, chestCenterY - 30, -24, chestCenterY - 24);
      ctx!.closePath();
      ctx!.fill();

      ctx!.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx!.beginPath();
      ctx!.ellipse(-14, chestCenterY - 14, 12, 6, -0.4, 0, Math.PI * 2);
      ctx!.fill();

      // 3. Glowing Chest Reactor
      ctx!.fillStyle = '#334155';
      ctx!.beginPath();
      ctx!.arc(-8, chestCenterY + 4, 11.5, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = createChromeGrad(-18, chestCenterY - 6, 2, chestCenterY + 14);
      ctx!.beginPath();
      ctx!.arc(-8, chestCenterY + 4, 9.5, 0, Math.PI * 2);
      ctx!.fill();

      const reactorPulse = 0.9 + Math.sin(state.time * 4) * 0.1;
      ctx!.save();
      ctx!.shadowColor = glowColor;
      ctx!.shadowBlur = 10 * reactorPulse;
      ctx!.fillStyle = glowColor;
      ctx!.beginPath();
      ctx!.arc(-8, chestCenterY + 4, 6.5 * reactorPulse, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();

      ctx!.fillStyle = '#ffffff';
      ctx!.beginPath();
      ctx!.arc(-10, chestCenterY + 2, 2, 0, Math.PI * 2);
      ctx!.fill();

      // 4. Metallic Neck Joint
      const neckY = chestCenterY - 30;
      ctx!.fillStyle = createChromeGrad(-10, neckY - 6, 10, neckY + 6);
      ctx!.beginPath();
      ctx!.roundRect(-9, neckY - 8, 18, 12, 4);
      ctx!.fill();

      // 5. Big Cute Dome Head
      const headX = -4;
      const headY = neckY - 38;

      ctx!.save();
      ctx!.translate(headX, headY);
      ctx!.rotate(-0.06);

      ctx!.strokeStyle = '#94a3b8';
      ctx!.lineWidth = 2.5;
      ctx!.beginPath();
      ctx!.moveTo(2, -CUTE_BOT.headRadius + 2);
      ctx!.lineTo(8, -CUTE_BOT.headRadius - 22);
      ctx!.stroke();

      ctx!.fillStyle = glowColor;
      ctx!.shadowColor = glowColor;
      ctx!.shadowBlur = 8;
      ctx!.beginPath();
      ctx!.arc(8, -CUTE_BOT.headRadius - 23, 4.5, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.shadowBlur = 0;

      ctx!.fillStyle = createGlossyWhiteGrad(-10, -10, CUTE_BOT.headRadius + 10);
      ctx!.beginPath();
      ctx!.ellipse(0, 0, CUTE_BOT.headRadius + 4, CUTE_BOT.headRadius - 2, 0, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx!.beginPath();
      ctx!.ellipse(-12, -22, 22, 9, -0.3, 0, Math.PI * 2);
      ctx!.fill();

      // Visor Screen
      ctx!.fillStyle = '#0f172a';
      ctx!.beginPath();
      ctx!.moveTo(-38, -12);
      ctx!.quadraticCurveTo(-42, 6, -28, 18);
      ctx!.quadraticCurveTo(-6, 22, 12, 16);
      ctx!.quadraticCurveTo(22, 2, 18, -14);
      ctx!.quadraticCurveTo(-10, -22, -38, -12);
      ctx!.closePath();
      ctx!.fill();

      ctx!.strokeStyle = '#475569';
      ctx!.lineWidth = 2;
      ctx!.stroke();

      ctx!.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx!.beginPath();
      ctx!.moveTo(-32, -10);
      ctx!.lineTo(-12, -18);
      ctx!.lineTo(-6, -18);
      ctx!.lineTo(-24, -2);
      ctx!.closePath();
      ctx!.fill();

      const eyeBlink = Math.abs(Math.sin(state.time * 0.5)) > 0.98 ? 0.15 : 1.0;

      function drawCuteOcularEye(ex: number, ey: number, rX: number, rY: number) {
        ctx!.save();
        ctx!.translate(ex, ey);
        ctx!.scale(1, eyeBlink);

        ctx!.shadowColor = glowColor;
        ctx!.shadowBlur = 14;
        ctx!.fillStyle = glowColor;
        ctx!.beginPath();
        ctx!.ellipse(0, 0, rX, rY, 0, 0, Math.PI * 2);
        ctx!.fill();

        const eyeGrad = ctx!.createRadialGradient(0, 0, 2, 0, 0, rX);
        eyeGrad.addColorStop(0, '#ffffff');
        eyeGrad.addColorStop(0.4, glowColor);
        eyeGrad.addColorStop(1, glowDark);
        ctx!.fillStyle = eyeGrad;
        ctx!.beginPath();
        ctx!.ellipse(0, 0, rX * 0.9, rY * 0.9, 0, 0, Math.PI * 2);
        ctx!.fill();

        if (eyeBlink > 0.5) {
          ctx!.shadowBlur = 0;
          ctx!.fillStyle = '#ffffff';
          ctx!.beginPath();
          ctx!.arc(-rX * 0.35, -rY * 0.35, rX * 0.35, 0, Math.PI * 2);
          ctx!.fill();

          ctx!.beginPath();
          ctx!.arc(rX * 0.3, rY * 0.3, rX * 0.18, 0, Math.PI * 2);
          ctx!.fill();
        }

        ctx!.restore();
      }

      drawCuteOcularEye(-20, 2, 11, 13);
      drawCuteOcularEye(4, 0, 8.5, 11.5);

      const earX = 26;
      const earY = 2;
      ctx!.fillStyle = createGlossyWhiteGrad(earX, earY, 18);
      ctx!.beginPath();
      ctx!.ellipse(earX, earY, 9, 16, 0.15, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = glowColor;
      ctx!.shadowColor = glowColor;
      ctx!.shadowBlur = 8;
      ctx!.beginPath();
      ctx!.ellipse(earX + 1, earY, 4, 9, 0.15, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.shadowBlur = 0;

      ctx!.restore();
      ctx!.restore();
    }

    // ── 🌟 FRONT-FACING WAVING BOT ROUTINE ("Hii! 👋") ──
    function drawFrontFacingWavingBot(glowColor: string, glowDark: string, waveProgress: number, speechPop: number) {
      const waveAngle = Math.sin(state.time * 11) * 0.42;

      // 1. Standing Legs (Symmetrical Front)
      [-18, 18].forEach((lx) => {
        // Hip Socket
        ctx!.fillStyle = '#334155';
        ctx!.beginPath();
        ctx!.arc(lx, 0, 11, 0, Math.PI * 2);
        ctx!.fill();

        // Thigh
        ctx!.fillStyle = createGlossyWhiteGrad(lx, 35, 16);
        ctx!.beginPath();
        ctx!.roundRect(lx - 9, 4, 18, 54, 9);
        ctx!.fill();

        // Knee Disc
        ctx!.fillStyle = createChromeGrad(lx - 8, 56, lx + 8, 72);
        ctx!.beginPath();
        ctx!.arc(lx, 64, 8.5, 0, Math.PI * 2);
        ctx!.fill();

        // Shin
        ctx!.fillStyle = createGlossyWhiteGrad(lx, 98, 18);
        ctx!.beginPath();
        ctx!.moveTo(lx - 8, 70);
        ctx!.lineTo(lx + 8, 70);
        ctx!.lineTo(lx + 11, 130);
        ctx!.lineTo(lx - 11, 130);
        ctx!.closePath();
        ctx!.fill();

        // Chunky Boot (Front Facing)
        ctx!.fillStyle = createGlossyWhiteGrad(lx, 138, 22);
        ctx!.beginPath();
        ctx!.roundRect(lx - 14, 130, 28, 18, [8, 8, 6, 6]);
        ctx!.fill();

        // Sole
        ctx!.fillStyle = '#1e293b';
        ctx!.beginPath();
        ctx!.roundRect(lx - 15, 144, 30, 4, 2);
        ctx!.fill();
      });

      // 2. Pelvis & Torso (Front Symmetrical)
      ctx!.fillStyle = createGlossyWhiteGrad(0, -8, 24);
      ctx!.beginPath();
      ctx!.ellipse(0, -8, 24, 16, 0, 0, Math.PI * 2);
      ctx!.fill();

      // Waist Joint
      ctx!.fillStyle = '#334155';
      ctx!.fillRect(-14, -30, 28, 12);

      // Chest Torso (Symmetrical Egg)
      const chestY = -54;
      ctx!.fillStyle = createGlossyWhiteGrad(0, chestY, 36);
      ctx!.beginPath();
      ctx!.ellipse(0, chestY, 30, 26, 0, 0, Math.PI * 2);
      ctx!.fill();

      // Chest Specular Sheen
      ctx!.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx!.beginPath();
      ctx!.ellipse(-10, chestY - 10, 10, 5, -0.3, 0, Math.PI * 2);
      ctx!.fill();

      // Glowing Center Core Reactor
      ctx!.fillStyle = '#334155';
      ctx!.beginPath();
      ctx!.arc(0, chestY + 3, 11, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = createChromeGrad(-10, chestY - 7, 10, chestY + 13);
      ctx!.beginPath();
      ctx!.arc(0, chestY + 3, 9, 0, Math.PI * 2);
      ctx!.fill();

      const rPulse = 0.95 + Math.sin(state.time * 5) * 0.12;
      ctx!.save();
      ctx!.shadowColor = glowColor;
      ctx!.shadowBlur = 14 * rPulse;
      ctx!.fillStyle = glowColor;
      ctx!.beginPath();
      ctx!.arc(0, chestY + 3, 6 * rPulse, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();

      ctx!.fillStyle = '#ffffff';
      ctx!.beginPath();
      ctx!.arc(-2, chestY + 1, 2, 0, Math.PI * 2);
      ctx!.fill();

      // 3. Neck
      const neckY = chestY - 26;
      ctx!.fillStyle = createChromeGrad(-8, neckY - 5, 8, neckY + 5);
      ctx!.beginPath();
      ctx!.roundRect(-8, neckY - 7, 16, 10, 3);
      ctx!.fill();

      // 4. Left Arm (Resting on side)
      const lShX = -32;
      const lShY = chestY - 12;
      ctx!.fillStyle = createGlossyWhiteGrad(lShX, lShY, 13);
      ctx!.beginPath();
      ctx!.arc(lShX, lShY, 11, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = createGlossyWhiteGrad(lShX - 4, lShY + 25, 14);
      ctx!.beginPath();
      ctx!.roundRect(lShX - 7, lShY + 4, 14, 40, 7);
      ctx!.fill();

      ctx!.fillStyle = createChromeGrad(lShX - 6, lShY + 40, lShX + 6, lShY + 52);
      ctx!.beginPath();
      ctx!.arc(lShX, lShY + 46, 6.5, 0, Math.PI * 2);
      ctx!.fill();

      // Left hand
      ctx!.fillStyle = '#e2e8f0';
      ctx!.beginPath();
      ctx!.ellipse(lShX, lShY + 56, 5.5, 6, 0, 0, Math.PI * 2);
      ctx!.fill();

      // 5. Right Arm (WAVING UP IN AIR! 👋)
      const rShX = 32;
      const rShY = chestY - 12;
      ctx!.fillStyle = createGlossyWhiteGrad(rShX, rShY, 13);
      ctx!.beginPath();
      ctx!.arc(rShX, rShY, 11, 0, Math.PI * 2);
      ctx!.fill();

      // Upper arm raised up diagonally
      const rElbowX = rShX + 22;
      const rElbowY = rShY - 28;

      ctx!.save();
      ctx!.translate(rShX, rShY);
      const upperAngle = Math.atan2(rElbowY - rShY, rElbowX - rShX);
      ctx!.rotate(upperAngle);
      ctx!.fillStyle = createGlossyWhiteGrad(18, 0, 14);
      ctx!.beginPath();
      ctx!.roundRect(2, -6.5, 32, 13, 6);
      ctx!.fill();
      ctx!.restore();

      // Elbow Chrome Joint
      ctx!.fillStyle = createChromeGrad(rElbowX - 7, rElbowY - 7, rElbowX + 7, rElbowY + 7);
      ctx!.beginPath();
      ctx!.arc(rElbowX, rElbowY, 7.5, 0, Math.PI * 2);
      ctx!.fill();

      // Forearm & Waving Hand
      ctx!.save();
      ctx!.translate(rElbowX, rElbowY);
      // Oscillate forearm left and right
      ctx!.rotate(-Math.PI / 2 + waveAngle);

      ctx!.fillStyle = createGlossyWhiteGrad(16, 0, 14);
      ctx!.beginPath();
      ctx!.roundRect(2, -6, 28, 12, 6);
      ctx!.fill();

      // Wrist Chrome ring
      ctx!.fillStyle = createChromeGrad(28, -5, 34, 5);
      ctx!.beginPath();
      ctx!.arc(30, 0, 5, 0, Math.PI * 2);
      ctx!.fill();

      // Cute Open Waving Hand & Fingers
      ctx!.fillStyle = '#ffffff';
      ctx!.beginPath();
      ctx!.ellipse(36, 0, 6, 6.5, 0, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.strokeStyle = '#cbd5e1';
      ctx!.lineWidth = 2.5;
      ctx!.lineCap = 'round';
      // Splayed fingers
      [-4, -1.5, 1.5, 4].forEach((fy) => {
        ctx!.beginPath();
        ctx!.moveTo(38, fy);
        ctx!.lineTo(44, fy * 1.3);
        ctx!.stroke();
      });
      // Thumb
      ctx!.beginPath();
      ctx!.moveTo(35, 5);
      ctx!.lineTo(39, 9);
      ctx!.stroke();

      ctx!.restore();

      // 6. Cute Head (Front Facing)
      const headY = neckY - 36;
      ctx!.save();
      ctx!.translate(0, headY);

      // Antenna
      ctx!.strokeStyle = '#94a3b8';
      ctx!.lineWidth = 2.5;
      ctx!.beginPath();
      ctx!.moveTo(0, -CUTE_BOT.headRadius + 2);
      ctx!.lineTo(0, -CUTE_BOT.headRadius - 20);
      ctx!.stroke();

      ctx!.fillStyle = glowColor;
      ctx!.shadowColor = glowColor;
      ctx!.shadowBlur = 10;
      ctx!.beginPath();
      ctx!.arc(0, -CUTE_BOT.headRadius - 21, 5, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.shadowBlur = 0;

      // Outer Dome Helmet (Front)
      ctx!.fillStyle = createGlossyWhiteGrad(0, -6, CUTE_BOT.headRadius + 8);
      ctx!.beginPath();
      ctx!.ellipse(0, 0, CUTE_BOT.headRadius + 4, CUTE_BOT.headRadius - 3, 0, 0, Math.PI * 2);
      ctx!.fill();

      // Top Specular Crescent
      ctx!.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx!.beginPath();
      ctx!.ellipse(-6, -20, 20, 8, -0.2, 0, Math.PI * 2);
      ctx!.fill();

      // Ears (Headphone pods on left & right)
      [-1, 1].forEach((dir) => {
        const ex = dir * (CUTE_BOT.headRadius + 4);
        ctx!.fillStyle = createGlossyWhiteGrad(ex, 0, 16);
        ctx!.beginPath();
        ctx!.ellipse(ex, 0, 6, 14, 0, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.fillStyle = glowColor;
        ctx!.shadowColor = glowColor;
        ctx!.shadowBlur = 6;
        ctx!.beginPath();
        ctx!.ellipse(ex, 0, 2.5, 8, 0, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.shadowBlur = 0;
      });

      // Visor Screen (Front Centered)
      ctx!.fillStyle = '#0f172a';
      ctx!.beginPath();
      ctx!.roundRect(-30, -14, 60, 28, 13);
      ctx!.fill();

      ctx!.strokeStyle = '#475569';
      ctx!.lineWidth = 1.8;
      ctx!.stroke();

      // Visor Glare
      ctx!.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx!.beginPath();
      ctx!.moveTo(-22, -10);
      ctx!.lineTo(6, -10);
      ctx!.lineTo(-8, 8);
      ctx!.lineTo(-26, 8);
      ctx!.closePath();
      ctx!.fill();

      // Happy Smiling / Winking Glowing Eyes! ("^ ^" happy curve or big sparkle eyes)
      const eyeBounce = Math.sin(state.time * 6) * 0.5;

      [-14, 14].forEach((eyeX) => {
        ctx!.shadowColor = glowColor;
        ctx!.shadowBlur = 14;
        ctx!.fillStyle = glowColor;

        // Cute joyful wide eyes
        ctx!.beginPath();
        ctx!.ellipse(eyeX, eyeBounce, 8.5, 10.5, 0, 0, Math.PI * 2);
        ctx!.fill();

        const eyeGrad = ctx!.createRadialGradient(eyeX, eyeBounce, 2, eyeX, eyeBounce, 8.5);
        eyeGrad.addColorStop(0, '#ffffff');
        eyeGrad.addColorStop(0.4, glowColor);
        eyeGrad.addColorStop(1, glowDark);
        ctx!.fillStyle = eyeGrad;
        ctx!.beginPath();
        ctx!.ellipse(eyeX, eyeBounce, 7.5, 9.5, 0, 0, Math.PI * 2);
        ctx!.fill();

        // Big Anime Sparkle Glints
        ctx!.shadowBlur = 0;
        ctx!.fillStyle = '#ffffff';
        ctx!.beginPath();
        ctx!.arc(eyeX - 2.5, eyeBounce - 3, 2.8, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(eyeX + 2.5, eyeBounce + 3, 1.4, 0, Math.PI * 2);
        ctx!.fill();
      });

      ctx!.restore(); // End head

      // ── 7. HOLOGRAPHIC "Hii! 👋" SPEECH BUBBLE ──
      if (speechPop > 0.05) {
        ctx!.save();
        const bubbleY = headY - CUTE_BOT.headRadius - 52;
        ctx!.translate(12, bubbleY);
        ctx!.scale(speechPop, speechPop);

        const bubbleW = 100;
        const bubbleH = 34;
        const bX = -bubbleW / 2;
        const bY = -bubbleH / 2;

        // Bubble Shadow & Background
        ctx!.shadowColor = glowColor;
        ctx!.shadowBlur = 16 * speechPop;
        ctx!.fillStyle = 'rgba(4, 9, 20, 0.94)';
        ctx!.strokeStyle = glowColor;
        ctx!.lineWidth = 1.8;

        ctx!.beginPath();
        ctx!.roundRect(bX, bY, bubbleW, bubbleH, 12);
        ctx!.fill();
        ctx!.stroke();

        // Bottom Arrow pointer towards bot's head
        ctx!.beginPath();
        ctx!.moveTo(-6, bY + bubbleH);
        ctx!.lineTo(-12, bY + bubbleH + 8);
        ctx!.lineTo(0, bY + bubbleH);
        ctx!.closePath();
        ctx!.fill();
        ctx!.stroke();

        ctx!.shadowBlur = 0;

        // "Hii! 👋" Text
        ctx!.font = '900 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx!.textAlign = 'center';
        ctx!.textBaseline = 'middle';
        ctx!.fillStyle = '#ffffff';
        ctx!.fillText('Hii! 👋', 0, 0);

        ctx!.restore();
      }
    }

    function animate(timestamp: number) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      const cycleSpeed = 4.2 * speed;
      const moveSpeed = 120 * speed;
      const wrapPadding = 60;

      // Check if robot has reached center to trigger waving sequence
      const centerX = width * 0.5;
      if (!state.hasWaved && Math.abs(state.robotX - centerX) < 20) {
        state.isWaving = true;
        state.waveTimer = 0;
        state.hasWaved = true;
      }

      let speechPop = 0;

      if (state.isWaving) {
        state.waveTimer += dt;
        state.time += dt * 3.5; // Continue eye bounce / antenna pulse

        // Smoothly transition into front view (0 -> 1) over 0.25s
        if (state.waveTimer < 0.25) {
          state.turnProgress = Math.min(1, state.waveTimer / 0.25);
        } else if (state.waveTimer < 2.0) {
          state.turnProgress = 1;
          // Pop speech bubble in and hold
          speechPop = Math.min(1, (state.waveTimer - 0.25) * 5);
        } else if (state.waveTimer < 2.3) {
          // Fade out speech and turn back to walking profile (1 -> 0)
          state.turnProgress = Math.max(0, 1 - (state.waveTimer - 2.0) / 0.3);
          speechPop = Math.max(0, 1 - (state.waveTimer - 2.0) * 5);
        } else {
          // Wave complete! Resume walking
          state.isWaving = false;
          state.turnProgress = 0;
          speechPop = 0;
        }
      } else {
        state.time += dt * cycleSpeed;
        state.turnProgress = 0;

        if (isR2L) {
          state.robotX -= moveSpeed * dt;
          if (state.robotX < -wrapPadding) {
            state.robotX = width + wrapPadding;
            state.hasWaved = false; // Reset so bot waves on next crossing
          }
        } else {
          state.robotX += moveSpeed * dt;
          if (state.robotX > width + wrapPadding) {
            state.robotX = -wrapPadding;
            state.hasWaved = false; // Reset for next pass
          }
        }
      }

      const footLevel = height * 0.78;

      ctx!.clearRect(0, 0, width, height);

      // Subtle track guideline
      ctx!.save();
      const trackGrad = ctx!.createLinearGradient(0, 0, width, 0);
      trackGrad.addColorStop(0, 'rgba(255,255,255,0)');
      trackGrad.addColorStop(0.2, 'rgba(255,255,255,0.04)');
      trackGrad.addColorStop(0.5, 'rgba(255,255,255,0.08)');
      trackGrad.addColorStop(0.8, 'rgba(255,255,255,0.04)');
      trackGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx!.fillStyle = trackGrad;
      ctx!.fillRect(0, footLevel + 1, width, 1);
      ctx!.restore();

      const walkPhase = state.time;
      const leftPhase = walkPhase;
      const rightPhase = walkPhase + Math.PI;

      const bodyBob = state.isWaving ? Math.sin(state.time * 6) * 1.8 : Math.sin(walkPhase * 2) * 4.0;
      const torsoLean = 0.09 + Math.sin(walkPhase) * 0.035;
      const armSwing = Math.sin(walkPhase) * 0.55;

      const footL = getFootTrajectory(leftPhase, CUTE_BOT.strideWidth, CUTE_BOT.strideLift);
      const footR = getFootTrajectory(rightPhase, CUTE_BOT.strideWidth, CUTE_BOT.strideLift);

      const rootX = state.robotX;

      // 1. Soft Floor Contact Shadow
      drawGroundContactShadow(rootX, footLevel, footL, footR, state.scale, state.turnProgress > 0.5);

      // 2. Render Bot
      ctx!.save();
      ctx!.translate(rootX, footLevel + bodyBob * state.scale);

      if (state.turnProgress > 0.5) {
        // 🌟 FRONT FACING WAVING POSE ("Hii! 👋")
        ctx!.scale(state.scale, state.scale);
        ctx!.translate(0, -CUTE_BOT.pelvisHeight);
        drawFrontFacingWavingBot(themeColors.glow, themeColors.dark, state.waveTimer, speechPop);
      } else {
        // 🚶 SIDE PROFILE WALKING POSE
        if (!isR2L) {
          ctx!.scale(-state.scale, state.scale);
        } else {
          ctx!.scale(state.scale, state.scale);
        }

        ctx!.translate(0, -CUTE_BOT.pelvisHeight);

        // Far Layer
        drawCuteArm(12, -70, -armSwing, true);
        drawCuteLeg(4, 0, footR, true);

        // Mid Layer
        drawCuteTorsoAndHead(0, 0, torsoLean, themeColors.glow, themeColors.dark);

        // Near Layer
        drawCuteLeg(0, 0, footL, false);
        drawCuteArm(-12, -70, armSwing, false);
      }

      ctx!.restore();

      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('nisb:themeChange', handleThemeChange);
    };
  }, [isVisible, direction, speed]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[80px] sm:h-[100px] md:h-[115px] overflow-hidden select-none pointer-events-none ${className}`}
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
