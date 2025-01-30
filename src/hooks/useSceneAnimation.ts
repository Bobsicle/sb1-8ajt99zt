import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createCurvedLine } from '../utils/curves';
import { CAMERA_DAMPING, ROTATION_SMOOTHING, MOBILE_SETTINGS } from '../constants';
import { BatchProcessor, PerformanceMonitor } from '../utils/performance';
import type { MouseState } from '../types';

// Pre-allocate objects
const tempVector = new THREE.Vector3();
const tempVector2 = new THREE.Vector3();
const centerPos = new THREE.Vector3();
const rotationMatrix = new THREE.Matrix4();
const euler = new THREE.Euler();
const quaternion = new THREE.Quaternion();

let frameCount = 0;
let lastGridUpdate = 0;
let lastLineUpdate = 0;

interface SceneRefs {
  cubeRefs: React.MutableRefObject<THREE.Mesh[]>;
  lineRefs: React.MutableRefObject<THREE.Line[]>;
  centerCubeRef: React.RefObject<THREE.Mesh>;
  systemRef: React.RefObject<THREE.Group>;
  gridPointsRef: React.RefObject<THREE.Points>;
  cubeColors: THREE.Color[];
}

export function useSceneAnimation(
  refs: SceneRefs,
  mouseState: MouseState,
  updateGridColors: (gridPoints: THREE.Points, cubes: THREE.Mesh[]) => void,
  isMobile?: boolean
) {
  const performanceMonitor = PerformanceMonitor.getInstance();

  useFrame((state) => {
    frameCount++;

    // Skip frames based on performance
    if (performanceMonitor.shouldSkipFrame(isMobile ? MOBILE_SETTINGS.ANIMATION_FRAME_SKIP : 1)) {
      return;
    }

    const time = state.clock.getElapsedTime();
    
    // Update rotation with quaternions for better performance
    if (!mouseState.isDragging.current) {
      mouseState.targetRotation.current.x += mouseState.velocity.current.x;
      mouseState.targetRotation.current.y += mouseState.velocity.current.y;
      
      mouseState.velocity.current.x *= CAMERA_DAMPING;
      mouseState.velocity.current.y *= CAMERA_DAMPING;

      if (Math.abs(mouseState.velocity.current.x) < 0.001) mouseState.velocity.current.x = 0;
      if (Math.abs(mouseState.velocity.current.y) < 0.001) mouseState.velocity.current.y = 0;
    }

    mouseState.currentRotation.current.x += (mouseState.targetRotation.current.x - mouseState.currentRotation.current.x) * ROTATION_SMOOTHING;
    mouseState.currentRotation.current.y += (mouseState.targetRotation.current.y - mouseState.currentRotation.current.y) * ROTATION_SMOOTHING;

    if (refs.systemRef.current) {
      euler.set(
        mouseState.currentRotation.current.x,
        mouseState.currentRotation.current.y,
        0
      );
      quaternion.setFromEuler(euler);
      refs.systemRef.current.quaternion.slerp(quaternion, 0.1);
    }
    
    if (refs.centerCubeRef.current) {
      // Update center cube with minimal calculations
      refs.centerCubeRef.current.position.y = Math.sin(time * 0.5) * 0.2;
      refs.centerCubeRef.current.getWorldPosition(centerPos);
      
      // Update lines with reduced frequency
      const now = performance.now();
      const lineUpdateInterval = isMobile ? 100 : 50;
      
      if (now - lastLineUpdate > lineUpdateInterval) {
        BatchProcessor.process(
          refs.cubeRefs.current,
          (cube, index) => {
            if (!cube || !refs.lineRefs.current[index]) return;
            
            const { points, colors } = createCurvedLine(
              centerPos,
              cube.position,
              time,
              index,
              refs.cubeColors[index]
            );
            
            const positions = refs.lineRefs.current[index].geometry.getAttribute('position') as THREE.BufferAttribute;
            const colorAttribute = refs.lineRefs.current[index].geometry.getAttribute('color') as THREE.BufferAttribute;
            
            if (positions && colorAttribute) {
              const BATCH_SIZE = isMobile ? 3 : 6;
              for (let i = 0; i < points.length; i += BATCH_SIZE) {
                const endBatch = Math.min(i + BATCH_SIZE, points.length);
                for (let j = i; j < endBatch; j++) {
                  positions.setXYZ(j, points[j].x, points[j].y, points[j].z);
                  colorAttribute.setXYZ(j, colors[j * 3], colors[j * 3 + 1], colors[j * 3 + 2]);
                }
              }
              
              positions.needsUpdate = true;
              colorAttribute.needsUpdate = true;
            }
          },
          isMobile ? 2 : 4
        );
        
        lastLineUpdate = now;
      }
    }
    
    // Update grid colors with adaptive frequency
    if (refs.gridPointsRef.current) {
      const now = performance.now();
      const gridUpdateInterval = performanceMonitor.shouldReduceQuality() 
        ? MOBILE_SETTINGS.GRID_UPDATE_INTERVAL * 2 
        : MOBILE_SETTINGS.GRID_UPDATE_INTERVAL;
      
      if (now - lastGridUpdate > gridUpdateInterval) {
        updateGridColors(refs.gridPointsRef.current, refs.cubeRefs.current);
        lastGridUpdate = now;
      }
    }
  });
}