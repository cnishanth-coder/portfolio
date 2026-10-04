import { useCallback, useRef, type MouseEvent } from "react";
import { About } from "./components/About";
import { BackgroundVideo } from "./components/BackgroundVideo";
import { Contact } from "./components/Contact";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { Services } from "./components/Services";
import { Skills } from "./components/Skills";
import {
  smoothstep,
  useScrollTimeline,
  type TimelineFrame,
  type TimelineSegment,
} from "./hooks/useScrollTimeline";
import { useVideoScrub } from "./hooks/useVideoScrub";

/**
 * Scroll windows for each stage section, measured in pixels through the rig.
 * Hero is always entered and only ever exits.
 */
const SEGMENTS: TimelineSegment[] = [
  { id: "hero", enterStart: -400, enterEnd: 0, exitStart: 220, exitEnd: 700 },
  { id: "about", enterStart: 780, enterEnd: 1080, exitStart: 1320, exitEnd: 1580 },
  { id: "skills", enterStart: 1560, enterEnd: 1860, exitStart: 2120, exitEnd: 2380 },
  { id: "services", enterStart: 2360, enterEnd: 2660, exitStart: 2920, exitEnd: 3180 },
  { id: "projects", enterStart: 3160, enterEnd: 3460, exitStart: 3860, exitEnd: 4120 },
  { id: "contact", enterStart: 4100, enterEnd: 4380, exitStart: 4800, exitEnd: 5000 },
];

/** Scroll distance that parks a section fully in view, used by the header. */
const ANCHORS: Record<string, number> = {
  top: 0,
  about: 1150,
  skills: 1950,
  services: 2800,
  projects: 3600,
  contact: 4380,
};

export default function App() {
  const rigRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);

  useVideoScrub(videoRef);

  /**
   * Runs every animation frame from the scroll engine. All animated values are
   * written as CSS custom properties straight onto the DOM — never React state.
   */
  const onFrame = useCallback((frame: TimelineFrame, stage: HTMLElement) => {
    const heroExit = smoothstep(220, 700, frame.scroll);

    stage.style.setProperty("--px", frame.pointerX.toFixed(4));
    stage.style.setProperty("--py", frame.pointerY.toFixed(4));
    stage.style.setProperty("--progress", frame.progress.toFixed(4));
    stage.style.setProperty("--hero-exit", heroExit.toFixed(4));

    for (const id of Object.keys(frame.segments)) {
      const state = frame.segments[id];
      stage.style.setProperty(`--enter-${id}`, state.enter.toFixed(4));
      stage.style.setProperty(`--exit-${id}`, state.exit.toFixed(4));
    }

    const video = videoRef.current;
    if (video) {
      video.style.setProperty(
        "--video-blur",
        `${(heroExit * 14).toFixed(2)}px`,
      );
      video.style.setProperty(
        "--video-brightness",
        (1 - heroExit * 0.25).toFixed(4),
      );
      video.style.setProperty(
        "--video-scale",
        (1.06 + frame.progress * 0.05).toFixed(4),
      );
    }

    const shade = shadeRef.current;
    if (shade) {
      shade.style.setProperty("--shade-a", (heroExit * 0.68).toFixed(4));
    }
  }, []);

  useScrollTimeline({
    rigRef,
    stageRef,
    segments: SEGMENTS,
    onFrame,
  });

  const navigate = useCallback((id: string) => {
    const rig = rigRef.current;
    if (!rig) return;
    const distance = ANCHORS[id] ?? 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: rig.offsetTop + distance,
      behavior: reduce ? "auto" : "smooth",
    });
  }, []);

  /** Route every in-page `#anchor` through the smooth-scroll navigator. */
  const onRootClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor) return;
      const id = (anchor.getAttribute("href") ?? "").slice(1);
      if (!id) return;
      event.preventDefault();
      navigate(id);
    },
    [navigate],
  );

  return (
    <div className="app" onClick={onRootClick}>
      <BackgroundVideo videoRef={videoRef} shadeRef={shadeRef} />

      <Header onNavigate={navigate} />

      <main className="scroll-rig" ref={rigRef}>
        <div className="stage" ref={stageRef}>
          <Hero />
          <About />
          <Skills />
          <Services />
          <Projects />
          <Contact />
        </div>
      </main>
    </div>
  );
}
