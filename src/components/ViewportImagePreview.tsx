import React, { useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { useImageGrid } from '../hooks/useImageGrid';
import type { ProjectImages } from '../types';
import { MAX_PROJECT_IMAGES } from '../types';
import { PerformanceMonitor } from '../utils/performance';

interface ViewportImagePreviewProps {
  images: ProjectImages;
  camera: THREE.Camera;
  position: THREE.Vector3;
  isDragging?: boolean;
  isMobile?: boolean;
  onClose: () => void;
}

export function ViewportImagePreview({ 
  images, 
  camera, 
  position, 
  isDragging,
  isMobile 
}: ViewportImagePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const performanceMonitor = useMemo(() => PerformanceMonitor.getInstance(), []);
  
  // Adjust actor size for mobile
  const actor = useMemo(() => ({
    position,
    size: isDragging ? (isMobile ? 2 : 3) : (isMobile ? 1.5 : 2)
  }), [position.x, position.y, position.z, isDragging, isMobile]);

  const { getImageStyle, availableCells } = useImageGrid(
    containerRef,
    actor,
    camera,
    isMobile
  );

  // Reduce number of visible images on mobile
  const visibleImages = useMemo(() => {
    const maxImages = isMobile ? Math.min(4, availableCells.length) : MAX_PROJECT_IMAGES;
    return images.items.slice(0, maxImages);
  }, [images.items, availableCells.length, isMobile]);

  const getTransform = useCallback((style: React.CSSProperties) => {
    const left = parseFloat(style.left as string);
    const top = parseFloat(style.top as string);
    return {
      ...style,
      left: 0,
      top: 0,
      transform: `translate3d(${left}px, ${top}px, 0)`,
      willChange: 'transform'
    };
  }, []);

  // Hide images during drag on low-performance devices
  if (performanceMonitor.shouldReduceQuality() && isDragging) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none ${isMobile ? 'p-2' : 'p-4'}`}
      style={{ 
        zIndex: 10,
        contain: 'layout style paint',
        willChange: 'transform'
      }}
    >
      <div className="relative w-full h-full">
        {visibleImages.map((image, index) => (
          <div
            key={`${image.url}-${index}`}
            className="absolute bg-black/90 shadow-2xl overflow-hidden"
            style={{
              ...getTransform(getImageStyle(index)),
              opacity: isDragging ? 0.8 : 1,
              transition: isMobile ? 'all 0.15s ease-out' : 'all 0.2s ease-out',
              borderRadius: '4px',
              maxWidth: isMobile ? '180px' : '320px', // Increased from 140px/240px
              maxHeight: isMobile ? '135px' : '240px' // Increased from 105px/180px
            }}
          >
            <img
              src={image.url}
              alt={image.caption}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              style={{ 
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}