const API_URL = 'http://parfums-esgi.store/api';

export default function getImagePath(imageName: string | undefined): string {
  if (!imageName) return '';
  return `${API_URL}/${imageName}`;
}
