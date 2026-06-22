# Cinematic Portfolio Hero

A fullscreen, sticky video hero built for Next.js App Router — blurred
ambient video background, sharp foreground talking-head video, a Three.js
warm-bokeh particle layer, glassmorphism controls, and GSAP entrance
animations.

## Structure

```
app/
  layout.jsx          → loads Bebas Neue + Inter, sets up <html>/<body>
  page.jsx             → example page wiring <VideoIntro /> + a next section
  globals.css          → CSS variables, reset, focus styles
components/
  VideoIntro.jsx        → the hero: video layers, overlays, controls, GSAP
  VideoIntro.module.css → all hero styling (CSS Modules, fully responsive)
  CinematicLayer.jsx    → Three.js bokeh/particle canvas (transparent overlay)
public/
  videos/portfolio_video.mp4 → your uploaded talking-head video
```

## Install

```bash
npm install
npm run dev
```

This installs `three` and `gsap` alongside Next/React (see `package.json`).

## How it's built

**Video layers** — `VideoIntro.jsx` renders two copies of the same
`<video>`: a `transform: scale + blur(38px)` ambient duplicate behind
everything (`.bgVideo`), and a sharp foreground copy (`.fgVideo`). Both
autoplay, loop, and are `playsInline`. The foreground video starts muted
(autoplay policies require it) and a tap on the speaker icon unmutes it.

**Overlays** — three stacked layers (`overlayGradientSide`,
`overlayGradientBottom`, `overlayVignette`) plus two `mix-blend-mode: screen`
radial glows (`glowOrange`, `glowBlue`) sit above the video to keep text
readable and add the warm-orange / cool-blue cinematic lighting feel.

**Three.js bokeh layer** — `CinematicLayer.jsx` mounts its own
`WebGLRenderer` with `alpha: true` into a transparent absolutely-positioned
div. ~130 `THREE.Points` use a soft radial-gradient sprite texture, warm
orange/white vertex colors, and `THREE.AdditiveBlending` for a dreamy glow.
Each particle's position is offset by independent sine/cosine waves for
slow floating motion; the camera lerps toward the pointer position for a
subtle parallax. All geometry/material/texture/renderer resources are
disposed on unmount, and `prefers-reduced-motion` renders a single static
frame instead of animating.

**GSAP entrance** — a single timeline staggers: video fade-in → tagline →
two stacked name lines (with a soft blur-to-sharp settle) → subtitle →
controls → scroll indicator → sound-hint badge. The sound-hint badge fades
out automatically after ~4.5s, or immediately if the person taps mute/unmute.

**Controls** — play/pause and mute/unmute are real glassmorphism buttons
(`backdrop-filter: blur`, translucent border, soft shadow) that drive the
two `<video>` elements directly via refs; no extra state libraries.

**Scroll indicator** — a thin vertical track with an animated gradient
"pulse" sweeping down it (`@keyframes scrollPulseMove`), labeled "Scroll".
Clicking it calls `scrollIntoView` on the section whose `id` you pass as
`nextSectionId` (defaults to `"next-section"`, see `app/page.jsx`).

## Customizing

- **Copy**: pass `tagline`, `firstName`, `lastName`, `subtitle` props to
  `<VideoIntro />`.
- **Video**: drop a new file into `public/videos/` and point `videoSrc` at
  it.
- **Particle density / mood**: tweak `particleCount` prop on
  `<VideoIntro />` (forwarded to `CinematicLayer`), or the `palette` array
  inside `CinematicLayer.jsx` for different color moods.
- **Fonts**: `layout.jsx` currently pulls Bebas Neue + Inter from Google
  Fonts for simplicity. For production you'll likely want `next/font/local`
  with self-hosted files — the CSS already reads from
  `--font-display` / `--font-body` / `--font-utility` custom properties, so
  swapping the font loader doesn't require touching the component styles.

## Performance notes

- The Three.js layer uses `powerPreference: "low-power"`, caps pixel ratio
  at 2, and reuses a single canvas texture for all particles.
- All Three.js resources (geometry, material, texture, renderer) are
  disposed in the `useEffect` cleanup — safe for route changes / unmounts.
- Video blur is done with CSS `filter: blur()` on a GPU-composited layer
  (`transform: scale`) rather than a canvas blur, which is much cheaper.
- `prefers-reduced-motion` is respected by both GSAP (you can wrap the
  timeline in `gsap.matchMedia` if you want to disable it entirely) and the
  particle layer (renders one static frame instead of looping).
