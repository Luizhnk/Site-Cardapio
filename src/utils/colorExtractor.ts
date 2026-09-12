/**
 * Utility to extract dominant and vibrant accent colors from an image URL or Data URL
 * using HTML5 Canvas pixel analysis.
 */

interface ExtractedColors {
  primary: string;
  secondary: string;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getHsv(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s, v };
}

export async function extractColorsFromImage(imageSrc: string): Promise<ExtractedColors> {
  return new Promise((resolve) => {
    // Default fallback
    const fallback: ExtractedColors = {
      primary: '#E11D48',
      secondary: '#0F172A',
    };

    if (!imageSrc) {
      resolve(fallback);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(fallback);
          return;
        }

        const width = 100;
        const height = 100;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height).data;

        const colorCounts: { [key: string]: { r: number; g: number; b: number; count: number; sat: number } } = {};

        for (let i = 0; i < imgData.length; i += 4) {
          const a = imgData[i + 3];
          if (a < 128) continue; // transparent

          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];

          // Skip near-white or near-black backgrounds
          const isNearWhite = r > 235 && g > 235 && b > 235;
          const isNearBlack = r < 25 && g < 25 && b < 25;
          if (isNearWhite || isNearBlack) continue;

          // Quantize to reduce noise (step of 16)
          const qr = Math.floor(r / 16) * 16;
          const qg = Math.floor(g / 16) * 16;
          const qb = Math.floor(b / 16) * 16;
          const key = `${qr},${qg},${qb}`;

          const { s, v } = getHsv(r, g, b);
          // Boost score for saturated colors
          const weight = 1 + s * 2 + (v > 0.3 && v < 0.9 ? 1 : 0);

          if (!colorCounts[key]) {
            colorCounts[key] = { r: qr, g: qg, b: qb, count: weight, sat: s };
          } else {
            colorCounts[key].count += weight;
          }
        }

        const sorted = Object.values(colorCounts).sort((a, b) => b.count - a.count);

        if (sorted.length === 0) {
          resolve(fallback);
          return;
        }

        // Most prominent vibrant color is primary
        const primaryObj = sorted[0];
        const primary = rgbToHex(primaryObj.r, primaryObj.g, primaryObj.b);

        // Find a secondary color that has distinct hue or tone
        let secondaryObj = sorted.find(c => {
          const diffR = Math.abs(c.r - primaryObj.r);
          const diffG = Math.abs(c.g - primaryObj.g);
          const diffB = Math.abs(c.b - primaryObj.b);
          return (diffR + diffG + diffB) > 90;
        });

        if (!secondaryObj && sorted.length > 1) {
          secondaryObj = sorted[1];
        }

        let secondary = secondaryObj 
          ? rgbToHex(secondaryObj.r, secondaryObj.g, secondaryObj.b)
          : '#1E293B';

        resolve({ primary, secondary });
      } catch (err) {
        console.warn('Could not extract colors from image canvas (CORS or error):', err);
        resolve(fallback);
      }
    };

    img.onerror = () => {
      resolve(fallback);
    };

    img.src = imageSrc;
  });
}
