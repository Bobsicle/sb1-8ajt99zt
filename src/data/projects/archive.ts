import { BaseProject } from './base';

export class ClientsPage extends BaseProject {
  id = 'clients';
  type = 'page' as const;
  title = 'Clients';
  description = 'Our valued partners';
  color = '#FF0DAF';
  innerShape = 'cylinder' as const;
  images = {
    title: 'Our Clients',
    items: [
      {
        url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Corporate Office'
      },
      {
        url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Client Meeting'
      },
      {
        url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Business Strategy'
      },
      {
        url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Team Collaboration'
      }
    ]
  };
}