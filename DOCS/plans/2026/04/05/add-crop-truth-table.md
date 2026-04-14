---
created: 2026-04-11
category: plan
tags: [crop, image, focal-point, admin]
---

# Add Crop Truth Table Configurator

## Why
Current `PositionPicker` is a reactive blind guess — no way to see how crop renders across different aspect ratios, no focal point definition.

## Core Concept: Truth Table
| Focal Point | Aspect Ratio | Output |
|-------------|--------------|--------|
| (35%, 20%) | 16:10 | Face + shoulders |
| (35%, 20%) | 1:1 | Tight face crop |
| (35%, 20%) | 4:3 | Face + upper body |

## Solution
1. **Focal Point Model** — `focalX`, `focalY`, `zoom` instead of raw objectPosition
2. **Truth Table Preview** — Show image at 16:10, 1:1, 4:3, 21:9 simultaneously
3. **Interactive Editor** — Click on source image to set focal point, drag crosshair
4. **Render Integration** — Compute object-position at render time, backward compatible