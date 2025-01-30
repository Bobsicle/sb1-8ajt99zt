import React, { useMemo, useRef, useEffect } from 'react';
import { Points } from '@react-three/fiber';
import * as THREE from 'three';
import { GRID_POINT_SIZE } from '../constants';
import { useGridSystem } from '../hooks/useGridSystem';
import { ObjectPool } from '../utils/performance';

interface GridPointsProps {
  gridRef: React.Ref<THREE.Points>;
  isMobile?: boolean;
}

// Create object pools for frequently used objects
const vectorPool = new ObjectPool<THREE.Vector3>(
  () => new THREE.Vector3(),
  (v) => v.set(0, 0, 0),
  1000
);

export function GridPoints({ gridRef, isMobile }: GridPointsProps) {
  const { geometry } = useGridSystem();
  const pointsRef = useRef<THREE.Points>();

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        pointSize: { value: GRID_POINT_SIZE }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          if (length(gl_PointCoord - vec2(0.5)) > 0.5) {
            discard;
          }
          gl_FragColor = vec4(vColor, 0.8);
        }
      `,
      transparent: true,
      vertexColors: true,
      depthWrite: false // Optimize for transparency
    });
  }, []);

  // Create size array with same length as positions
  const sizes = useMemo(() => {
    const count = geometry.positions.length / 3;
    return new Float32Array(count).fill(GRID_POINT_SIZE);
  }, [geometry.positions.length]);

  // Use instanced buffer attributes for better performance
  useEffect(() => {
    if (pointsRef.current) {
      const geometry = pointsRef.current.geometry;
      geometry.setAttribute('size', new THREE.InstancedBufferAttribute(sizes, 1));
    }
  }, [sizes]);

  return (
    <points ref={gridRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={geometry.positions.length / 3}
          array={geometry.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={geometry.colors.length / 3}
          array={geometry.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <primitive object={material} />
    </points>
  );
}