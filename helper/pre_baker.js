import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIGURATION
const INPUT_IMAGE = path.join(__dirname, '..', 'public','idol.png'); // Put your image in the same folder
// This moves UP one directory out of 'helper', then into 'public'
const OUTPUT_JSON = path.join(__dirname, '..', 'src', 'assets','baked-particles_250.json');
const TARGET_WIDTH = 400; 

async function bakeImage() {
  try {
    console.log("Starting particle baking process...");
    
    const { data, info } = await sharp(INPUT_IMAGE)
      .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height } = info;
    const positions = [];
    const colors = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const alpha = data[idx + 3];

        if (alpha > 100) {
          const px = (x - width / 2) * 0.05;
          const py = ((height - y) - height / 2) * 0.05; 
          const pz = 0;

          const r = data[idx] / 255;
          const g = data[idx + 1] / 255;
          const b = data[idx + 2] / 255;

          positions.push(Number(px.toFixed(4)), Number(py.toFixed(4)), pz);
          colors.push(Number(r.toFixed(3)), Number(g.toFixed(3)), Number(b.toFixed(3)));
        }
      }
    }

    // Ensure the output directory exists
    const dir = path.dirname(OUTPUT_JSON);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    const outputData = { positions, colors };
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(outputData));
    
    console.log(`\x1b[32m✔ Success! Baked ${positions.length / 3} particles into ${OUTPUT_JSON}\x1b[0m`);
  } catch (err) {
    console.error("\x1b[31mBaking failed:\x1b[0m", err.message);
  }
}

bakeImage();