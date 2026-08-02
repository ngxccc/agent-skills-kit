# Tactile Studio Interaction Protocol

## 1. Micro-Interactions & Hover States

- **Crisp State Shifts:** Use fast, smooth color and border transitions (`transition-colors duration-150`, `hover:bg-muted`, `hover:border-foreground/30`).
- **Tactile Button Feedback:** Buttons respond with quiet background tint shifts (`active:bg-muted`), NEVER scaling or shrinking (`active:scale-95`).
- **Focus Ring Accessibility:** Clean, functional focus indicators (`focus-visible:ring-1 focus-visible:ring-foreground/40 focus-visible:outline-none`).

## 2. Surface & Typography Discipline

- **Hairline Neutral Borders:** Use clean 1px neutral borders (`border border-border/80` or `border-neutral-800`).
- **Typography-Led Hierarchy:** Make display headers bold with tight tracking (`tracking-tight`), pair with clean muted labels (`text-muted-foreground`, `uppercase tracking-wider text-[11px]`).
- **Restrained Color Palette:** 1 neutral surface background, high-contrast text, and a maximum of 1 quiet accent color for functional signals (e.g. emerald for active state, amber for warnings).
