import * as THREE from 'three';
import { GRID_EXTENT, GRID_SIZE } from '../constants';
import { ObjectPool } from './performance';

// Pre-allocate vectors
const vectorPool = new ObjectPool<THREE.Vector3>(
  () => new THREE.Vector3(),
  (v) => v.set(0, 0, 0),
  100
);

// Use typed arrays for better performance
const generateGridGeometry = () => {
  const gridSize = GRID_EXTENT * 2 + 1;
  const totalPoints = gridSize * gridSize * gridSize;
  
  // Pre-allocate arrays
  const positions = new Float32Array(totalPoints * 3);
  const colors = new Float32Array(totalPoints * 3);
  
  let index = 0;
  for (let z = 0; z < gridSize; z++) {
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const i = index * 3;
        positions[i] = x - GRID_EXTENT + 0.5;
        positions[i + 1] = y - GRID_EXTENT + 0.5;
        positions[i + 2] = z - GRID_EXTENT + 0.5;
        index++;
      }
    }
  }

  return { positions, colors };
};

// Efficient grid position calculation
const getGridPosition = (() => {
  const tempVec = new THREE.Vector3();
  
  return (position: THREE.Vector3) => {
    tempVec.copy(position);
    tempVec.x = Math.round(tempVec.x / GRID_SIZE) * GRID_SIZE;
    tempVec.y = Math.round(tempVec.y / GRID_SIZE) * GRID_SIZE;
    tempVec.z = Math.round(tempVec.z / GRID_SIZE) * GRID_SIZE;
    return tempVec;
  };
})();

// Fast grid alignment check
const isOnGrid = (() => {
  const tempVec = new THREE.Vector3();
  const TOLERANCE = 0.001;
  
  return (position: THREE.Vector3) => {
    tempVec.copy(position);
    const gridPos = getGridPosition(tempVec);
    return (
      Math.abs(position.x - gridPos.x) < TOLERANCE &&
      Math.abs(position.y - gridPos.y) < TOLERANCE &&
      Math.abs(position.z - gridPos.z) < TOLERANCE
    );
  };
})();

export { generateGridGeometry, getGridPosition, isOnGrid };