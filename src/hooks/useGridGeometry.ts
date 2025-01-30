import { useMemo } from 'react';
import { GRID_EXTENT } from '../constants';
import { ObjectPool } from '../utils/performance';

// Pre-allocate arrays
const GRID_SIZE = GRID_EXTENT * 2 + 1;
const TOTAL_POINTS = GRID_SIZE * GRID_SIZE * GRID_SIZE;
const POSITIONS = new Float32Array(TOTAL_POINTS * 3);
const COLORS = new Float32Array(TOTAL_POINTS * 3);

// Create object pool for calculations
const vectorPool = new ObjectPool<{ x: number; y: number; z: number }>(
  () => ({ x: 0, y: 0, z: 0 }),
  v => { v.x = 0; v.y = 0; v.z = 0; },
  100
);

export function useGridGeometry() {
  return useMemo(() => {
    let index = 0;
    
    for (let z = 0; z < GRID_SIZE; z++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          const i = index * 3;
          POSITIONS[i] = x - GRID_EXTENT + 0.5;
          POSITIONS[i + 1] = y - GRID_EXTENT + 0.5;
          POSITIONS[i + 2] = z - GRID_EXTENT + 0.5;
          index++;
        }
      }
    }

    return {
      positions: POSITIONS,
      colors: COLORS
    };
  }, []);
}