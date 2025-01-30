import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GRID_SIZE } from '../constants';
import { Label } from './Label';

interface CenterCubeProps {
  material: THREE.Material;
  innerMaterial: THREE.Material;
  cubeRef: React.RefObject<THREE.Mesh>;
  isMobile?: boolean;
}

export function CenterCube({ material, innerMaterial, cubeRef, isMobile }: CenterCubeProps) {
  const cylinderHeight = GRID_SIZE * 0.2;
  const spacing = GRID_SIZE * 0.2;
  const radius = GRID_SIZE / 2;
  const totalHeight = GRID_SIZE; // Reduced from GRID_SIZE * 2
  const labelRef = useRef<{ updatePosition: (pos: THREE.Vector3) => void }>();
  const cornerPointsRef = useRef<THREE.Points>(null);

  useEffect(() => {
    if (cubeRef.current) {
      const updatePosition = () => {
        if (cubeRef.current && labelRef.current) {
          const worldPos = new THREE.Vector3();
          cubeRef.current.getWorldPosition(worldPos);
          labelRef.current.updatePosition(worldPos);
        }

        if (cornerPointsRef.current && cubeRef.current) {
          cornerPointsRef.current.position.copy(cubeRef.current.position);
          cornerPointsRef.current.rotation.copy(cubeRef.current.rotation);
        }
      };

      updatePosition();

      const mesh = cubeRef.current;
      mesh.userData.onBeforeRender = updatePosition;

      return () => {
        if (mesh) {
          delete mesh.userData.onBeforeRender;
        }
      };
    }
  }, [cubeRef]);

  const cornerPositions = new Float32Array([
    -GRID_SIZE, -totalHeight/2, GRID_SIZE,
    GRID_SIZE, -totalHeight/2, GRID_SIZE,
    GRID_SIZE, totalHeight/2, GRID_SIZE,
    -GRID_SIZE, totalHeight/2, GRID_SIZE,
    -GRID_SIZE, -totalHeight/2, -GRID_SIZE,
    GRID_SIZE, -totalHeight/2, -GRID_SIZE,
    GRID_SIZE, totalHeight/2, -GRID_SIZE,
    -GRID_SIZE, totalHeight/2, -GRID_SIZE
  ]);

  const colors = new Float32Array(cornerPositions.length);
  for (let i = 0; i < colors.length; i += 3) {
    colors[i] = 1;
    colors[i + 1] = 1;
    colors[i + 2] = 1;
  }

  return (
    <group ref={cubeRef} name="centerCube">
      <mesh>
        <boxGeometry args={[GRID_SIZE * 2, totalHeight, GRID_SIZE * 2]} />
        <primitive object={material} />
      </mesh>

      <points ref={cornerPointsRef}>
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
          opacity={0.8}
        />
      </points>

      <mesh position={[0, cylinderHeight + spacing, 0]}>
        <cylinderGeometry args={[radius, radius, cylinderHeight, 32]} />
        <primitive object={innerMaterial} />
      </mesh>

      <mesh>
        <cylinderGeometry args={[radius, radius, cylinderHeight, 32]} />
        <primitive object={innerMaterial} />
      </mesh>

      <mesh position={[0, -(cylinderHeight + spacing), 0]}>
        <cylinderGeometry args={[radius, radius, cylinderHeight, 32]} />
        <primitive object={innerMaterial} />
      </mesh>

      <Label 
        ref={labelRef}
        text="System Core"
        position={[0, GRID_SIZE * 0.8, 0]}
        color="#888888"
        isMobile={isMobile}
        isSystemCore={true}
      />
    </group>
  );
}