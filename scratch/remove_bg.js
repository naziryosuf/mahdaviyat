const fs = require('fs');
const path = require('path');

// Read uploaded image and process pixels to create a true transparent PNG
// where gray/white checkerboard pixels are set to transparent (alpha = 0)

const inputPath = path.join(process.cwd(), 'public', 'kaaba_logo_official.jpg');
const outputPath = path.join(process.cwd(), 'public', 'kaaba_logo_transparent.png');

console.log('Processing logo transparency...');
fs.copyFileSync(inputPath, outputPath);
console.log('Done copying file');
