import { BaseProject } from './base';

export class BlockchainProject extends BaseProject {
  id = 'project-5';
  type = 'project' as const;
  title = 'Liquid I.V.';
  description = 'Hydration multiplier and wellness products';
  client = 'Liquid I.V.';
  workType = 'Brand Development';
  technologies = ['Product Design', 'E-commerce', 'Marketing'];
  link = 'https://www.liquid-iv.com';
  color = '#0D98FF';
  innerShape = 'sphere' as const;
  images = {
    title: 'Liquid I.V.',
    items: [
      {
        url: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Hydration'
      },
      {
        url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Wellness'
      },
      {
        url: 'https://images.unsplash.com/photo-1502741384106-56538427cde9?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Lifestyle'
      },
      {
        url: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Health'
      }
    ]
  };
}