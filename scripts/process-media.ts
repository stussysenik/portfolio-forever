import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = './public/assets/processed';
const WIDTHS = [640, 1280, 1920, 2560];

async function processImage(inputPath: string) {
	const filename = path.basename(inputPath, path.extname(inputPath));
	const metadata = await sharp(inputPath).metadata();
	
	if (!fs.existsSync(OUTPUT_DIR)) {
		fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	}

	const results: any = {
		title: filename,
		width: metadata.width,
		height: metadata.height,
		aspectRatio: `${metadata.width}/${metadata.height}`,
		srcset: {
			avif: [],
			webp: [],
			jpeg: []
		}
	};

	// Generate variants
	for (const width of WIDTHS) {
		if (width > (metadata.width || 0)) continue;

		const avifPath = path.join(OUTPUT_DIR, `${filename}-${width}.avif`);
		await sharp(inputPath)
			.resize(width)
			.toFormat('avif', { quality: 65, effort: 6 })
			.toFile(avifPath);
		results.srcset.avif.push({ width, url: `/assets/processed/${filename}-${width}.avif` });

		const webpPath = path.join(OUTPUT_DIR, `${filename}-${width}.webp`);
		await sharp(inputPath)
			.resize(width)
			.toFormat('webp', { quality: 75 })
			.toFile(webpPath);
		results.srcset.webp.push({ width, url: `/assets/processed/${filename}-${width}.webp` });
	}

	// Blur placeholder
	const blurBase64 = await sharp(inputPath)
		.resize(20)
		.blur()
		.toBuffer()
		.then(buf => `data:image/jpeg;base64,${buf.toString('base64')}`);
	
	results.blurPlaceholder = blurBase64;

	console.log(JSON.stringify(results, null, 2));
}

const input = process.argv[2];
if (input) {
	processImage(input).catch(console.error);
} else {
	console.log("Usage: bun scripts/process-media.ts <path-to-image>");
}
