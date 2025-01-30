import { BaseProject } from './base';

export class NonCommercialProject extends BaseProject {
  id = 'non-commercial';
  type = 'project' as const;
  title = 'Non Commercial';
  description = 'Non-commercial projects';
  color = '#FF520D';
  innerShape = 'cone' as const;
  images = {
    title: 'Non Commercial Projects',
    items: [
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Experimental Art Installation'
      },
      {
        url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Interactive Music Experience'
      },
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Community Workshop'
      },
      {
        url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Digital Art Exhibition'
      }
    ]
  };
}