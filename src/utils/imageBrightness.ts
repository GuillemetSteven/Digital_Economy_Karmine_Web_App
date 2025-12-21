import { IMAGE_BRIGHTNESS } from '../constants/ui';

/**
 * Detects if an image is predominantly light or dark
 * Analyzes the central 50% of the image to avoid edge artifacts
 *
 * @param imgSrc - URL or path to the image
 * @returns Promise that resolves to true if image is light, false if dark
 */
export async function detectImageBrightness(imgSrc: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgSrc;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(false); // Fallback to dark theme
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Sample central 50% of the image (avoid edge artifacts)
      const imageData = ctx.getImageData(
        img.width * 0.25,
        img.height * 0.25,
        img.width * 0.5,
        img.height * 0.5
      );

      let totalBrightness = 0;
      const pixels = imageData.data;

      // Calculate average brightness across all pixels
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        // Simple average of RGB values
        totalBrightness += (r + g + b) / 3;
      }

      const avgBrightness = totalBrightness / (pixels.length / 4);

      // Use threshold from constants (127 on 0-255 scale = 50% brightness)
      resolve(avgBrightness > IMAGE_BRIGHTNESS.LIGHT_THRESHOLD);
    };

    img.onerror = () => {
      // Fallback to dark theme on error
      resolve(false);
    };
  });
}
