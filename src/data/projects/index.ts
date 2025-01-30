import { ContactPage } from './contact';
import { ClientsPage } from './archive';
import { NonCommercialProject } from './non-commercial';
import { AIImageProject } from './ai-image';
import { VRProject } from './vr';
import { BlockchainProject } from './blockchain';
import type { CubeData } from '../../types';

export const CUBE_DATA: CubeData[] = [
  new ContactPage(),
  new ClientsPage(),
  new NonCommercialProject(),
  new AIImageProject(),
  new VRProject(),
  new BlockchainProject()
];

export * from './base';
export * from './contact';
export * from './archive';
export * from './non-commercial';
export * from './ai-image';
export * from './vr';
export * from './blockchain';