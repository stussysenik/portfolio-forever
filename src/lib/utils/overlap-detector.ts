/**
 * Overlap Detector — visual diagnostic for element overlap issues.
 * Toggle with Ctrl+Option+Shift+D.
 *
 * Scans viewport elements for bounding-box intersections, highlights
 * overlap zones in red, and reports details to the console.
 * Live-watches DOM mutations, scroll, and resize.
 */

interface OverlapHit {
	elA: Element;
	elB: Element;
	aRect: DOMRect;
	bRect: DOMRect;
	area: number;
	aZ: string;
	bZ: string;
	aPos: string;
	bPos: string;
	aPE: string;
	bPE: string;
}

const ATTR = 'data-overlap-detector';
const STYLE_ID = 'overlap-detector-styles';
const MIN_SIZE = 10;   // ignore elements smaller than 10px
const MIN_AREA = 100;  // ignore overlap zones < 100 sq px

class OverlapDetector {
	private on = false;
	private overlays: HTMLElement[] = [];
	private badge: HTMLElement | null = null;
	private observer: MutationObserver | null = null;
	private unbindScroll: (() => void) | null = null;
	private unbindResize: (() => void) | null = null;
	private scanning = false;

	toggle() {
		this.on ? this.off() : this.activate();
	}

	/* ── lifecycle ───────────────────────────────────── */

	private activate() {
		this.on = true;
		this.injectStyles();
		this.showBadge();
		console.log('%c[overlap] ON — scanning viewport', 'color:#f44;font-weight:bold;font-size:13px');
		this.scan();
		this.watch();
	}

	private off() {
		this.on = false;
		this.clearOverlays();
		this.unwatch();
		this.hideBadge();
		this.removeStyles();
		console.log('%c[overlap] OFF', 'color:#888;font-weight:bold;font-size:13px');
	}

	/* ── scanning ────────────────────────────────────── */

	private scan() {
		if (this.scanning || !this.on) return;
		this.scanning = true;

		// disconnect observer momentarily to avoid mutation feedback loop
		this.observer?.disconnect();

		this.clearOverlays();
		const candidates = this.gather();
		const hits = this.detect(candidates);
		this.draw(hits);
		this.report(hits);
		this.updateBadge(hits.length);

		// reconnect observer
		if (this.on) this.observeDOM();
		this.scanning = false;
	}

