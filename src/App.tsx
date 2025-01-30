import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Scene from './components/Scene';
import { ViewportImagePreview } from './components/ViewportImagePreview';
import { Header } from './components/Header';
import type { ProjectImages } from './types';
import * as THREE from 'three';

interface HoveredState {
  images?: ProjectImages;
  camera?: THREE.Camera;
  position?: THREE.Vector3;
  isDragging?: boolean;
}

function App() {
  const [hovered, setHovered] = useState<HoveredState>();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleImageHover = (
    images: ProjectImages | undefined, 
    camera: THREE.Camera | undefined,
    position: THREE.Vector3 | undefined,
    isDragging?: boolean
  ) => {
    setHovered(images ? { images, camera, position, isDragging } : undefined);
  };

  return (
    <div className="w-full h-screen bg-black">
      <Header isMobile={isMobile} />
      <Canvas 
        camera={{ 
          position: isMobile ? [12, 10, 15] : [10, 8, 12], 
          fov: isMobile ? 60 : 50 
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false
        }}
        dpr={[1, isMobile ? 1.5 : 2]}
      >
        <color attach="background" args={['#000000']} />
        <Scene onImageHover={handleImageHover} isMobile={isMobile} />
        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            height={300}
          />
        </EffectComposer>
      </Canvas>
      {hovered?.images && hovered?.camera && hovered?.position && (
        <ViewportImagePreview 
          images={hovered.images}
          camera={hovered.camera}
          position={hovered.position}
          isDragging={hovered.isDragging}
          isMobile={isMobile}
          onClose={() => setHovered(undefined)}
        />
      )}
    </div>
  );
}

export default App;