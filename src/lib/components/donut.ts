/**
 * High-trust Donut Engine.
 * Ported from clj/portfolio/components/donut.cljs
 */

export const width = 80;
export const height = 24;
export const bufferSize = width * height;
const chars = ".,-~:;=!*%#@";

const TAU = 2 * Math.PI;

export interface DonutBuffers {
	b: Uint8Array;
	z: Float32Array;
}

export function createBuffers(): DonutBuffers {
	return {
		b: new Uint8Array(bufferSize),
		z: new Float32Array(bufferSize),
	};
}

function calculateLuminance(
	sinI: number,
	cosJ: number,
	sinA: number,
	sinJ: number,
	cosA: number,
	cosB: number,
	cosI: number,
	sinB: number
) {
	const L =
		(sinJ * sinA - sinI * cosJ * cosA) * cosB -
		sinI * cosJ * sinA -
		sinJ * cosA -
		cosI * cosJ * sinB;
	return Math.floor(8 * L);
}

export function computeFrame(buffers: DonutBuffers, a: number, b: number): string {
	const { b: bArr, z: zArr } = buffers;
	const sinA = Math.sin(a);
	const cosA = Math.cos(a);
	const sinB = Math.sin(b);
	const cosB = Math.cos(b);

	bArr.fill(32); // Space
	zArr.fill(0);

	for (let j = 0; j < TAU; j += 0.07) {
		const sinJ = Math.sin(j);
		const cosJ = Math.cos(j);

		for (let i = 0; i < TAU; i += 0.02) {
			const sinI = Math.sin(i);
			const cosI = Math.cos(i);

			const h = cosJ + 2;
			const d = 1 / (sinI * h * sinA + sinJ * cosA + 5);
			const t = sinI * h * cosA - sinJ * sinA;

			const x = Math.floor(40 + 30 * d * (cosI * h * cosB - t * sinB));
			const y = Math.floor(12 + 15 * d * (cosI * h * sinB + t * cosB));
			const o = x + width * y;

			const n = calculateLuminance(sinI, cosJ, sinA, sinJ, cosA, cosB, cosI, sinB);

			if (y >= 0 && y < height && x >= 0 && x < width && d > zArr[o]) {
				zArr[o] = d;
				const charIdx = Math.min(chars.length - 1, Math.max(0, n));
				bArr[o] = chars.charCodeAt(charIdx);
			}
		}
	}

	let result = "";
	for (let k = 0; k < bufferSize; k++) {
		result += String.fromCharCode(bArr[k]);
		if ((k + 1) % width === 0) result += "\n";
	}
	return result;
}
