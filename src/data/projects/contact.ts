import { BaseProject } from './base';

export class ContactPage extends BaseProject {
  id = 'contact';
  type = 'page' as const;
  title = 'Contact';
  description = 'Get in touch';
  color = '#C1FF0D';
  innerShape = 'cube' as const;
}