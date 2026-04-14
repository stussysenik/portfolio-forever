# Interactive Portfolio Legends — Applied Research

**Date:** 2026-04-14
**Status:** Reference document for stussysenik live portfolio spec
**Purpose:** Preserve the synthesis of "how would the legends build this" so we never re-research the same ground.

This document distills two parallel research passes into actionable principles. The raw agent reports live in the conversation log; this file is the durable version.

---

## 1. Creators Studied (21 total)

### Portfolio lineage (developer/designer personal sites)
- **Bruno Simon** — [bruno-simon.com](https://bruno-simon.com) · driveable car portfolio
- **Josh Comeau** — [joshwcomeau.com](https://www.joshwcomeau.com/) · CSS pedagogy, delight
- **Cassie Evans** — [cassie.codes](https://www.cassie.codes/) · SVG/GSAP virtuoso
- **Brittany Chiang** — [brittanychiang.com](https://brittanychiang.com/) · minimal dev portfolio, heavily imitated
- **Steven Wittens** — [acko.net](https://acko.net/) · mathematical interactive essays, shader-heavy
- **Lynn Fisher** — [lynnandtonic.com](https://lynnandtonic.com/) · annual reinvention, CSS mastery
- **Tim Holman** — [tholman.com](https://tholman.com/) · playful minimal, author of AsciiMorph
- **Robby Leonardi** — [rleonardi.com](http://www.rleonardi.com/) · interactive resume as game
- **Sarah Drasner** — [sarah.dev](https://sarah.dev/) · SVG animation principles
- **Rauno Freiberg** — [rauno.me](https://rauno.me/) · interaction design at Vercel, robustness discipline
- **Ahmad Shadeed** — [ishadeed.com](https://ishadeed.com/) · CSS interactive explainers, responsive craft

### Interactive explanation & generative-art lineage
- **Bartosz Ciechanowski** — [ciechanow.ski](https://ciechanow.ski/) · long-form interactive essays
- **Nicky Case** — [ncase.me](https://ncase.me/) · Explorable Explanations pioneer
- **Amit Patel** — [redblobgames.com](https://www.redblobgames.com/) · parameter-first interactive tutorials
- **Fabrice Bellard** — [bellard.org](https://bellard.org/) · austere deep-technical
- **Casey Muratori** — [caseymuratori.com](https://caseymuratori.com/) · austere high-cred
- **Anders Hoff / Inconvergent** — [inconvergent.net](https://inconvergent.net/) · generative art, motif loyalty
- **Tyler Hobbs** — [tylerxhobbs.com](https://www.tylerxhobbs.com/) · watercolor cellular noise
- **Dave Whyte / Beesandbombs** — grid-offset timing
- **Andy Sloane** — [a1k0n.net](https://www.a1k0n.net/) · [donut.c original author](https://www.a1k0n.net/2011/07/20/donut-math.html)
- **The Pudding / Distill.pub** — [distill.pub/2020/communicating-with-interactive-articles](https://distill.pub/2020/communicating-with-interactive-articles/)
- **Tim Rogers / Jason Scott** — voice-first minimal tooling
- **Vincent Tantardini** — [vnn.io](https://vnn.io/) · intent over automation

---

## 2. The 10 Unifying Principles

1. **Inevitability over ornament.** Every interaction must pass a "remove test" — delete it, does the meaning still stand? If yes, delete it. Distill.pub is explicit: *"not everything needs to be interactive… in the worst case, interactivity may be distracting or go unused."*
2. **One hero move, everything else quiet.** 80% of design budget on 20% of the surface. Bruno has one car. Lynn has one seasonal conceit. Sloane has one donut. Never two competing centerpieces.
3. **Interaction is a sentence, not decoration.** Prose poses a claim, interaction lets the visitor verify. (Ciechanowski.)
4. **Motion signals state change — never ambient wallpaper.** Animate transitions, not resting states. (Drasner, Evans.) Still photos hang still; only the donut moves at rest.
5. **Input-driven, not timeline-driven.** Procedural response to the user, never autoplay. Novelty decays fast when everyone's seen the canned animation. (Comeau.)
6. **Austere chrome, rich centerpiece.** Cheap frame, expensive hero. Bellard/Muratori: austerity signals confidence.
7. **Voice-first copy.** The site *is* the voice. No "Welcome to my portfolio." (Rogers, Scott.)
8. **Robustness is the invisible flex.** Survive spam-click, paste, autofill, tab-switch, slow networks, screen-reader, keyboard-only. (Rauno Freiberg — demo-grade ≠ ship-grade.)
9. **First-touch under 400ms.** Pointer responds on the first frame after paint. First contentful paint is a real image or a real glyph, never a skeleton.
10. **One motif, many variations.** A single visual idea repeats across pages so the site reads as a signature. (Inconvergent, Hobbs, Beesandbombs — identity = a rule you return to.)

## 3. Delight vs Gimmick — the test

**Delight:**
- You can state its reason in one sentence
- Responds to intent (your input drives it)
- Rewards repeated visits with variation
- Cheap to remove but expensive to imagine

**Gimmick:**
- Runs on autopilot regardless of the visitor
- Looks identical every visit
- Requires a tutorial to understand
- You can't explain why it's there without saying "it's cool"

**The donut passes this test iff dragging changes something meaningful.** It fails if it spins regardless.

## 4. Photographer-Specific Failure Modes

1. **Autoplay hero reel with music** — kills trust in 2 seconds, especially on mobile
2. **Scroll-jack + horizontal galleries** — breaks browser primitives, users bounce
3. **Fluid-cursor / WebGL-blob chrome** — decorative without content, instantly dated
4. **Captions that explain the photo** — if the image needs a caption to work, it shouldn't be in the hero
5. **"Enter site" splash** — one extra click is one too many
6. **Cloning dev-portfolio layouts** — sidebar-nav screams "software engineer"; invert information architecture: images first, words second

## 5. Honoring the Donut Lineage (Sloane)

- **Signature, not feature.** On Sloane's site the donut is the header glyph, not the product. Watermark the site with it; don't stage-show it.
- **Drag = perspective / framing.** Dragging rotates the *viewpoint*, not the torus. That maps directly to what a photographer does with body + camera. One verb across donut and gallery.
- **Text-render authenticity.** Keep it `<pre>`. A WebGL donut with shader glow is a copy; a `<pre>` donut that types itself into the DOM is the lineage.
- **Works before JS.** Static `<pre>` frame rendered at build time, hydrated in layers: idle animation, then pointer drag. Progressive enhancement is Sloane's ethos.
- **Cite yourself.** Footer `view-source · donut.ts →` link. Public repo. The site cites its own source, as Sloane's 2011 "Donut math" post does.

## 6. Concrete Directives for Architecture

1. **Donut is a Svelte island, not a route.** Server-render a static frame; hydrate one `donut.client.ts` with rAF + pointer events. One component, one file, one signature.
2. **Gallery = flat CSS grid, monospace captions, zero hover animation.** The *absence* of motion in the gallery is what makes the donut's motion land.
3. **Sanity owns content, Convex owns live state.** Never mix — content and presentation are different lifecycles.
4. **Remove-test every interactive before ship.** Only the donut is guaranteed to stay.
5. **One voice-first copy block** in the owner's actual words. 2–3 sentences. If you can't write it in your own voice, ship without it rather than template-fill.
6. **AsciiMorph (Holman) between gallery filter states** — one transition technique, used once, echoes the donut's character vocabulary into the gallery.
7. **Quiet scroll-progress indicator** — Leonardi's completion loop, whispered.
8. **Boring admin.** The tool doesn't cosplay as the showcase. Black text on white. System fonts.

---

## 6a. Content Sovereignty — the owner's rule

This principle was not surfaced by the legends research. It came from the owner's lived experience of LLMs silently rewriting their content during what should have been layout/styling work. It's more important than any principle the research surfaced, and it governs every future decision in this project.

> **Content is sacred. Configuration is malleable.**
>
> The owner authors every word, image, caption, bio, CV entry, and blog post in their own voice. Automation may freely edit *configuration* (variants, layouts, modes, presentation knobs) but must never silently write to *content* fields. When content must change, automation proposes — the owner disposes.

**Architectural enforcement (not honor-system):**

- Every schema field is classified `owner-only` | `llm-assisted` | `system`
- LLMs and scripts write to Sanity drafts only, never to published documents
- A `/admin` **Review Mode** kill switch freezes all content writes globally when the owner shares a review link
- A Convex `auditLog` table records every mutation with source, diff, and one-click rollback
- `.content` = sacred, `.config` = malleable — the type-level naming convention means every write path respects the split automatically
- [`CONTENT_RULES.md`](../../../CONTENT_RULES.md) at the repo root is the canonical LLM boundary contract, referenced from `CLAUDE.md`, `AGENTS.md`, and `README.md`

**Why this sits in the research doc:** the legends research is the *design* foundation, but content sovereignty is the *safety* foundation. Every future contributor (human or LLM) must understand both. The research tells you what to build; the content rules tell you what not to touch.

**The failure mode we're preventing:** owner is sharing a `/cv` link with someone reviewing their work. Mid-review, the owner asks an LLM for help with a CSS tweak in another file. The LLM, being "helpful," also rewrites the CV headline in passing. The reviewer sees the change mid-read. This scenario is now architecturally impossible: Review Mode blocks content writes, draft-only writes mean even without Review Mode nothing hits published without explicit owner approval, the audit log makes any breach recoverable, and `CONTENT_RULES.md` tells every LLM session the rules before it acts.

---

## 7. What the Research Rules Out

- **Building our own WebSocket backend in Elixir** — Convex IS a managed reactive WebSocket backend. Reinvention costs weeks, buys nothing visitors can feel.
- **Custom CMS from scratch** — Sanity Studio is free, mobile-friendly, and generates editors from schemas. Rebuild only the live-ops surface.
- **Generic dev-portfolio layouts** — fighting the user's identity as a photographer, not an engineer.
- **NPM-installed "delight" libraries** — procedural interaction only; no canned animations.
- **Fluid-cursor WebGL ornaments** — trend-dated the day after they ship.

## 8. Source Citations

All URLs listed in §1. Specific claims trace to:
- Distill's interactivity-when-earned rule: [distill.pub/2020/communicating-with-interactive-articles](https://distill.pub/2020/communicating-with-interactive-articles/)
- Andy Sloane donut.c math post: [a1k0n.net/2011/07/20/donut-math.html](https://www.a1k0n.net/2011/07/20/donut-math.html)
- Comeau novelty-decay rule: [joshwcomeau.com/blog/whimsical-animations](https://www.joshwcomeau.com/blog/whimsical-animations/)
- Holman AsciiMorph: [tholman.com/post/ascii-morph](https://tholman.com/post/ascii-morph/)
- Rauno robustness: [every.to/p/invisible-details-of-interaction-design](https://every.to/p/invisible-details-of-interaction-design)
- Lynn Fisher 2025 refresh: [lynnandtonic.com/thoughts/entries/case-study-2025-refresh](https://lynnandtonic.com/thoughts/entries/case-study-2025-refresh/)
- Bruno Simon Mux interview: [mux.com/blog/3d-web-development-and-beyond-a-chat-with-bruno-simon](https://www.mux.com/blog/3d-web-development-and-beyond-a-chat-with-bruno-simon)
