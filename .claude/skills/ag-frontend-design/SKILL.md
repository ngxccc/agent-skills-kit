---
name: ag-frontend-design
description: "Trigger keywords: frontend design, UI design, redesign, anti-AI-slop, 60-30-10 rule, studio UI, bento layout, responsive UI. Guidance for creating distinctive, studio-grade, human-crafted web interfaces with opinionated 60-30-10 color proportions, tactile micro-interactions, LEGO reference assembly, Figma diff loops, and zero generic boilerplate."
license: MIT
metadata:
  author: Team
  version: "1.0.0"
---

# Master Frontend Design Skill (`ag-frontend-design`)

## When to Apply

This skill is designed for the agent to reference when:
- The user is building, updating, or redesigning web interfaces, components, landing pages, or web applications.
- The agent needs to eliminate generic "AI boilerplate" aesthetics (bouncy animations, gradient blur spheres, overused 3-card grid defaults, raw emoji icons, decorative dot bullets).
- The user requests studio-grade visual polish, opinionated typography, tactile micro-interactions, 60-30-10 color proportion enforcement, or evidence-driven UI refinement.
- Trigger keywords: `frontend design`, `UI design`, `redesign`, `anti-AI-slop`, `tactile UI`, `60-30-10 rule`, `color budget`.

---

## How to Use

### 1. Step-by-Step Instructions

1. **Step 1: Subject Grounding & Restraint** — Identify the exact subject, target audience, and single job. Apply the Chanel rule of restraint (spend boldness in ONE signature place, remove one unnecessary decorative accessory).
2. **Step 2: Enforce 60-30-10 Color Budget & Distribution** — Strictly partition viewport color proportions:
   - **60% Dominant Neutral Canvas (`--background`):** 60%+ of total surface area MUST be neutral canvas (Cool Slate / Off-white) for negative space to prevent visual fatigue.
   - **30% Structural Elements & Typography (`--card`, `--foreground`, `--border`):** ~30% for cards, typography, muted surfaces, and hairline 1px borders.
   - **10% Signature Accent (`--primary`):** Maximum 10% area for the single primary accent color (`Electric Cobalt`), reserved strictly for primary CTAs, active states, and focused controls.
3. **Step 3: Enforce Color Budget & Chromatic Hierarchy** — Maintain a strict Color Budget (max 1 bimodal saturated accent color per viewport) to eliminate Chromatic Noise.
4. **Step 4: Enforce Anti-AI-Slop Rules** — Strip all bouncy scale transforms (`active:scale-95`), pulsing animations (`animate-pulse`), and gradient blur spheres (`blur-3xl`). **STRICT BAN ON RAW EMOJI ICONS & DECORATIVE DOT BULLETS:** NEVER use raw emojis (🔍, 🔥, ✨, 👤) or arbitrary decorative dot bullets (e.g. `h-1.5 w-1.5 rounded-full bg-primary` or `●`) in UI badges/pills. ALWAYS use an icon library (`lucide-react`, e.g. `<Sparkles>`, `<Layers>`) or omit decorative icons completely.
5. **Step 5: Apply Tactile Micro-Interactions** — Use hairline 1px neutral borders (`border-border`), short color transitions (`transition-colors duration-150`), and clean focus indicators (`ring-ring`).
6. **Step 6: Perform Squint Audit & RED/GREEN Refinement** — Audit visual mass in grayscale/squint mode to ensure one dominant visual anchor per viewport.

---

## Quick Reference

- `60-30-10-color-rule` - 60% Neutral Canvas, 30% Structure/Typography, 10% Single Accent CTA.
- `color-budget` - Max 1 bimodal saturated accent per viewport to prevent chromatic noise.
- `anti-slop-rules` - Zero bouncy transforms (`active:scale-95`), zero gradient blur spheres (`blur-3xl`), zero raw emoji icons (`🔍`, `🔥`), zero decorative dot bullets (`●`).
- `tactile-interaction-protocol` - Short color transitions (`transition-colors duration-150`), 1px hairline borders (`border-border`), clean focus rings.

---

## References

- [color-palette-guide](references/color-palette-guide.md) - Material-grounded OKLCH palette, 60-30-10 rule & color budget guidelines.
- [anti-slop-rules](references/anti-slop-rules.md) - Strict anti-AI-slop rules and ban list.
- [tactile-interaction-protocol](references/tactile-interaction-protocol.md) - Tactile studio interaction protocol and surface discipline.
- [premium-design-patterns](references/premium-design-patterns.md) - Studio-grade layout patterns and bento grid architectures.
