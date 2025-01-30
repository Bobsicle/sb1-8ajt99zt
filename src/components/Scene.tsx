import React, { useState, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CenterCube } from './CenterCube';
import { ConnectedCube } from './ConnectedCube';
import { GridPoints } from './GridPoints';
import { Lighting } from './Lighting';
import { useMouseControls } from '../hooks/useMouseControls';
import { useSceneAnimation } from '../hooks/useSceneAnimation';
import { useGridColors } from '../hooks/useGridColors';
import { useMaterials } from '../hooks/useMaterials';
import { snapToGrid } from '../hooks/useGridSystem';
import { RADIUS, MOBILE_SETTINGS } from '../constants';
import { CUBE_DATA } from '../types';
import type { MouseState, CubeData, ProjectImages } from '../types';

interface SceneProps {
  onImageHover: (
    images: ProjectImages | undefined, 
    camera: THREE.Camera | undefined,
    position: THREE.Vector3 | undefined,
    isDragging?: boolean
  ) => void;
  isMobile?: boolean;
}

function Scene({ onImageHover, isMobile }: SceneProps) {
  const { camera, gl } = useThree();
  const [cubes, setCubes] = useState<THREE.Vector3[]>([]);
  const cubeRefs = useRef<THREE.Mesh[]>([]);
  const lineRefs = useRef<THREE.Line[]>([]);
  const centerCubeRef = useRef<THREE.Mesh>(null);
  const systemRef = useRef<THREE.Group>(null);
  const gridPointsRef = useRef<THREE.Points>(null);
  const lastClosestCube = useRef<number>(-1);
  const lastUpdateTime = useRef(0);

  const mouseState: MouseState = {
    isDragging: useRef(false),
    previousPosition: useRef({ x: 0, y: 0 }),
    velocity: useRef({ x: 0, y: 0 }),
    targetRotation: useRef({ x: 0, y: 0 }),
    currentRotation: useRef({ x: 0, y: 0 })
  };

  useEffect(() => {
    const positions: THREE.Vector3[] = [];
    const radius = isMobile ? RADIUS * MOBILE_SETTINGS.RADIUS_SCALE : RADIUS;
    const gridExtent = isMobile ? MOBILE_SETTINGS.GRID_EXTENT - 1 : MOBILE_SETTINGS.GRID_EXTENT - 1;

    for (let i = 0; i < CUBE_DATA.length; i++) {
      const angle = (i / CUBE_DATA.length) * Math.PI * 2;
      
      let x = Math.cos(angle) * radius;
      let y = Math.sin(angle) * radius;
      let z = (Math.random() - 0.5) * (isMobile ? 2 : 4);

      x = Math.max(-gridExtent, Math.min(gridExtent, x));
      y = Math.max(-gridExtent, Math.min(gridExtent, y));
      z = Math.max(-gridExtent, Math.min(gridExtent, z));

      const position = snapToGrid(new THREE.Vector3(x, y, z));
      positions.push(position);
    }
    
    setCubes(positions);
  }, [isMobile]);

  const materials = useMaterials();
  const updateGridColors = useGridColors(materials);

  useMouseControls(gl, mouseState, isMobile);

  useSceneAnimation(
    { 
      cubeRefs, 
      lineRefs, 
      centerCubeRef, 
      systemRef, 
      gridPointsRef,
      cubeColors: materials.cubeColors 
    },
    mouseState,
    (gridPoints, cubes) => updateGridColors(gridPoints, cubes, isMobile),
    isMobile
  );

  // Find closest cube to camera and show its images
  useEffect(() => {
    if (!isMobile) return;

    const updateClosestCube = () => {
      const now = performance.now();
      if (now - lastUpdateTime.current < 100) return;
      lastUpdateTime.current = now;

      let closestDistance = Infinity;
      let closestIndex = -1;
      const cameraDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const cameraPosition = camera.position.clone();

      cubeRefs.current.forEach((cube, index) => {
        if (!cube) return;

        const cubePosition = new THREE.Vector3();
        cube.getWorldPosition(cubePosition);
        
        const distance = cameraPosition.distanceTo(cubePosition);
        const direction = cubePosition.clone().sub(cameraPosition).normalize();
        const angle = direction.dot(cameraDirection);
        
        const weightedDistance = distance / (angle + 1.5);

        if (weightedDistance < closestDistance) {
          closestDistance = weightedDistance;
          closestIndex = index;
        }
      });

      if (closestIndex !== lastClosestCube.current && closestIndex !== -1) {
        lastClosestCube.current = closestIndex;
        const cubeData = CUBE_DATA[closestIndex];
        if (cubeData?.images) {
          const cube = cubeRefs.current[closestIndex];
          if (cube) {
            const worldPosition = new THREE.Vector3();
            cube.getWorldPosition(worldPosition);
            onImageHover(cubeData.images, camera, worldPosition);
          }
        }
      }
    };

    const interval = setInterval(updateClosestCube, 100);
    return () => clearInterval(interval);
  }, [isMobile, camera, onImageHover]);

  const handleCubeHover = (images: ProjectImages | undefined, position?: THREE.Vector3) => {
    if (isMobile) return;

    const worldPosition = position ? position.clone() : undefined;
    if (worldPosition && systemRef.current) {
      worldPosition.applyMatrix4(systemRef.current.matrixWorld);
    }
    onImageHover(images, camera, worldPosition);
  };

  const handleCubeClick = (cubeData: CubeData) => {
    if (isMobile && cubeData.images) {
      const cube = cubeRefs.current[CUBE_DATA.indexOf(cubeData)];
      if (cube) {
        const worldPosition = new THREE.Vector3();
        cube.getWorldPosition(worldPosition);
        onImageHover(cubeData.images, camera, worldPosition);
      }
    }

    if (cubeData.link) {
      window.open(cubeData.link, '_blank');
    }
    if (cubeData.type === 'page') {
      console.log(`Navigate to ${cubeData.title} page`);
    }
  };

  return (
    <>
      <Lighting />
      <group ref={systemRef}>
        <GridPoints gridRef={gridPointsRef} isMobile={isMobile} />
        <CenterCube
          material={materials.centerMaterial}
          innerMaterial={materials.centerInnerMaterial}
          cubeRef={centerCubeRef}
          isMobile={isMobile}
        />
        {cubes.map((pos, index) => {
          const cubeData = CUBE_DATA[index];
          if (!cubeData) return null;

          return (
            <ConnectedCube
              key={cubeData.id}
              position={pos}
              material={materials.cubeMaterials[index]}
              innerMaterial={materials.innerMaterials[index]}
              color={materials.cubeColors[index]}
              cubeData={cubeData}
              onHover={(images) => handleCubeHover(images, pos)}
              cubeRef={(el) => {
                if (el) {
                  cubeRefs.current[index] = el;
                  el.userData.onClick = () => handleCubeClick(cubeData);
                }
              }}
              lineRef={(el) => {
                if (el) lineRefs.current[index] = el;
              }}
              isMobile={isMobile}
            />
          );
        })}
      </group>
    </>
  );
}

export default Scene;