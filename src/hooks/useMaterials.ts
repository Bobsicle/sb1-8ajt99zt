import { useMemo } from 'react';
import * as THREE from 'three';
import { CUBE_COUNT } from '../constants';
import { MemoryManager } from '../utils/performance';

// Pre-allocate color instances
const WHITE_COLOR = new THREE.Color('#ffffff');
const BASE_COLORS = [
  new THREE.Color('#C1FF0D'),
  new THREE.Color('#FF0DAF'),
  new THREE.Color('#FF520D'),
  ...Array(CUBE_COUNT - 3).fill(null).map(() => new THREE.Color('#0D98FF'))
];

export function useMaterials() {
  return useMemo(() => {
    // Create shared material parameters
    const wireframeParams = {
      wireframe: true,
      wireframeLinewidth: 1,
      transparent: true,
      opacity: 0.05,
      depthWrite: false
    };

    const standardParams = {
      transparent: true,
      opacity: 0.3,
      depthWrite: false
    };

    // Create materials with optimized settings
    const centerMaterial = new THREE.MeshBasicMaterial({
      color: WHITE_COLOR,
      ...wireframeParams
    });

    const centerInnerMaterial = new THREE.MeshStandardMaterial({
      color: WHITE_COLOR,
      emissive: WHITE_COLOR,
      emissiveIntensity: 1,
      ...standardParams
    });

    const cubeColors = BASE_COLORS.map(color => color.clone());

    const cubeMaterials = cubeColors.map(color => {
      const material = new THREE.MeshBasicMaterial({
        color,
        ...wireframeParams
      });
      MemoryManager.track(material);
      return material;
    });

    const innerMaterials = cubeColors.map(color => {
      const material = new THREE.MeshStandardMaterial({
        color: color.clone().multiplyScalar(0.5),
        emissive: color,
        emissiveIntensity: 2,
        ...standardParams
      });
      MemoryManager.track(material);
      return material;
    });

    return { 
      centerMaterial, 
      centerInnerMaterial,
      cubeMaterials, 
      innerMaterials,
      cubeColors 
    };
  }, []);
}