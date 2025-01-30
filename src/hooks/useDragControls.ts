import { useEffect } from 'react';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import * as THREE from 'three';
import { constrainPosition } from '../utils/position';
import { snapToGrid } from './useGridSystem';
import { GRID_SIZE } from '../constants';
import type { MouseState } from '../types';

// Pre-allocate reusable objects
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const dragPlane = new THREE.Plane();
const intersection = new THREE.Vector3();
const tempVec = new THREE.Vector3();

const isGridPointOccupied = (
  position: THREE.Vector3,
  cubes: THREE.Mesh[],
  excludeCube: THREE.Mesh
): boolean => {
  const gridPosition = snapToGrid(position.clone());
  return cubes.some(cube => {
    if (cube === excludeCube) return false;
    const cubeGridPos = snapToGrid(cube.position.clone());
    return cubeGridPos.distanceTo(gridPosition) < GRID_SIZE * 0.1;
  });
};

export function useDragControls(
  cubeRefs: React.MutableRefObject<THREE.Mesh[]>,
  centerCubeRef: React.RefObject<THREE.Mesh>,
  camera: THREE.Camera,
  gl: THREE.WebGLRenderer,
  mouseState: MouseState,
  cubeCount: number,
  setIsDragging: (isDragging: boolean) => void
) {
  useEffect(() => {
    if (!cubeRefs.current.length || !centerCubeRef.current) return;

    const controls = new DragControls(cubeRefs.current, camera, gl.domElement);
    
    let originalPosition: THREE.Vector3 | null = null;
    let isDragging = false;
    let activeCube: THREE.Mesh | null = null;
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 16; // ~60fps
    
    const updateDragPosition = (event: PointerEvent) => {
      if (!isDragging || !activeCube || !centerCubeRef.current) return;

      const now = performance.now();
      if (now - lastUpdateTime < UPDATE_INTERVAL) return;
      lastUpdateTime = now;

      // Convert mouse position to normalized device coordinates
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Update drag plane to face camera
      dragPlane.normal.copy(camera.position).normalize();
      dragPlane.constant = -activeCube.position.dot(dragPlane.normal);

      // Find the intersection point with the drag plane
      if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
        // Get the center position
        const centerPos = centerCubeRef.current.position;

        // Snap to grid with smoothing
        tempVec.copy(intersection);
        const snappedPosition = snapToGrid(tempVec);

        // Check if the snapped position is occupied
        if (!isGridPointOccupied(snappedPosition, cubeRefs.current, activeCube)) {
          // Apply position with interpolation for smoother movement
          activeCube.position.lerp(snappedPosition, 0.5);

          // Apply distance constraints
          if (constrainPosition(activeCube, centerPos)) {
            // If position was constrained, snap again
            const constrainedSnappedPos = snapToGrid(activeCube.position);
            if (!isGridPointOccupied(constrainedSnappedPos, cubeRefs.current, activeCube)) {
              activeCube.position.lerp(constrainedSnappedPos, 0.5);
            } else if (originalPosition) {
              activeCube.position.lerp(originalPosition, 0.5);
            }
          }
        } else if (originalPosition) {
          activeCube.position.lerp(originalPosition, 0.5);
        }
      }
    };

    const endDrag = () => {
      if (!isDragging) return;
      
      if (activeCube) {
        // Ensure final position is snapped to grid
        const finalPosition = snapToGrid(activeCube.position);
        if (!isGridPointOccupied(finalPosition, cubeRefs.current, activeCube)) {
          activeCube.position.copy(finalPosition);
        } else if (originalPosition) {
          activeCube.position.copy(originalPosition);
        }
      }
      
      isDragging = false;
      activeCube = null;
      setIsDragging(false);
      mouseState.isDragging.current = false;
      lastUpdateTime = 0;
    };

    controls.addEventListener('dragstart', (event) => {
      if (!event.object || !centerCubeRef.current) return;

      isDragging = true;
      setIsDragging(true);
      activeCube = event.object as THREE.Mesh;
      originalPosition = activeCube.position.clone();
      mouseState.isDragging.current = true;
      lastUpdateTime = performance.now();

      // Update drag plane to face camera
      dragPlane.normal.copy(camera.position).normalize();
      dragPlane.constant = -activeCube.position.dot(dragPlane.normal);
    });

    controls.addEventListener('drag', (event) => {
      if (event.sourceEvent instanceof PointerEvent) {
        updateDragPosition(event.sourceEvent);
      }
    });

    controls.addEventListener('dragend', endDrag);

    // Handle cases where drag might be interrupted
    gl.domElement.addEventListener('pointerup', endDrag);
    gl.domElement.addEventListener('pointercancel', endDrag);
    gl.domElement.addEventListener('pointerleave', endDrag);

    return () => {
      gl.domElement.removeEventListener('pointerup', endDrag);
      gl.domElement.removeEventListener('pointercancel', endDrag);
      gl.domElement.removeEventListener('pointerleave', endDrag);
      controls.dispose();
    };
  }, [camera, gl, cubeRefs, centerCubeRef, mouseState, cubeCount, setIsDragging]);
}