import * as THREE from 'three';

export const CUBE_COUNT = 8;
export const RADIUS = 7;
export const MAX_DISTANCE = 8;
export const MIN_DISTANCE = 3;
export const CURVE_SEGMENTS = 6; // Default for desktop
export const CAMERA_DAMPING = 0.85;
export const CAMERA_SENSITIVITY = 0.003; // Default for desktop
export const MAX_ROTATION_SPEED = 0.05;
export const ROTATION_SMOOTHING = 0.05;
export const GRID_SIZE = 1;
export const GRID_EXTENT = 7; // Default grid extent
export const GRID_POINT_SIZE = 0.5;
export const COLOR_INFLUENCE_DISTANCE = 7; // Default influence distance

// Mobile-specific settings
export const MOBILE_SETTINGS = {
  ANIMATION_FRAME_SKIP: 2,
  GRID_UPDATE_INTERVAL: 200,
  RADIUS_SCALE: 0.8,
  GRID_EXTENT: 5,
  COLOR_INFLUENCE_DISTANCE: 5,
  CURVE_SEGMENTS: 3, // Reduced curve segments for mobile
  CAMERA_SENSITIVITY: 0.006 // Increased sensitivity for mobile
};

export const COLOR_FALLOFF_STEPS = 5;
export const SNAP_SMOOTHING = 0.15;

// Reusable vectors
export const tempVector = new THREE.Vector3();
export const tempVector2 = new THREE.Vector3();
export const tempColor = new THREE.Color();