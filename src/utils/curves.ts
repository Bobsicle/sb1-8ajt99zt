import * as THREE from 'three';
import { CURVE_SEGMENTS, MOBILE_SETTINGS } from '../constants';
import { ObjectPool } from './performance';

// Pre-allocated vectors
const vectorPool = new ObjectPool<THREE.Vector3>(
  () => new THREE.Vector3(),
  v => v.set(0, 0, 0),
  50
);

const colorPool = new ObjectPool<THREE.Color>(
  () => new THREE.Color(),
  c => c.setRGB(0, 0, 0),
  50
);

export const createCurvedLine = (
  start: THREE.Vector3,
  end: THREE.Vector3,
  time: number,
  index: number,
  color: THREE.Color,
  isMobile?: boolean
) => {
  // Use mobile-specific or default curve segments
  const segments = isMobile ? MOBILE_SETTINGS.CURVE_SEGMENTS : CURVE_SEGMENTS;

  // Get vectors from pool
  const controlPoint = vectorPool.acquire();
  const lerpedStart = vectorPool.acquire();
  const lerpedEnd = vectorPool.acquire();
  const whiteColor = colorPool.acquire().setRGB(1, 1, 1);

  // Create control point with minimal calculations
  controlPoint.addVectors(start, end).multiplyScalar(0.5)
    .add(new THREE.Vector3(
      Math.sin(time * 2 + index) * 0.5,
      Math.cos(time * 2 + index) * 0.5,
      Math.sin(time * 2.5 + index) * 0.5
    ));

  // Lerp with minimal operations
  const lerpAmount = 0.2;
  lerpedStart.copy(start).lerp(controlPoint, lerpAmount);
  lerpedEnd.copy(end).lerp(controlPoint, lerpAmount);

  // Create curve points efficiently
  const points = [];
  const colors = new Float32Array((segments + 1) * 3);
  const step = 1 / segments;
  
  for (let i = 0; i <= segments; i++) {
    const t = i * step;
    const point = vectorPool.acquire();
    
    // Quadratic bezier calculation
    const t1 = 1 - t;
    point.copy(lerpedStart).multiplyScalar(t1 * t1)
      .add(controlPoint.clone().multiplyScalar(2 * t1 * t))
      .add(lerpedEnd.clone().multiplyScalar(t * t));
    
    points.push(point);

    // Efficient color interpolation
    const lerpedColor = colorPool.acquire();
    lerpedColor.copy(whiteColor).lerp(color, t);
    
    const colorIndex = i * 3;
    colors[colorIndex] = lerpedColor.r;
    colors[colorIndex + 1] = lerpedColor.g;
    colors[colorIndex + 2] = lerpedColor.b;
    
    colorPool.release(lerpedColor);
  }

  // Release pooled objects
  vectorPool.release(controlPoint);
  vectorPool.release(lerpedStart);
  vectorPool.release(lerpedEnd);
  colorPool.release(whiteColor);

  return { points, colors };
};