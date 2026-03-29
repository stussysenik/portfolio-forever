<script lang="ts">
	// Commutative diagram: objects connected by morphism arrows
	// Animated draw-on-scroll effect

	export let opacity = 0.08;

	interface DiagramNode {
		label: string;
		x: number;
		y: number;
	}

	const nodes: DiagramNode[] = [
		{ label: "A", x: 50, y: 50 },
		{ label: "B", x: 250, y: 50 },
		{ label: "C", x: 250, y: 200 },
		{ label: "D", x: 50, y: 200 },
	];

	const arrows: [number, number, string][] = [
		[0, 1, "f"],
		[1, 2, "g"],
		[0, 2, "g∘f"],
		[0, 3, "h"],
		[3, 2, "k"],
	];
</script>

<svg class="category-diagram" viewBox="0 0 300 250" style:opacity={opacity}>
	<defs>
		<marker id="cat-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
			<polygon points="0 0, 8 3, 0 6" fill="currentColor" />
		</marker>
	</defs>

	<!-- Arrows (morphisms) -->
	{#each arrows as [from, to, label]}
		{@const n1 = nodes[from]}
		{@const n2 = nodes[to]}
		{@const mx = (n1.x + n2.x) / 2}
		{@const my = (n1.y + n2.y) / 2}
		{@const dx = n2.x - n1.x}
		{@const dy = n2.y - n1.y}
		{@const len = Math.sqrt(dx * dx + dy * dy)}
		{@const ox = dx / len * 18}
		{@const oy = dy / len * 18}
		<line
			x1={n1.x + ox}
			y1={n1.y + oy}
			x2={n2.x - ox}
			y2={n2.y - oy}
			stroke="currentColor"
			stroke-width="1"
			marker-end="url(#cat-arrow)"
		/>
		<text
			x={mx + (dy > 0 ? -12 : dy < 0 ? 12 : 0)}
			y={my + (dx > 0 ? -6 : dx < 0 ? 6 : -8)}
			fill="currentColor"
			font-family="var(--font-mono)"
			font-size="10"
			font-style="italic"
			text-anchor="middle"
		>
			{label}
		</text>
	{/each}

	<!-- Nodes (objects) -->
	{#each nodes as node}
		<circle cx={node.x} cy={node.y} r="14" fill="var(--color-bg)" stroke="currentColor" stroke-width="1.5" />
		<text
			x={node.x}
			y={node.y + 4}
			fill="currentColor"
			font-family="var(--font-sans)"
			font-size="13"
			font-weight="600"
			text-anchor="middle"
		>
			{node.label}
		</text>
	{/each}
</svg>

<style>
	.category-diagram {
		position: absolute;
		right: 0;
		bottom: 0;
		width: clamp(200px, 30%, 300px);
		height: auto;
		pointer-events: none;
		z-index: -1;
		color: var(--color-text);
	}
</style>
