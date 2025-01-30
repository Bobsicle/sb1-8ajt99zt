import { useMemo } from 'react';
import * as THREE from 'three';
import { GRID_SIZE, GRID_EXTENT, MOBILE_SETTINGS } from '../constants';

export const snapToGrid = (position: THREE.Vector3): THREE.Vector3 => {
  position.x = Math.round(position.x / GRID_SIZE) * GRID_SIZE;
  position.y = Math.round(position.y / GRID_SIZE) * GRID_SIZE;
  position.z = Math.round(position.z / GRID_SIZE) * GRID_SIZE;
  return position;
};

export function useGridSystem(isMobile?: boolean) {
  const geometry = useMemo(() => {
    const gridExtent = isMobile ? MOBILE_SETTINGS.GRID_EXTENT : GRID_EXTENT;
    const positions = [];
    const colors = [];
    const gridSize = gridExtent * 2 + 1;
    
    // Create grid points in a more organized pattern
    for (let z = -gridExtent; z <= gridExtent; z++) {
      for (let y = -gridExtent; y <= gridExtent; y++) {
        for (let x = -gridExtent; x <= gridExtent; x++) {
          // Add offset to center points on grid intersections
          positions.push(x + 0.5, y + 0.5, z + 0.5);
          // Initialize all points as invisible
          colors.push(0, 0, 0);
        }
      }
    }

    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors)
    };
  }, [isMobile]);

  return {
    geometry,
    snapToGrid
  };
}