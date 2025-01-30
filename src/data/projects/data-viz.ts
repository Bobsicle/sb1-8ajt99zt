import { BaseProject } from './base';

export class DataVizProject extends BaseProject {
  id = 'project-2';
  type = 'project' as const;
  title = 'Andre Power';
  description = 'Music and visual artist';
  client = 'Andre Power';
  workType = 'Artist Development';
  technologies = ['Music', 'Visual Arts', 'Events'];
  link = 'https://soundcloud.com/andrepower';
  color = '#0D98FF';
  innerShape = 'sphere' as const;
  images = {
    title: 'Andre Power',
    items: [
      {
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Performance'
      },
      {
        url: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Studio'
      },
      {
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Music'
      },
      {
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Live'
      }
    ]
  };
}