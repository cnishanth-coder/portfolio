# C Nishanth — cinematic student portfolio

A single-page portfolio for **C NISHANTH**, a BTech student at NIAT working on
AI/ML, web development and automation. Built with **React + TypeScript + Vite +
Tailwind CSS** and nothing else.

## Run it

```bash
npm install
npm run dev        # dev server
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
```

## Editing content — one file only

Everything the reader sees lives in [`src/portfolio.config.ts`](src/portfolio.config.ts):
name, tagline, bio, skills, services, the projects array, contact links and the
background video URL. **Components only read from it.** To add a project, edit
the `projects` array; no component changes are needed.

Entries marked `PLACEHOLDER` in that file are stand-ins:

- `contact.email` and the GitHub / LinkedIn / Resume URLs
- the three project cards
- `videoUrl` (a remote sample clip so the scrub effect has something to move)
- `/resume-placeholder.pdf` — drop a real PDF into `public/` (see
  [`public/README.md`](public/README.md))

## How the cinematic scroll works

```
.app
├─ <video class="bg-video">      fixed, z-index 0, scrubbed by the pointer
├─ <div class="video-shade">     fixed, z-index 1, blue gradient + darkening
├─ <header class="site-header">  fixed, z-index 10
└─ <main class="scroll-rig">     tall container: 100vh + 4400px
     └─ <div class="stage">      sticky 100vh — the only thing on screen
          ├─ section[data-segment="hero"]
          ├─ section[data-segment="about"]
          ├─ section[data-segment="skills"]
          ├─ section[data-segment="services"]
          ├─ section[data-segment="projects"]
          └─ section[data-segment="contact"]
```

- **`useScrollTimeline`** smooths scroll (`lerp 0.14`) and pointer movement
  (`lerp 0.12`) on a single `requestAnimationFrame` loop that only keeps running
  while values are still changing. It resolves each section's
  `{ enter, exit, active }` from a four-stop window (`segmentInOut`) and writes
  every animated value as a **CSS custom property directly on the stage** —
  never through React state, so no section re-renders while scrolling.
- **`useVideoScrub`** never plays the video. On pointer devices horizontal mouse
  movement becomes a time delta (`delta / innerWidth * 0.8 * duration`); on touch
  devices scroll progress maps to the clip. Seeks are queued through the
  `seeked` event so the browser is never flooded. `prefers-reduced-motion`
  disables scrubbing and parallax entirely — the composition still scrubs, just
  without inertia.
- **Projects** renders three identical sets of the config array and loops by
  jumping instantly (one frame with `transition: none`) into the matching card
  of the neighbouring set, so the infinite slider never visibly snaps.

## Responsive

Breakpoints at **1500px / 1100px / 640px**, scaling the hero title
`14rem → 11rem → 7.5rem → 4.5rem`. Below 1500px the hero title also caps at
`14vw` so the name cannot overflow narrow phones. Below 640px the header
collapses into a hamburger that morphs into an X and opens a blurred overlay.

## Accessibility

Semantic sections with `aria-label`s, labelled nav and slider controls,
`role="status"` feedback on the email copy button, arrow-key slider navigation,
`inert` on the closed mobile menu, and visible `:focus-visible` rings.

## Fonts

`Fraunces` (display serif) and `Inter` (body grotesk), loaded from Google Fonts
in `index.html`.
