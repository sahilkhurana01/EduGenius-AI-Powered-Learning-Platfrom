/**
 * This script generates PWA icons of different sizes from the source image
 * To run: npm install -D sharp && node scripts/generate-icons.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/assets/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Source image
const sourceImage = path.join(__dirname, '../public/edugenius logo.png');

// Icon sizes to generate
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  try {
    for (const size of sizes) {
      const outputFile = path.join(iconsDir, `icon-${size}x${size}.png`);
      
      await sharp(sourceImage)
        .resize(size, size)
        .toFile(outputFile);
      
      console.log(`Generated ${outputFile}`);
    }
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 