import { BaseProject } from './base';

export class VRProject extends BaseProject {
  id = 'project-4';
  type = 'project' as const;
  title = 'Maison Valentino';
  description = 'Luxury fashion house';
  client = 'Valentino';
  workType = 'Fashion & Luxury';
  technologies = ['Fashion', 'Luxury', 'Design'];
  link = 'https://www.valentino.com';
  color = '#0D98FF';
  innerShape = 'sphere' as const;
  images = {
    title: 'Maison Valentino',
    items: [
      {
        url: '/images/valentino/1.png',
        caption: 'Fashion Week'
      },
      {
        url: '/images/valentino/2.png',
        caption: 'Runway'
      },
      {
        url: '/images/valentino/3.png',
        caption: 'Couture'
      },
      {
        url: '/images/valentino/4.png',
        caption: 'Fashion Show'
      },
      {
        url: '/images/valentino/5.png',
        caption: 'Elegance'
      },
      {
        url: '/images/valentino/6.png',
        caption: 'Atelier'
      }
    ]
  };
}