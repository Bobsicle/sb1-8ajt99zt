import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GRID_SIZE, CURVE_SEGMENTS } from '../constants';
import type { CubeData, ProjectImages } from '../types';
import { Label } from './Label';

interface ConnectedCubeProps {
  position: THREE.Vector3;
  material: THREE.Material;
  innerMaterial: THREE.Material;
  cubeRef: (el: THREE.Mesh | null) => void;
  lineRef: (el: THREE.Line | null) => void;
  color: THREE.Color;
  cubeData: CubeData;
  onHover: (images: ProjectImages | undefined) => void;
  isMobile?: boolean;
}

export function ConnectedCube({ 
  position, 
  material, 
  innerMaterial, 
  cubeRef, 
  lineRef, 
  color,
  cubeData,
  onHover,
  isMobile
}: ConnectedCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<{ updatePosition: (pos: THREE.Vector3) => void }>();
  const cornerPointsRef = useRef<THREE.Points>(null);
  const [isHovered, setIsHovered] = useState(false);
  const glowMaterialRef = useRef<THREE.MeshStandardMaterial>();
  const originalEmissiveIntensity = useRef(1);
  const animationFrameRef = useRef<number>();
  const currentIntensity = useRef(1);
  const targetIntensity = useRef(1);

  const animateGlow = useCallback(() => {
    if (!glowMaterialRef.current) return;

    const diff = targetIntensity.current - currentIntensity.current;
    const step = diff * 0.1; // Faster animation

    if (Math.abs(diff) > 0.01) {
      currentIntensity.current += step;
      glowMaterialRef.current.emissiveIntensity = currentIntensity.current;
      animationFrameRef.current = requestAnimationFrame(animateGlow);
    } else {
      currentIntensity.current = targetIntensity.current;
      glowMaterialRef.current.emissiveIntensity = currentIntensity.current;
    }
  }, []);

  useEffect(() => {
    if (meshRef.current) {
      const updatePosition = () => {
        if (meshRef.current && labelRef.current) {
          const worldPos = new THREE.Vector3();
          meshRef.current.getWorldPosition(worldPos);
          labelRef.current.updatePosition(worldPos);
        }

        if (cornerPointsRef.current && meshRef.current) {
          cornerPointsRef.current.position.copy(meshRef.current.position);
          cornerPointsRef.current.rotation.copy(meshRef.current.rotation);
        }
      };

      updatePosition();

      const mesh = meshRef.current;
      mesh.userData.onBeforeRender = updatePosition;

      return () => {
        if (mesh) {
          delete mesh.userData.onBeforeRender;
        }
      };
    }
  }, []);

  useEffect(() => {
    if (!glowMaterialRef.current) {
      glowMaterialRef.current = new THREE.MeshStandardMaterial({
        color: color.clone(),
        emissive: color.clone(),
        emissiveIntensity: originalEmissiveIntensity.current,
        transparent: true,
        opacity: 0.3,
        depthWrite: false
      });
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [color]);

  useEffect(() => {
    targetIntensity.current = isHovered ? 8 : originalEmissiveIntensity.current;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animateGlow);
  }, [isHovered, animateGlow]);

  const getInnerGeometry = () => {
    switch (cubeData.innerShape) {
      case 'sphere':
        return <sphereGeometry args={[GRID_SIZE / 2, 32, 32]} />;
      case 'cone':
        return <coneGeometry args={[GRID_SIZE / 2, GRID_SIZE, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[GRID_SIZE / 2, GRID_SIZE / 2, GRID_SIZE, 32]} />;
      default:
        return <boxGeometry args={[GRID_SIZE, GRID_SIZE, GRID_SIZE]} />;
    }
  };

  // Pre-allocate buffers with correct sizes
  const linePositions = new Float32Array((CURVE_SEGMENTS + 1) * 3);
  const lineColors = new Float32Array((CURVE_SEGMENTS + 1) * 3);
  const cornerPositions = new Float32Array([
    -GRID_SIZE/2, -GRID_SIZE/2, GRID_SIZE/2,
    GRID_SIZE/2, -GRID_SIZE/2, GRID_SIZE/2,
    GRID_SIZE/2, GRID_SIZE/2, GRID_SIZE/2,
    -GRID_SIZE/2, GRID_SIZE/2, GRID_SIZE/2,
    -GRID_SIZE/2, -GRID_SIZE/2, -GRID_SIZE/2,
    GRID_SIZE/2, -GRID_SIZE/2, -GRID_SIZE/2,
    GRID_SIZE/2, GRID_SIZE/2, -GRID_SIZE/2,
    -GRID_SIZE/2, GRID_SIZE/2, -GRID_SIZE/2
  ]);

  const colors = new Float32Array(cornerPositions.length);
  for (let i = 0; i < colors.length; i += 3) {
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
  }

  return (
    <>
      <mesh 
        ref={(el) => {
          meshRef.current = el;
          cubeRef(el);
        }}
        position={position}
        onPointerEnter={() => {
          setIsHovered(true);
          onHover(cubeData.images);
        }}
        onPointerLeave={() => {
          setIsHovered(false);
          onHover(undefined);
        }}
      >
        <boxGeometry args={[GRID_SIZE, GRID_SIZE, GRID_SIZE]} />
        <primitive object={material} />
        <mesh scale={0.6}>
          {getInnerGeometry()}
          <primitive object={glowMaterialRef.current || innerMaterial} />
        </mesh>
        <Label 
          ref={labelRef}
          text={cubeData.title}
          position={[0, GRID_SIZE * 0.8, 0]}
          color={cubeData.color}
          client={cubeData.client}
          workType={cubeData.workType}
          isMobile={isMobile}
        />
      </mesh>

      <points ref={cornerPointsRef} position={position}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={8}
            array={cornerPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={8}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={2.5}
          vertexColors
          sizeAttenuation={false}
          transparent
          opacity={isHovered ? 1 : 0.8}
        />
      </points>

      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={CURVE_SEGMENTS + 1}
            array={linePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={CURVE_SEGMENTS + 1}
            array={lineColors}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial vertexColors={true} linewidth={2} />
      </line>
    </>
  );
}