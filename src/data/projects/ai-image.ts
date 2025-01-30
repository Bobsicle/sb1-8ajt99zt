import { BaseProject } from './base';

export class AIImageProject extends BaseProject {
  id = 'project-3';
  type = 'project' as const;
  title = 'Masego';
  description = 'Advanced AI image generation tool';
  client = 'ArtificialLabs';
  workType = 'Machine Learning Engineering';
  technologies = ['Python', 'TensorFlow', 'React'];
  link = 'https://github.com/example/project3';
  color = '#0D98FF';
  innerShape = 'sphere' as const;
  images = {
    title: 'Masego',
    items: [
      {
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Live Performance'
      },
      {
        url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Studio Session'
      },
      {
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Saxophone'
      },
      {
        url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Concert'
      },
      {
        url: 'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Stage Performance'
      },
      {
        url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Music Studio'
      },
      {
        url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Recording'
      },
      {
        url: 'https://images.unsplash.com/photo-1517722014278-c256a91a6fba?auto=format&w=800&q=75&fit=crop&fm=webp',
        caption: 'Jazz'
      }
    ]
  };
}