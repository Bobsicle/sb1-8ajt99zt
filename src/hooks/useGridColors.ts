import { useCallback } from 'react';
import * as THREE from 'three';
import { COLOR_INFLUENCE_DISTANCE, GRID_POINT_SIZE, MOBILE_SETTINGS } from '../constants';
import { ObjectPool } from '../utils/performance';

// Pre-allocated vectors
const vectorPool = new ObjectPool<THREE.Vector3>(
  () => new THREE.Vector3(),
  v => v.set(0, 0, 0),
  1000
);

const tempVec = new THREE.Vector3();
const tempColor = new THREE.Color();

export function useGridColors(materials: { cubeColors: THREE.Color[] }) {
  return useCallback((
    gridPoints: THREE.Points,
    cubes: THREE.Mesh[],
    isMobile?: boolean
  ) => {
    if (!gridPoints || !cubes.length) return;

    const colorAttribute = gridPoints.geometry.getAttribute('color') as THREE.BufferAttribute;
    const positionAttribute = gridPoints.geometry.getAttribute('position') as THREE.BufferAttribute;
    const sizeAttribute = gridPoints.geometry.getAttribute('size') as THREE.BufferAttribute;

    // Use mobile-specific or default influence distance
    const influenceDistance = isMobile ? MOBILE_SETTINGS.COLOR_INFLUENCE_DISTANCE : COLOR_INFLUENCE_DISTANCE;

    // Reset all points to invisible first
    for (let i = 0; i < positionAttribute.count; i++) {
      colorAttribute.setXYZ(i, 0, 0, 0);
      sizeAttribute.setX(i, 0);
    }

    // Get cube world positions once
    const cubeWorldPositions = cubes.map(cube => {
      const pos = vectorPool.acquire();
      cube.getWorldPosition(pos);
      return pos;
    });

    // Only process points within range of any cube
    for (let i = 0; i < positionAttribute.count; i++) {
      // Get point position in local space
      tempVec.fromBufferAttribute(positionAttribute, i);
      
      // Transform point to world space using gridPoints matrix
      tempVec.applyMatrix4(gridPoints.matrixWorld);
      
      // Check if point is within range of any cube
      let isInRange = false;
      let minDistance = Infinity;
      let influences: { distance: number; color: THREE.Color }[] = [];

      for (let j = 0; j < cubeWorldPositions.length; j++) {
        const cubePos = cubeWorldPositions[j];
        if (!cubePos) continue;
        
        const distance = tempVec.distanceTo(cubePos);
        if (distance <= influenceDistance) {
          isInRange = true;
          minDistance = Math.min(minDistance, distance);
          influences.push({
            distance,
            color: materials.cubeColors[j]
          });
        }
      }

      // Skip points not in range of any cube
      if (!isInRange) continue;

      if (influences.length > 0) {
        // Sort influences by distance for proper blending
        influences.sort((a, b) => a.distance - b.distance);
        
        // Calculate color blend
        tempColor.setRGB(0, 0, 0);
        let totalWeight = 0;
        
        influences.forEach(({ distance, color }) => {
          // Use quadratic falloff for smoother color transition
          const weight = Math.pow(1 - (distance / influenceDistance), 2);
          totalWeight += weight;
          tempColor.r += color.r * weight;
          tempColor.g += color.g * weight;
          tempColor.b += color.b * weight;
        });
        
        if (totalWeight > 0) {
          tempColor.r /= totalWeight;
          tempColor.g /= totalWeight;
          tempColor.b /= totalWeight;
        }

        // Set point color and size
        colorAttribute.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
        const sizeScale = Math.pow(1 - (minDistance / influenceDistance), 2);
        sizeAttribute.setX(i, GRID_POINT_SIZE * sizeScale);
      }
    }
    
    // Release pooled vectors
    cubeWorldPositions.forEach(pos => vectorPool.release(pos));
    
    colorAttribute.needsUpdate = true;
    sizeAttribute.needsUpdate = true;
  }, [materials.cubeColors]);
}