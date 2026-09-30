const sharp = require('sharp');
const path = require('path');

const srcPath = process.argv[2];
const outPath = process.argv[3];
const size = 512;
const radiusPct = 0.22; // matches the 22% border-radius used across the app

async function main() {
  const img = sharp(srcPath).resize(size, size, { fit: 'cover' });
  const radius = Math.round(size * radiusPct);

  const maskSvg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`
  );

  const rounded = await img
    .ensureAlpha()
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  await sharp(rounded).toFile(outPath);
  console.log('wrote', outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
