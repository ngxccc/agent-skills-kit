# OMD Reference Assembly & Evidence Protocol

## 1. LEGO Reference Assembly (From OMD-Scout)

- **Decision Coverage Over Capture Quotas:** Gather references strictly per decision gap. Capture until you have enough independent evidence to settle a specific component/typography/layout decision, then stop.
- **Granular Component Scouting:** Use tight selectors (`--selector ".component"`) for component anatomy, whole-page for layout rhythm, and type/motion studies for behavior.
- **Structure & Principles Transfer:** Transfer structural mechanics, component alignment, and design principles. NEVER copy raw source pixels, hotlink image URLs, or lift brand copy.
- **Avoid Famous Benchmark Reflex:** Search the brief's real domain and direct competitors rather than reflexively defaulting to famous tech benchmarks (Linear, Stripe, Vercel) on every brief.

## 2. Squint & Visual Hierarchy Audit (From OMD-Critique & OMD-Glance)

- **Squint Test:** View the interface in grayscale blur mode (or squint) to audit visual mass.
- **Single Dominant Anchor:** Verify that each viewport has exactly ONE dominant visual anchor, and that secondary elements support it without competing for focus.
- **Root-Cause Defect Grouping:** When auditing UI defects, group symptom findings by their underlying single root cause rather than listing superficial individual issues.

## 3. Figma Systematization & Diff Loop (From OMD-Figma)

- **Tokens First:** Build CSS custom properties (`:root`) for colors, typography scale, radii, and spacing tokens before building any individual frame.
- **Iterative Diff Loop:** Implement each frame pixel-faithfully against the snapshot; iterate up to 4 passes until divergence score passes.
- **Honest Fallback Reporting:** Report exact fidelity metrics per frame and explicit fallback reasons when responsive pairs are unmatched.

## 4. Evidence-Driven RED/GREEN Refinement Loop (From OMD-Ultraship)

- **Round 0 is Not the Ship:** The first shippable build is round 0, never the final release.
- **Measured Iterations:** For each refinement, record a concrete observation (`before`, `metric`, `modification`, `after`, `result`). Advance only on measured visual improvement.
