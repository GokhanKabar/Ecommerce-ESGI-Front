const API_URL = 'http://localhost:8000';

export default function getImagePath(imageName: string | undefined): string {
  if (!imageName) return '';
  return `${API_URL}/${imageName}`;
}
