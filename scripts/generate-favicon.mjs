/**
 * Gera favicon e ícones PWA a partir da logo real (logo-gemeos.png).
 * Coloca a logo centrada sobre fundo branco, com padding proporcional.
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ICONS_DIR = path.join(ROOT, 'public', 'icons');
const SOURCE = path.join(ICONS_DIR, 'logo-gemeos.png');

// Padding como fração do tamanho total (ex: 0.1 = 10% de padding de cada lado)
const PADDING_RATIO = 0.1;

async function generateIcon(size, outputName, opts = {}) {
  const padding = Math.round(size * PADDING_RATIO);
  const innerSize = size - padding * 2;

  const resized = await sharp(SOURCE)
    .resize(innerSize, innerSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: resized, gravity: 'centre' }])
    .png({ quality: 95, compressionLevel: 9 })
    .toFile(path.join(ICONS_DIR, outputName));

  console.log(`  ✓ ${outputName} (${size}x${size})`);
}

async function generateFaviconIco(sizes = [16, 32, 48]) {
  // Gera PNGs temporários para cada tamanho do ICO
  const pngBuffers = [];
  for (const size of sizes) {
    const padding = Math.round(size * 0.05); // menos padding para tamanhos pequenos
    const innerSize = size - padding * 2;

    const resized = await sharp(SOURCE)
      .resize(innerSize, innerSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toBuffer();

    const buf = await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([{ input: resized, gravity: 'centre' }])
      .png()
      .toBuffer();

    pngBuffers.push({ size, buf });
  }

  // Cria o ICO manualmente (formato ICO com PNG entries)
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = dirEntrySize * numImages;

  let offset = headerSize + dirSize;
  const entries = pngBuffers.map(({ size, buf }) => {
    const entry = { size: size >= 256 ? 0 : size, buf, offset };
    offset += buf.length;
    return entry;
  });

  const totalSize = offset;
  const ico = Buffer.alloc(totalSize);

  // ICO Header
  ico.writeUInt16LE(0, 0);     // Reserved
  ico.writeUInt16LE(1, 2);     // Type (1 = ICO)
  ico.writeUInt16LE(numImages, 4); // Count

  // Directory entries
  entries.forEach((e, i) => {
    const pos = headerSize + i * dirEntrySize;
    ico.writeUInt8(e.size, pos);         // Width
    ico.writeUInt8(e.size, pos + 1);     // Height
    ico.writeUInt8(0, pos + 2);          // Color palette
    ico.writeUInt8(0, pos + 3);          // Reserved
    ico.writeUInt16LE(1, pos + 4);       // Color planes
    ico.writeUInt16LE(32, pos + 6);      // Bits per pixel
    ico.writeUInt32LE(e.buf.length, pos + 8);  // Size
    ico.writeUInt32LE(e.offset, pos + 12);     // Offset
  });

  // Image data
  entries.forEach(e => {
    e.buf.copy(ico, e.offset);
  });

  fs.writeFileSync(path.join(ICONS_DIR, 'favicon.ico'), ico);
  console.log(`  ✓ favicon.ico (${sizes.join(', ')}px)`);
}

async function main() {
  console.log('🎨 Gerando ícones a partir da logo real...\n');
  console.log(`  Fonte: ${SOURCE}`);
  console.log(`  Destino: ${ICONS_DIR}\n`);

  // Favicon ICO (16, 32, 48)
  await generateFaviconIco([16, 32, 48]);

  // PWA icons
  await generateIcon(64, 'pwa-64x64.png');
  await generateIcon(192, 'pwa-192x192.png');
  await generateIcon(512, 'pwa-512x512.png');

  // Apple touch icon
  await generateIcon(180, 'apple-touch-icon-180x180.png');

  // Maskable icon (precisa de mais padding - 20% safe zone)
  const maskSize = 512;
  const maskPadding = Math.round(maskSize * 0.20);
  const maskInner = maskSize - maskPadding * 2;

  const maskResized = await sharp(SOURCE)
    .resize(maskInner, maskInner, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: maskSize,
      height: maskSize,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: maskResized, gravity: 'centre' }])
    .png({ quality: 95, compressionLevel: 9 })
    .toFile(path.join(ICONS_DIR, 'maskable-icon-512x512.png'));
  console.log(`  ✓ maskable-icon-512x512.png (512x512, safe zone 20%)`);

  // Copia como favicon-source.png para referência futura
  await sharp(SOURCE)
    .resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(ICONS_DIR, 'favicon-source.png'));
  console.log(`  ✓ favicon-source.png (1024x1024, referência)`);

  console.log('\n✅ Todos os ícones gerados com sucesso!');
}

main().catch(err => {
  console.error('❌ Erro:', err);
  process.exit(1);
});
