<script lang="ts">
	import { onMount } from "svelte";

	const frames = [
		String.raw`           #######           
       ###*******###       
     ##***       ***##     
    ##**   #####   **##    
   ##**  ###   ###  **##   
   #**  ##       ##  **#   
  ##**  #    @    #  **##  
  ##**  #         #  **##  
   #**  ##       ##  **#   
   ##**  ###   ###  **##   
    ##**   #####   **##    
     ##***       ***##     
       ###*******###       
           #######         `,
		String.raw`           #######           
       ###*******###       
     ##***       ***##     
    ##**   #####   **##    
   ##**  ###   ###  **##   
   #**  ##   @   ##  **#   
  ##**  #         #  **##  
  ##**  #         #  **##  
   #**  ##       ##  **#   
   ##**  ###   ###  **##   
    ##**   #####   **##    
     ##***       ***##     
       ###*******###       
           #######         `,
		String.raw`           #######           
       ###*******###       
     ##***       ***##     
    ##**   #####   **##    
   ##**  ###   ###  **##   
   #**  ##       ##  **#   
  ##**  #         #  **##  
  ##**  #    @    #  **##  
   #**  ##       ##  **#   
   ##**  ###   ###  **##   
    ##**   #####   **##    
     ##***       ***##     
       ###*******###       
           #######         `,
		String.raw`           #######           
       ###*******###       
     ##***       ***##     
    ##**   #####   **##    
   ##**  ###   ###  **##   
   #**  ##       ##  **#   
  ##**  #         #  **##  
  ##**  #         #  **##  
   #**  ##   @   ##  **#   
   ##**  ###   ###  **##   
    ##**   #####   **##    
     ##***       ***##     
       ###*******###       
           #######         `,
	];

	let frameIndex = 0;
	let output = frames[0];

	onMount(() => {
		const timer = window.setInterval(() => {
			frameIndex = (frameIndex + 1) % frames.length;
			output = frames[frameIndex];
		}, 320);

		return () => window.clearInterval(timer);
	});
</script>

<div class="signal-donut" aria-hidden="true">
	<pre>{output}</pre>
</div>

<style>
	.signal-donut {
		display: grid;
		place-items: center;
		padding: 1rem 0.5rem;
		min-height: 14rem;
		background:
			radial-gradient(circle at center, color-mix(in srgb, var(--color-accent) 10%, transparent), transparent 66%),
			linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 80%, transparent), transparent);
	}

	pre {
		margin: 0;
		font-family: var(--font-mono);
		font-size: clamp(0.32rem, 0.55vw, 0.46rem);
		line-height: 0.98;
		letter-spacing: 0.16em;
		color: color-mix(in srgb, var(--color-accent) 70%, var(--color-text) 30%);
		text-shadow: 0 0 18px color-mix(in srgb, var(--color-accent) 12%, transparent);
		user-select: none;
	}

	@media (max-width: 720px) {
		.signal-donut {
			min-height: 10rem;
		}

		pre {
			font-size: 0.24rem;
			letter-spacing: 0.12em;
		}
	}
</style>
