/**
 * Scroll Debug Utility
 * 
 * Tracks scroll position over 10 frames (~160ms) to detect unwanted auto-scrolling.
 * Use this to debug why page auto-scrolls on load.
 * 
 * Usage in +layout.svelte:
 * 
 * import { startScrollTracking, stopScrollTracking, getAnalysis } from '$lib/utils/scroll-debug';
 * 
 * onMount(() => {
 *   startScrollTracking();
 *   setTimeout(() => {
 *     const analysis = getAnalysis();
 *     console.log('Scroll Analysis:', analysis);
 *     if (analysis?.autoScrollDetected) {
 *       console.warn('AUTO-SCROLL DETECTED!', analysis.suspiciousMovements);
 *     }
 *   }, 200); // Wait for 10 frames
 * });
 */

interface ScrollEvent {
	timestamp: number;
	scrollY: number;
	scrollX: number;
}

interface ScrollAnalysis {
	initialPosition: { x: number; y: number };
	finalPosition: { x: number; y: number };
	totalMovements: number;
	events: ScrollEvent[];
	autoScrollDetected: boolean;
	suspiciousMovements: Array<{ from: number; to: number; delay: number }>;
}

const TRACKING_FRAMES = 10;
const FRAME_INTERVAL = 16; // ~60fps

let scrollHistory: ScrollEvent[] = [];
let trackingActive = false;
let analysisResult: ScrollAnalysis | null = null;
let timeoutId: ReturnType<typeof setTimeout> | null = null;

export function startScrollTracking(): void {
	if (typeof window === 'undefined' || trackingActive) return;

	scrollHistory = [];
	trackingActive = true;
	analysisResult = null;

	const initialScroll: ScrollEvent = {
		timestamp: performance.now(),
		scrollY: window.scrollY,
		scrollX: window.scrollX
	};

	scrollHistory.push(initialScroll);

	console.log('[SCROLL DEBUG] Tracking started. Initial position:', initialScroll);

	let frameCount = 0;

	function trackFrame() {
		if (frameCount >= TRACKING_FRAMES || !trackingActive) {
			stopScrollTracking();
			return;
		}

		frameCount++;
		const currentScroll: ScrollEvent = {
			timestamp: performance.now(),
			scrollY: window.scrollY,
			scrollX: window.scrollX
		};

		scrollHistory.push(currentScroll);

		// Check if scroll position changed
		const prevScroll = scrollHistory[scrollHistory.length - 2];
		if (prevScroll && currentScroll.scrollY !== prevScroll.scrollY) {
			const delta = currentScroll.scrollY - prevScroll.scrollY;
			console.log(
				`[SCROLL DEBUG] Frame ${frameCount}: Y changed ${prevScroll.scrollY} → ${currentScroll.scrollY} (delta: ${delta})`
			);
		}

		timeoutId = setTimeout(() => requestAnimationFrame(trackFrame), FRAME_INTERVAL);
	}

	requestAnimationFrame(trackFrame);
}

export function stopScrollTracking(): void {
	if (!trackingActive) return;

	trackingActive = false;
	if (timeoutId) {
		clearTimeout(timeoutId);
		timeoutId = null;
	}

	analysisResult = analyzeScrollBehavior();
	console.log('[SCROLL DEBUG] Tracking stopped. Analysis:', analysisResult);
}

function analyzeScrollBehavior(): ScrollAnalysis {
	if (scrollHistory.length === 0) {
		return {
			initialPosition: { x: 0, y: 0 },
			finalPosition: { x: 0, y: 0 },
			totalMovements: 0,
			events: [],
			autoScrollDetected: false,
			suspiciousMovements: []
		};
	}

	const initial = scrollHistory[0];
	const final = scrollHistory[scrollHistory.length - 1];

	const movements: Array<{ from: number; to: number; delay: number }> = [];
	let autoScrollDetected = false;

	for (let i = 1; i < scrollHistory.length; i++) {
		const prev = scrollHistory[i - 1];
		const curr = scrollHistory[i];

		if (curr.scrollY !== prev.scrollY) {
			const delta = curr.scrollY - prev.scrollY;
			const delay = curr.timestamp - prev.timestamp;

			// Suspicious: large movement (>50px) or very fast (<50ms)
			if (Math.abs(delta) > 50 || delay < 50) {
				movements.push({
					from: prev.scrollY,
					to: curr.scrollY,
					delay
				});
				autoScrollDetected = true;
			}
		}
	}

	return {
		initialPosition: { x: initial.scrollX, y: initial.scrollY },
		finalPosition: { x: final.scrollX, y: final.scrollY },
		totalMovements: movements.length,
		events: scrollHistory,
		autoScrollDetected,
		suspiciousMovements: movements
	};
}

export function getAnalysis(): ScrollAnalysis | null {
	return analysisResult;
}

export function resetAnalysis(): void {
	scrollHistory = [];
	analysisResult = null;
	trackingActive = false;
}