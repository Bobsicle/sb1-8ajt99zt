import * as THREE from 'three';
import { MAX_DISTANCE, MIN_DISTANCE } from '../constants';
import { ObjectPool } from './performance';

// Pre-allocate vectors
const vectorPool = new ObjectPool<THREE.Vector3>(
  () => new THREE.Vector3(),
  (v) => v.set(0, 0, 0),
  50
);

export const constrainPosition = (() => {
  const tempVec = vectorPool.acquire();
  
  return (cube: THREE.Mesh, centerPos: THREE.Vector3): boolean => {
    tempVec.subVectors(cube.position, centerPos);
    const distanceSquared = tempVec.lengthSq(); // Faster than length()
    
    // Use squared distances to avoid square root
    const maxDistanceSquared = MAX_DISTANCE * MAX_DISTANCE;
    const minDistanceSquared = MIN_DISTANCE * MIN_DISTANCE;
    
    if (distanceSquared > maxDistanceSquared) {
      tempVec.setLength(MAX_DISTANCE);
      cube.position.copy(centerPos).add(tempVec);
      return true;
    } 
    
    if (distanceSquared < minDistanceSquared) {
      tempVec.setLength(MIN_DISTANCE);
      cube.position.copy(centerPos).add(tempVec);
      return true;
    }
    
    return false;
  };
})();

// Cleanup function for memory management
export const cleanup = () => {
  vectorPool.clear();
};