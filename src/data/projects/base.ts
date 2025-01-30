import type { CubeData } from '../../types';

export abstract class BaseProject implements CubeData {
  abstract id: string;
  abstract type: 'project' | 'page';
  abstract title: string;
  abstract description: string;
  abstract color: string;
  abstract innerShape: 'cube' | 'sphere' | 'cone' | 'cylinder';
  client?: string;
  workType?: string;
  technologies?: string[];
  link?: string;
  images?: {
    title: string;
    items: Array<{
      url: string;
      caption: string;
    }>;
  };
}