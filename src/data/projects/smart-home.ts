import { BaseProject } from './base';

export class SmartHomeProject extends BaseProject {
  id = 'project-6';
  type = 'project' as const;
  title = 'Glue Factory';
  description = 'Creative studio and production house';
  client = 'Glue Factory';
  workType = 'Creative Direction';
  technologies = ['Design', 'Production', 'Creative'];
  link = 'https://example.com/glue-factory';
  color = '#0D98FF';
  innerShape = 'sphere' as const;
  images = {
    title: 'Glue Factory',
    items: [
      {
        url: 'https://images.unsplash.com/photo-1524234107056-1c1f48f64ab8?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Creative Studio'
      },
      {
        url: 'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Design'
      },
      {
        url: 'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Production'
      },
      {
        url: 'https://images.unsplash.com/photo-1497015289639-54688650d173?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Creative Work'
      }
    ]
  };
}