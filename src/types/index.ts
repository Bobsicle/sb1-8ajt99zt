import * as THREE from 'three';

export interface MouseState {
  isDragging: React.MutableRefObject<boolean>;
  previousPosition: React.MutableRefObject<{ x: number; y: number }>;
  velocity: React.MutableRefObject<{ x: number; y: number }>;
  targetRotation: React.MutableRefObject<{ x: number; y: number }>;
  currentRotation: React.MutableRefObject<{ x: number; y: number }>;
}

export interface ProjectImage {
  url: string;
  caption: string;
}

export interface ProjectImages {
  title: string;
  items: ProjectImage[];
}

export const MAX_PROJECT_IMAGES = 35;

export interface CubeData {
  id: string;
  type: 'project' | 'page';
  title: string;
  description: string;
  client?: string;
  workType?: string;
  technologies?: string[];
  link?: string;
  color: string;
  innerShape: 'cube' | 'sphere' | 'cone' | 'cylinder';
  images?: ProjectImages;
}

// Re-export CUBE_DATA from the data directory
export { CUBE_DATA } from '../data/projects';