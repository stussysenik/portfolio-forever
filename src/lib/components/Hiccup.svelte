<script lang="ts">
  /**
   * Hiccup Renderer Component
   * 
   * Recursively renders Hiccup-like data structures (arrays) as Svelte/HTML.
   * [tag, props?, ...children]
   */

  export let data: any;

  function isProps(obj: any): boolean {
    return obj && typeof obj === 'object' && !Array.isArray(obj) && (typeof Element === 'undefined' || !(obj instanceof Element));
  }

  function getTag(h: any[]): string {
    return h[0];
  }

  function getProps(h: any[]): any {
    return isProps(h[1]) ? h[1] : {};
  }

  function getChildren(h: any[]): any[] {
    return isProps(h[1]) ? h.slice(2) : h.slice(1);
  }
</script>

{#if Array.isArray(data)}
  {@const tag = getTag(data)}
  {@const props = getProps(data)}
  {@const children = getChildren(data)}

  {#if tag === 'section'}
    <section {...props}>
      {#each children as child}
        <svelte:self data={child} />
      {/each}
    </section>
  {:else if tag === 'header'}
    <header {...props}>
      {#each children as child}
        <svelte:self data={child} />
      {/each}
    </header>
  {:else if tag === 'footer'}
    <footer {...props}>
      {#each children as child}
        <svelte:self data={child} />
      {/each}
    </footer>
  {:else if tag === 'div'}
    <div {...props}>
      {#each children as child}
        <svelte:self data={child} />
      {/each}
    </div>
  {:else if tag === 'span'}
    <span {...props}>
      {#each children as child}
        <svelte:self data={child} />
      {/each}
    </span>
  {:else if tag === 'h1'}
    <h1 {...props}>
      {#each children as child}
        <svelte:self data={child} />
      {/each}
    </h1>
  {:else if tag === 'h2'}
    <h2 {...props}>
      {#each children as child}
        <svelte:self data={child} />
      {/each}
    </h2>
  {:else if tag === 'h3'}
    <h3 {...props}>
      {#each children as child}
        <svelte:self data={child} />
      {/each}
    </h3>
  {:else if tag === 'p'}
    <p {...props}>
      {#each children as child}
        <svelte:self data={child} />
      {/each}
    </p>
  {:else if tag === 'ul'}
    <ul {...props}>
      {#each children as child}
        <svelte:self data={child} />
      {/each}
    </ul>
  {:else if tag === 'li'}
    <li {...props}>
      {#each children as child}
        <svelte:self data={child} />
      {/each}
    </li>
  {:else if tag === 'a'}
    <a {...props}>
      {#each children as child}
        <svelte:self data={child} />
      {/each}
    </a>
  {:else if tag === 'pre'}
    <pre {...props}>
      {#each children as child}
        <svelte:self data={child} />
      {/each}
    </pre>
  {:else}
    <svelte:element this={tag} {...props}>
      {#each children as child}
        <svelte:self data={child} />
      {/each}
    </svelte:element>
  {/if}
{:else if data !== null && data !== undefined}
  {data}
{/if}
