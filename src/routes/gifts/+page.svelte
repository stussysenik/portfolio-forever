<script lang="ts">
        import { profile } from "$lib/data/content";
</script>

<svelte:head>
        <title>The Promise | {profile.name}</title>
        <meta name="description" content="A creative exchange — I build and design things for free with love. In return, you send me books, postcards, or art supplies." />
</svelte:head>

<div class="gifts-wrapper">
        <article class="letter">
                <header class="letter-header">
                        <div class="envelope-icon">
                                <span class="envelope">&#9993;</span>
                        </div>
                        <h1 class="letter-title">The Promise</h1>
                </header>

                <div class="letter-body">
                        <p class="manifesto">
                                I build and design things for free, with love.
                        </p>
                        <p class="manifesto manifesto-secondary">
                                In return, you send me books, postcards, or art supplies.
                                I will open-source all of my diamonds.
                        </p>

                        <div class="divider"></div>

                        <p class="body-text">
                                Every tool, every experiment, every piece of code on this site is built with blood,
                                sweat, and an unreasonable amount of time. It's all free. It's all open. The same
                                energy can flow back — not as payment, but as exchange. Creative energy moving
                                in both directions.
                        </p>

                        <p class="body-text body-note">Most works on this site are showcases. The Promise — full open-source — applies to the diamonds like Breakdex: the ones that truly ship.</p>

                        <section class="what-to-send">
                                <h2 class="sub-heading">What to send</h2>
                                <ul class="send-list">
                                        <li>Books & postcards</li>
                                        <li>Art supplies</li>
                                        <li>Handwritten letters</li>
                                </ul>
                        </section>

                        <section class="how-to-send">
                                <h2 class="sub-heading">How to send</h2>
                                <p class="body-text">
                                        Email <a href="mailto:itsmxzou@gmail.com">itsmxzou@gmail.com</a> to coordinate.
                                </p>
                        </section>

                        <section class="commitment">
                                <h2 class="sub-heading">The open-source commitment</h2>
                                <p class="body-text">
                                        Every diamond gets open-sourced.
                                        <a href="https://github.com/stussysenik" target="_blank" rel="noopener noreferrer">See the work on GitHub →</a>
                                </p>
                        </section>
                </div>

                <footer class="letter-footer">
                        <span class="signature">— {profile.name}</span>
                </footer>
        </article>
</div>

<style>
        .gifts-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 60vh;
        }

        .letter {
                max-width: 560px;
                margin: 0 auto;
                padding: var(--space-2xl) var(--space-md);
        }

        @media (min-width: 480px) {
                .letter {
                        padding: var(--space-2xl) var(--space-lg);
                }
        }

        @media (min-width: 768px) {
                .letter {
                        padding: var(--space-2xl) 0;
                }
        }

        .letter-header {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: var(--space-lg);
                margin-bottom: var(--space-2xl);
                text-align: center;
        }

        .envelope-icon {
                display: flex;
                align-items: center;
                justify-content: center;
        }

        .envelope {
                font-size: var(--font-size-3xl);
                animation: gentle-float 4s ease-in-out infinite;
                display: inline-block;
        }

        @keyframes gentle-float {
                0%, 100% {
                        transform: translateY(0) rotate(0deg);
                }
                25% {
                        transform: translateY(-4px) rotate(1deg);
                }
                75% {
                        transform: translateY(2px) rotate(-1deg);
                }
        }

        .letter-title {
                font-family: var(--font-sans);
                font-size: var(--font-size-2xl);
                font-weight: 500;
                letter-spacing: var(--letter-spacing-tight);
                color: var(--color-text);
                margin: 0;
        }

        .letter-body {
                display: flex;
                flex-direction: column;
                gap: var(--space-xl);
        }

        .manifesto {
                font-family: var(--font-mono);
                font-size: var(--font-size-lg);
                font-weight: 400;
                line-height: var(--line-height-relaxed);
                color: var(--color-text);
                margin: 0;
                text-align: center;
        }

        .manifesto-secondary {
                font-size: var(--font-size-base);
                color: var(--color-text-secondary);
        }

        .divider {
                width: 3ch;
                height: 1px;
                background: var(--border-color);
                margin: var(--space-md) auto;
        }

        .body-text {
                font-size: var(--font-size-sm);
                color: var(--color-text-muted);
                line-height: var(--line-height-relaxed);
                margin: 0;
        }

        .body-text a {
                color: var(--color-accent);
        }

        .body-note {
                font-style: italic;
                color: var(--color-text-subtle);
                font-size: var(--font-size-xs);
        }

        .sub-heading {
                font-family: var(--font-mono);
                font-size: var(--font-size-xs);
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: var(--letter-spacing-wider);
                color: var(--color-text-subtle);
                margin: 0 0 var(--space-sm) 0;
        }

        .what-to-send {
                display: flex;
                flex-direction: column;
        }

        .send-list {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-direction: column;
                gap: var(--space-xs);
        }

        .send-list li {
                font-size: var(--font-size-sm);
                color: var(--color-text);
                padding-left: var(--space-md);
                position: relative;
        }

        .send-list li::before {
                content: "→";
                position: absolute;
                left: 0;
                color: var(--color-text-subtle);
        }

        .how-to-send,
        .commitment {
                display: flex;
                flex-direction: column;
        }

        .letter-footer {
                margin-top: var(--space-2xl);
                padding-top: var(--space-lg);
                border-top: 1px solid var(--border-color-subtle);
                text-align: right;
        }

        .signature {
                font-family: var(--font-mono);
                font-size: var(--font-size-sm);
                color: var(--color-text-muted);
                font-style: italic;
        }
</style>
