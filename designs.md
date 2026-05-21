---
name: Cyber-Grunge Academia
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#849495'
  outline-variant: '#3a494b'
  surface-tint: '#00dbe7'
  primary: '#e1fdff'
  on-primary: '#00363a'
  primary-container: '#00f2ff'
  on-primary-container: '#006a71'
  inverse-primary: '#00696f'
  secondary: '#ffffff'
  on-secondary: '#253600'
  secondary-container: '#b6f700'
  on-secondary-container: '#4f6e00'
  tertiary: '#faf6f6'
  on-tertiary: '#313030'
  tertiary-container: '#dddada'
  on-tertiary-container: '#605f5f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#74f5ff'
  primary-fixed-dim: '#00dbe7'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#b6f700'
  secondary-fixed-dim: '#9fd800'
  on-secondary-fixed: '#141f00'
  on-secondary-fixed-variant: '#374e00'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-lg:
    fontFamily: Space Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1.4'
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style

This design system blends the utilitarian precision of a terminal interface with the raw, intellectual aesthetic of "Hacker Academia." It targets a sophisticated, tech-literate audience that appreciates technical high-fidelity and cultural depth. The emotional response is one of focused intensity, digital craftsmanship, and underground prestige.

The style is a hybrid of **Cyber-Grunge Minimalism** and **Technical Brutalism**. It rejects soft shadows and organic shapes in favor of sharp edges, high-contrast structural lines, and intentional textures. The inclusion of Japanese folkloric elements (Yokai line art) and mathematical patterns (Asanoha) creates a bridge between ancient geometry and future tech, resulting in a UI that feels like an encrypted artifact.

## Colors

The palette is rooted in absolute darkness, utilizing a tiered black-to-charcoal foundation to create depth without relying on traditional lighting.

- **Primary (Cyan #00f2ff):** Used for active data streams, focus states, and primary tactical actions. It should feel electric but sterile.
- **Secondary (Lime #bcff00):** Reserved for success states, secondary timers, and "ready" indicators.
- **Backgrounds:** The base layer is `#0a0a0a`. Elevated panels or containers use `#1a1a1a`.
- **Accents:** Use desaturated versions of the accents for "dimmed" or background data to maintain a monochrome feel until interaction occurs.

## Typography

The typography system is strictly monospaced to reinforce the hacker-terminal aesthetic. **Space Mono** provides a geometric, slightly retro-futuristic flair for headings and titles, while **JetBrains Mono** is used for all functional data, descriptions, and UI labels due to its superior legibility in dense technical layouts.

All numerical data (timers, stats, coordinates) must use `JetBrains Mono` to ensure character alignment in vertical columns. Use `label-caps` for metadata headers to create a distinct hierarchy against body text.

## Layout & Spacing

The design system utilizes a **Fixed Grid** philosophy based on a 4px baseline. Layouts should feel rigid and architectural.

- **Desktop:** 12-column grid with 16px gutters. Panels are often nested within high-contrast borders.
- **Mobile:** 4-column grid. Margins are tight (16px) to maximize data density.
- **Rhythm:** Use increments of 4px for all padding and margins. Vertical rhythm is critical; elements should align to a simulated "line" of code.
- **Scanlines:** A global overlay of 1px horizontal lines at 4px intervals with 3% opacity should be applied to the entire viewport to simulate a CRT terminal.

## Elevation & Depth

Depth is conveyed through **Bold Borders** and **Tonal Layering** rather than shadows. 

- **Level 0 (Base):** `#0a0a0a` background.
- **Level 1 (Panels):** `#1a1a1a` surface with a 1px solid border of `#2a2a2a`.
- **Level 2 (Interaction):** When an element is active or hovered, the border color shifts to the Primary Cyan (#00f2ff).
- **Textures:** Card backs and large empty states should feature a faint, repeating Asanoha (hemp leaf) pattern in a dark grey (`#141414`) to provide subtle tactile complexity.

## Shapes

The shape language is strictly **Sharp (0px)**. Every button, input, card, and modal must have right-angled corners. This reinforces the "Cyber-Grunge" feel and ensures that high-contrast borders remain crisp and technical. Interior elements, like progress bars or status pips, also follow this square-only rule.

## Components

- **Buttons:** Rectangular with a 1px border. Default state: Charcoal border. Hover state: Cyan border and Cyan text. Active state: Cyan background with Black text.
- **Cards:** Use `#1a1a1a` backgrounds. Card backs must feature the Asanoha geometric pattern. Card faces should utilize monochrome Yokai-style line art (thin, high-contrast white or cyan lines) for illustrations.
- **Inputs:** Terminal-style prompts. Use a "blinking" underscore cursor `_` at the end of active text fields.
- **Data Tables:** No vertical lines. Use horizontal rules in `#2a2a2a` and ensure all monospace characters align across rows.
- **State Indicators:** Use Lime (#bcff00) for "System Online" or "Success" and Cyan (#00f2ff) for "Processing" or "Neutral."
- **Terminal Header:** Every major view should have a breadcrumb or header line that looks like a file path (e.g., `ROOT/SYSTEM/DATA_CORE >`).