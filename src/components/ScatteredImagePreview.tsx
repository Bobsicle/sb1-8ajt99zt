import React from 'react';
import { Html } from '@react-three/drei';
import type { ProjectImages } from '../types';

interface ScatteredImagePreviewProps {
  images: ProjectImages;
  position: THREE.Vector3;
}

export function ScatteredImagePreview({ images, position }: ScatteredImagePreviewProps) {
  return (
    <Html
      position={[position.x - 4, position.y, position.z]}
      center
      style={{
        width: '240px',
        pointerEvents: 'none',
      }}
    >
      <div className="flex flex-col gap-3">
        {images.items.map((image, index) => (
          <div
            key={`${image.url}-${index}`}
            className="bg-black/90 shadow-2xl overflow-hidden transform transition-transform duration-300 hover:scale-105"
            style={{
              transform: `translateX(${-index * 5}px) translateY(${index * 5}px)`,
              borderRadius: '4px',
            }}
          >
            <img
              src={image.url}
              alt={image.caption}
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
        ))}
      </div>
    </Html>
  );
}