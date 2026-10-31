# Verification — 2026-10-31

## Mobile icon update

UI direction, reset, play and pause symbols now use decorative inline SVG with a shared local symbol set. Unicode reaction notation in educational content remains text. Both initial HTML and JavaScript-generated UI avoid emoji-capable direction glyphs; SVG is hidden from assistive technology and control names remain textual.

`npm run check`: 11/11 passed after adding regression checks for glyph reintroduction, symbol resolution and decorative semantics. At 375px the hero arrows rendered as monochrome vectors without horizontal overflow. Browser checks also confirmed Lab run/pause/reset icon states, two concept-preview icons, and filtered search-result icons, with no console warnings/errors. These are browser viewport checks, not a claim of physical iPhone/Android testing.

The systematic product implementation plan is in `docs/IMPLEMENTATION-PLAN.md`; its future stages and proposed content counts are not completed implementation.

## Automated checks

`npm run check`: 9/9 passed. Covers declared rate calibration, mass conservation at all UI extremes, monotonic bounded progress, concentration independence of k, half-life, temperature/area/catalyst direction, zero-time behaviour, CSV consistency, invalid physical inputs, content destinations, local assets, IDs and small-text token contrast.

Local axe-core WCAG 2 A/AA, WCAG 2.1 AA and WCAG 2.2 AA audit: 0 violations, 26 passed rules. Remaining incomplete checks concern canvas/SVG backgrounds and decorative non-text symbols; the relevant foreground/background token pairs were separately checked at ≥4.5:1. The initially unlabelled generic learning-process container was given a group role. Continuous lab outputs disable live announcements; meaningful state changes use separate status messages.

## Browser verification

Tested in the available in-app browser. At 320, 375, 768, 1024 and 1440 CSS pixels, document horizontal overflow was false and the principal section/panel bounding boxes remained inside the viewport.

Confirmed: four subject dialogs render the intended content; Escape closes and restores focus; the 375px mathematics dialog has no internal horizontal overflow; mobile menu opens and closes after navigation; search filters the demo index and handles zero results; slider arrow keys update numerical values; catalyst updates the model; run/pause changes time and product values; reset restores 1.00× reference rate; CSV download yields 61 model rows and parameter metadata; connection themes and subject nodes update explanations; empty, incorrect and correct practice answers yield the appropriate feedback; hint toggles; ambient pause and frequency controls respond. No warnings or errors were recorded in the tested product tab.

Screenshots: `artifacts/desktop-1440.jpg`, `artifacts/mobile-375.jpg`. Additional Lab and Connect views were visually inspected in the browser.

## Performance and scope

Product has no runtime dependencies, external script requests or remote fonts. JS is native ES modules; Canvas density is capped at 2×, animation at 30 fps, offscreen rendering is suspended, and ambient motion obeys reduced-motion preference. At the time of verification the HTML/CSS/JS total was approximately 27 KB gzipped, plus 32 KB self-hosted WOFF2 fonts. This is an asset-size measurement, not a field performance score.

Limitations: one available browser engine; no physical-device or screen-reader certification; no production field LCP/INP/CLS data; OS-level reduced-motion preference was verified in code, while the manual pause path was exercised in the browser. Educational content remains an original draft, with no official syllabus alignment. Lab parameters are illustrative and not experimentally fitted.

## Sources

- IUPAC Gold Book, Arrhenius equation: https://goldbook.iupac.org/terms/view/A00446
- Royal Society of Chemistry, rates and catalysis: https://edu.rsc.org/cpd/teaching-rates-of-reaction-post-16-part-2/4014195.article
- OpenStax Biology 2e, Passive Transport: https://openstax.org/books/biology-2e/pages/5-2-passive-transport
- OpenStax University Physics, Instantaneous Velocity: https://openstax.org/books/university-physics-volume-1/pages/3-2-instantaneous-velocity-and-speed
- OpenStax Calculus, Defining the Derivative: https://openstax.org/books/calculus-volume-1/pages/3-1-defining-the-derivative

Explanations are original summaries; no source illustrations or textbook passages were copied.