	/** Collect visible, meaningful elements in the viewport */
	private gather(): { el: Element; rect: DOMRect }[] {
		const out: { el: Element; rect: DOMRect }[] = [];
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const all = document.querySelectorAll('*');

		for (const el of all) {
			if ((el as HTMLElement).hasAttribute?.(ATTR)) continue;

			const s = getComputedStyle(el);
			if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') continue;

			const r = el.getBoundingClientRect();
			if (r.width < MIN_SIZE || r.height < MIN_SIZE) continue;
			if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) continue;

			// Skip purely structural wrappers with no visual footprint
			if (
				s.backgroundColor === 'rgba(0, 0, 0, 0)' &&
				s.backgroundImage === 'none' &&
				s.borderTopWidth === '0px' &&
				s.borderBottomWidth === '0px' &&
				s.borderLeftWidth === '0px' &&
				s.borderRightWidth === '0px' &&
				s.boxShadow === 'none' &&
				s.outline === '' &&
				!el.textContent?.trim() &&
				!(el as HTMLElement).querySelector?.('img, svg, video, canvas')
			) continue;

			out.push({ el, rect: r });
		}
		return out;
	}

	/** O(n^2) bounding-box sweep, filtered */
	private detect(items: { el: Element; rect: DOMRect }[]): OverlapHit[] {
		const hits: OverlapHit[] = [];

		for (let i = 0; i < items.length; i++) {
			for (let j = i + 1; j < items.length; j++) {
				const a = items[i], b = items[j];

				// parent-child overlap is expected
				if (a.el.contains(b.el) || b.el.contains(a.el)) continue;

				if (!this.intersects(a.rect, b.rect)) continue;

				const area = this.overlapArea(a.rect, b.rect);
				if (area < MIN_AREA) continue;

				const sa = getComputedStyle(a.el);
				const sb = getComputedStyle(b.el);

				hits.push({
					elA: a.el,
					elB: b.el,
					aRect: a.rect,
					bRect: b.rect,
					area,
					aZ: sa.zIndex,
					bZ: sb.zIndex,
					aPos: sa.position,
					bPos: sb.position,
					aPE: sa.pointerEvents,
					bPE: sb.pointerEvents,
				});
			}
		}

		hits.sort((a, b) => b.area - a.area);
		return hits;
	}

	/* ── geometry ─────────────────────────────────────── */

	private intersects(a: DOMRect, b: DOMRect) {
		return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
	}

	private overlapArea(a: DOMRect, b: DOMRect) {
		const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
		const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
		return Math.max(0, x) * Math.max(0, y);
	}

	/* ── visual ───────────────────────────────────────── */

	private draw(hits: OverlapHit[]) {
		for (const h of hits) {
			const left = Math.max(h.aRect.left, h.bRect.left);
			const top = Math.max(h.aRect.top, h.bRect.top);
			const w = Math.min(h.aRect.right, h.bRect.right) - left;
			const hh = Math.min(h.aRect.bottom, h.bRect.bottom) - top;

			const div = document.createElement('div');
			div.setAttribute(ATTR, '1');
			div.className = 'od-zone';
			div.style.cssText = `
				position:fixed;
				left:${left}px;top:${top}px;
				width:${w}px;height:${hh}px;
				z-index:99999;pointer-events:none;
			`;

			// tooltip on hover (pointer-events re-enabled on hover via CSS)
			div.title = `${this.label(h.elA)}  ×  ${this.label(h.elB)}\n${Math.round(h.area)}px²`;

			document.body.appendChild(div);
			this.overlays.push(div);
		}
	}

	private clearOverlays() {
		for (const el of this.overlays) el.remove();
		this.overlays = [];
	}

	/* ── console ──────────────────────────────────────── */

	private report(hits: OverlapHit[]) {
		if (!hits.length) {
			console.log('%c[overlap] clean — 0 overlaps', 'color:#4CAF50;font-weight:bold');
			return;
		}

		console.groupCollapsed(`%c[overlap] ${hits.length} overlap(s)`, 'color:#f44;font-weight:bold');
		console.table(
			hits.map((h, i) => ({
				'#': i + 1,
				'A': this.label(h.elA),
				'B': this.label(h.elB),
				'px²': Math.round(h.area),
				'A z': h.aZ,
				'B z': h.bZ,
				'A pos': h.aPos,
				'B pos': h.bPos,
				'A ptr': h.aPE,
				'B ptr': h.bPE,
			})),
		);

		// flag suspicious patterns
		for (const h of hits) {
			if (h.aPE === 'none' && h.bPE === 'auto') {
				console.warn(`[overlap] click-through: "${this.label(h.elA)}" (ptr:none) covers "${this.label(h.elB)}" (ptr:auto)`);
			}
			const zA = parseInt(h.aZ) || 0;
			const zB = parseInt(h.bZ) || 0;
			if (h.aPE === 'auto' && h.bPE === 'auto' && zA !== zB) {
				console.warn(`[overlap] z-fight: "${this.label(h.elA)}" z:${zA} vs "${this.label(h.elB)}" z:${zB}`);
			}
		}

		console.groupEnd();
	}

	private label(el: Element): string {
		const tag = el.tagName.toLowerCase();
		const id = el.id ? `#${el.id}` : '';
		const cls =
			typeof el.className === 'string'
				? '.' + el.className.split(/\s+/).filter(Boolean).slice(0, 2).join('.')
				: '';
		const txt = (el.textContent || '').trim().slice(0, 16);
		return `${tag}${id}${cls}${txt ? ` "${txt}…"` : ''}`;
	}

	/* ── badge ────────────────────────────────────────── */

	private showBadge() {
		const b = document.createElement('div');
		b.setAttribute(ATTR, '1');
		b.style.cssText = `
			position:fixed;top:4px;right:4px;z-index:100000;
			font:bold 11px/1.4 monospace;padding:2px 8px;
			border-radius:3px;pointer-events:none;opacity:.92;
			color:#fff;background:#f44;
		`;
		b.textContent = 'OVERLAP …';
		document.body.appendChild(b);
		this.badge = b;
	}

	private updateBadge(n: number) {
		if (!this.badge) return;
		this.badge.textContent = n ? `OVERLAP: ${n}` : 'OVERLAP: 0 ✓';
		this.badge.style.background = n ? '#f44' : '#4CAF50';
	}

	private hideBadge() {
		this.badge?.remove();
		this.badge = null;
	}

	/* ── styles ───────────────────────────────────────── */

	private injectStyles() {
		if (document.getElementById(STYLE_ID)) return;
		const s = document.createElement('style');
		s.id = STYLE_ID;
		s.textContent = `
			@keyframes od-pulse {
				0%   { background: rgba(255,0,0,.35); }
				100% { background: rgba(255,0,0,.12); }
			}
			.od-zone {
				background: rgba(255,0,0,.15);
				border: 1px solid rgba(255,0,0,.55);
				animation: od-pulse .8s ease-out;
			}
		`;
		document.head.appendChild(s);
	}

	private removeStyles() {
		document.getElementById(STYLE_ID)?.remove();
	}

	/* ── watchers ─────────────────────────────────────── */

	private watch() {
		this.observeDOM();

		const debouncedScan = this.debounce(() => this.scan(), 250);
		const onScroll = debouncedScan;
		const onResize = debouncedScan;

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize, { passive: true });
		this.unbindScroll = () => window.removeEventListener('scroll', onScroll);
		this.unbindResize = () => window.removeEventListener('resize', onResize);
	}

	private observeDOM() {
		if (!this.observer) {
			this.observer = new MutationObserver(this.debounce(() => this.scan(), 350));
		}
		this.observer.observe(document.body, {
			attributes: true,
			childList: true,
			subtree: true,
			attributeFilter: ['class', 'style'],
		});
	}

	private unwatch() {
		this.observer?.disconnect();
		this.observer = null;
		this.unbindScroll?.();
		this.unbindResize?.();
		this.unbindScroll = null;
		this.unbindResize = null;
	}

	/* ── util ─────────────────────────────────────────── */

	private debounce(fn: () => void, ms: number) {
		let t: ReturnType<typeof setTimeout>;
		return () => {
			clearTimeout(t);
			t = setTimeout(fn, ms);
		};
	}
}

export const overlapDetector = new OverlapDetector();
