# Material-Grounded Color Palette: Minimalist Slate & Electric Cobalt

> "Precision tech aesthetics pair cool metallic slate surfaces with a single high-definition electric cobalt accent." — Inspired by Apple Studio, Humane AI Pin & Teenage Engineering OP-1 Field modern hardware UI systems.

---

## 1. Domain Research & Material Rationale

Option A (Minimalist Slate & Electric Cobalt) combines cool anodized aluminum slate neutrals with a precise 255° Electric Cobalt signal accent:

| Material / Finish          | Hex Code  | Validated OKLCH            | UI Application                                |
| :------------------------- | :-------- | :------------------------- | :-------------------------------------------- |
| **Cool Slate Canvas**      | `#F8FAFC` | `oklch(0.982 0.005 240.0)` | Light Mode Canvas Background                  |
| **Machined Slate Surface** | `#F1F5F9` | `oklch(0.950 0.008 240.0)` | Card & Secondary Control Surface              |
| **Deep Graphite Text**     | `#0F172A` | `oklch(0.180 0.010 240.0)` | Primary High-Contrast Typography              |
| **Slate Hairline Border**  | `#E2E8F0` | `oklch(0.900 0.008 240.0)` | 1px Neutral Surface Borders                   |
| **Electric Cobalt Accent** | `#0284C7` | `oklch(0.520 0.210 255.0)` | Signature Action Accent & CTAs                |
| **Status LED Emerald**     | `#10B981` | `oklch(0.620 0.150 155.0)` | In-Stock Active Signal                        |
| **Signal Crimson**         | `#EF4444` | `oklch(0.580 0.200 25.0)`  | Out-of-Stock Warning Signal & Discount Badges |

---

## 2. Official Slate & Electric Cobalt OKLCH Tokens (`index.css`)

```css
:root {
  /* Light Mode - Minimalist Slate & Electric Cobalt */
  --background: oklch(0.982 0.005 240); /* Cool Slate Canvas #F8FAFC */
  --foreground: oklch(0.18 0.01 240); /* Deep Graphite Text #0F172A */
  --card: oklch(0.995 0 0); /* Pure White Surface */
  --card-foreground: oklch(0.18 0.01 240);
  --popover: oklch(0.995 0 0);
  --popover-foreground: oklch(0.18 0.01 240);
  --primary: oklch(0.52 0.21 255); /* Electric Cobalt Accent #0284C7 */
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.95 0.008 240); /* Machined Slate Tint #F1F5F9 */
  --secondary-foreground: oklch(0.22 0.01 240);
  --muted: oklch(0.95 0.008 240);
  --muted-foreground: oklch(0.52 0.01 240); /* Slate Label */
  --accent: oklch(0.95 0.008 240);
  --accent-foreground: oklch(0.18 0.01 240);
  --destructive: oklch(0.58 0.2 25); /* Signal Crimson */
  --border: oklch(0.9 0.008 240); /* 1px Cool Slate Border */
  --input: oklch(0.9 0.008 240);
  --ring: oklch(0.52 0.21 255); /* Cobalt Focus Ring */
  --radius: 0.625rem;
}

.dark {
  /* Dark Mode - Deep Graphite & Electric Cobalt */
  --background: oklch(0.145 0.01 240); /* Deep Slate Canvas */
  --foreground: oklch(0.982 0.005 240); /* Cool Slate Text */
  --card: oklch(0.18 0.01 240); /* Graphite Surface Card */
  --card-foreground: oklch(0.982 0.005 240);
  --popover: oklch(0.18 0.01 240);
  --popover-foreground: oklch(0.982 0.005 240);
  --primary: oklch(0.58 0.21 255); /* Vibrant Electric Cobalt */
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.24 0.01 240);
  --secondary-foreground: oklch(0.982 0.005 240);
  --muted: oklch(0.24 0.01 240);
  --muted-foreground: oklch(0.68 0.01 240);
  --accent: oklch(0.24 0.01 240);
  --accent-foreground: oklch(0.982 0.005 240);
  --destructive: oklch(0.6 0.185 25);
  --border: oklch(1 0 0 / 12%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.58 0.21 255);
}
```

---

## 3. The 60-30-10 Color Rule & Chromatic Budget

### Rule Definition & Rationale

1. **60% Dominant Neutral Canvas (`--background`):** 60% of the viewport area MUST consist of neutral canvas (Cool Slate `#F8FAFC`). This creates **Negative Space (White Space)**, allowing user eyes to rest and preventing visual fatigue.
2. **30% Structural Elements & Typography (`--card`, `--foreground`, `--border`):** 30% of the surface area is dedicated to cards, text, navigation containers, and 1px hairline borders for structural hierarchy.
3. **10% Signature Accent (`--primary`):** Maximum 10% of total surface area is allocated to the Electric Cobalt signal color (`#0284C7`), reserved strictly for primary CTAs, active tab indicators, and search focus states.

### Core Principles

- **Color Budget (Ngân sách màu sắc):** Never exceed 1 saturated accent color per viewport. Extra saturated colors create **Chromatic Noise** and erode CTA conversion.
- **Chromatic Hierarchy:** High-saturation elements draw immediate focal attention (<0.1s). Restraining saturation to 10% guarantees instant visual navigation.
- **Chanel Rule of Restraint (Nguyên lý Tiết chế):** Purge all ornamental, non-functional colors. Every color choice must serve a distinct interaction purpose.

---

## 4. Functional Signal Colors vs Brand Primary Accents in E-Commerce

### The Discount Badge Paradox

In high-end retail UI design (Apple, Leica, Teenage Engineering, Braun), placing a pure black badge (`bg-foreground`) over product images results in poor visual contrast and zero promotional urgency. However, generic bright orange/pink badges introduce "AI-slop" clutter.

### The Braun/Leica Signal Crimson Rule

Premium hardware design solves this by separating **Brand Primary Accent** from **Functional Signal Accent**:

- **Brand Primary Accent (`Electric Cobalt #0284C7`):** Reserved for user navigation, active filter states, and primary conversion buttons.
- **Functional Signal Accent (`Signal Crimson #EF4444` / `oklch(0.580 0.200 25.0)`):** A matte, high-definition industrial crimson used strictly for discount tags (`-10%`, `-20%`) and critical system notifications. This provides instant visual callout (<0.05s recognition) while retaining a tactile, studio-grade aesthetic.
