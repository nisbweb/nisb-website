'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import StarfieldBackground from './StarfieldBackground';

export default function LandingCanvas() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setIsDesktop(true);
    }
  }, []);

  if (!isDesktop) return null;

  return (
    <Canvas
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'default',
      }}
      camera={{ fov: 60, near: 0.1, far: 100, position: [0, 0, 5] }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <StarfieldBackground />
      </Suspense>
    </Canvas>
  );
}

