<script lang="ts">
	// SVG geometric patterns per section type
	// Penrose, Voronoi, Hyperbolic, Grid — all low-opacity, scroll-animated

	export let pattern: "penrose" | "voronoi" | "hyperbolic" | "grid" = "penrose";
	export let opacity = 0.04;
</script>

<div class="geo-bg" style:opacity={opacity}>
	{#if pattern === "penrose"}
		<!-- Penrose-inspired aperiodic rhombus tiling -->
		<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
			<g stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.6">
				{#each Array(12) as _, i}
					{@const angle = (i * 30) * Math.PI / 180}
					{@const cx = 200 + Math.cos(angle) * 120}
					{@const cy = 200 + Math.sin(angle) * 120}
					<polygon points="{cx},{cy - 30} {cx + 18},{cy} {cx},{cy + 30} {cx - 18},{cy}" />
					<line x1="200" y1="200" x2={cx} y2={cy} />
				{/each}
				{#each Array(5) as _, i}
					{@const r = 40 + i * 35}
					<circle cx="200" cy="200" r={r} />
				{/each}
			</g>
		</svg>

	{:else if pattern === "voronoi"}
		<!-- Voronoi-inspired tessellation -->
		<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
			<g stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.5">
				{#each [
					"50,20 120,80 90,160 30,140",
					"120,80 220,40 240,130 170,150 90,160",
					"220,40 350,30 360,120 300,150 240,130",
					"30,140 90,160 80,260 20,240",
					"90,160 170,150 200,250 140,280 80,260",
					"170,150 240,130 300,150 280,250 200,250",
					"300,150 360,120 380,230 330,270 280,250",
					"80,260 140,280 120,370 30,350",
					"140,280 200,250 250,350 180,380 120,370",
					"200,250 280,250 330,270 320,370 250,350",
				] as points}
					<polygon {points} />
				{/each}
			</g>
		</svg>

	{:else if pattern === "hyperbolic"}
		<!-- Hyperbolic geometry inspired pattern -->
		<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
			<g stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.5">
				<circle cx="200" cy="200" r="180" />
				{#each Array(8) as _, i}
					{@const a = (i * 45) * Math.PI / 180}
					{@const r = 180}
					<path d="M 200 200 Q {200 + Math.cos(a) * r * 0.6} {200 + Math.sin(a) * r * 0.6} {200 + Math.cos(a) * r} {200 + Math.sin(a) * r}" />
					{@const a2 = ((i + 0.5) * 45) * Math.PI / 180}
					<circle cx={200 + Math.cos(a) * 90} cy={200 + Math.sin(a) * 90} r="40" />
				{/each}
				{#each Array(16) as _, i}
					{@const a = (i * 22.5) * Math.PI / 180}
					<circle cx={200 + Math.cos(a) * 140} cy={200 + Math.sin(a) * 140} r="20" />
				{/each}
			</g>
		</svg>

	{:else if pattern === "grid"}
		<!-- Matrix/grid pattern -->
		<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
			<g stroke="currentColor" stroke-width="0.3" fill="none" opacity="0.4">
				{#each Array(20) as _, i}
					<line x1={i * 20} y1="0" x2={i * 20} y2="400" />
					<line x1="0" y1={i * 20} x2="400" y2={i * 20} />
				{/each}
				{#each Array(5) as _, i}
					{@const x = 40 + i * 80}
					{@const y = 40 + i * 60}
					<rect x={x - 4} y={y - 4} width="8" height="8" fill="currentColor" opacity="0.3" />
				{/each}
			</g>
		</svg>
	{/if}
</div>

<style>
	.geo-bg {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: -1;
		color: var(--color-text);
	}

	.geo-bg svg {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
