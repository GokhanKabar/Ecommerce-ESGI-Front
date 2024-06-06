export default function getImagePath(imageName: string): string {
  try {
    return new URL(`../assets/${imageName}`, import.meta.url).href
  } catch (e) {
    return new URL(`../assets/dior.png`, import.meta.url).href // Default image if not found
  }
}
