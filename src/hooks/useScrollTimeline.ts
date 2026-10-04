import { useEffect, useRef, type RefObject } from "react";

/* -------------------------------------------------------------------------- */
/*  Easing helpers                                                            */
/* -------------------------------------------------------------------------- */

/** Clamp `v` into the inclusive `[min, max]` range. */
export function clamp(v: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, v));
}

/** Linear interpolation between `a` and `b` by `t`. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Classic Hermite smoothstep — 0 below `e0`, 1 above `e1`. */
export function smoothstep(e0: number, e1: number, v: number): number {
  const span = e1 - e0 || 1;
  const x = clamp((v - e0) / span);
  return x * x * (3 - 2 * x);
}

export interface SegmentState {
  enter: number;
  exit: number;
  active: number;
}

/**
 * Resolve a scroll position against a four-stop window.
 * `a..b` is the entrance ramp, `c..d` the exit ramp.
 */
export function segmentInOut(
  scroll: number,
  a: number,
  b: number,
  c: number,
  d: number,
): SegmentState {
  const enter = smoothstep(a, b, scroll);
  const exit = smoothstep(c, d, scroll);
  return { enter, exit, active: enter * (1 - exit) };
}

/* -------------------------------------------------------------------------- */
/*  Hook                                                                      */
/* -------------------------------------------------------------------------- */

export interface TimelineSegment {
  /** Matches the `data-segment` attribute of a stage section. */
  id: string;
  enterStart: number;
  enterEnd: number;
  exitStart: number;
  exitEnd: number;
}

export interface TimelineFrame {
  /** Smoothed scroll distance through the rig, in pixels. */
  scroll: number;
  /** Smoothed scroll distance as 0..1 of the whole rig. */
  progress: number;
  /** Smoothed pointer position, normalised to -0.5..0.5. */
  pointerX: number;
  pointerY: number;
  /** Resolved enter/exit/active values, keyed by segment id. */
  segments: Record<string, SegmentState>;
}

export interface ScrollTimelineOptions {
  /** The tall scroll container. */
  rigRef: RefObject<HTMLElement | null>;
  /** The sticky 100vh stage inside the rig. */
  stageRef: RefObject<HTMLElement | null>;
  segments: TimelineSegment[];
  /** Called every animation frame — write CSS custom properties here. */
  onFrame: (frame: TimelineFrame, stage: HTMLElement) => void;
}

const SCROLL_SMOOTHING = 0.14;
const POINTER_SMOOTHING = 0.12;

/**
 * Custom scroll engine.
 *
 * Smooths scroll and pointer movement across a single `requestAnimationFrame`
 * loop that only keeps running while values are actually changing, then hands
 * the resolved values to `onFrame` so they can be written as CSS custom
 * properties directly on the stage element (never through React state).
 */
export function useScrollTimeline({
  rigRef,
  stageRef,
  segments,
  onFrame,
}: ScrollTimelineOptions): void {
  const frameCallback = useRef(onFrame);
  frameCallback.current = onFrame;

  const segmentList = useRef(segments);
  segmentList.current = segments;

  useEffect(() => {
    const rig = rigRef.current;
    const stage = stageRef.current;
    if (!rig || !stage) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let targetScroll = 0;
    let smoothScroll = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let initialized = false;
    let rafPending = false;
    let rafId = 0;

    const panels = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-segment]"),
    );
    /** Cache of applied classes so we only touch the DOM when a flag flips. */
    const applied = new Map<string, boolean>();

    const getScrollDistance = (): number =>
      clamp(
        -rig.getBoundingClientRect().top,
        0,
        rig.offsetHeight - window.innerHeight,
      );

    const update = (): void => {
      rafPending = false;

      targetScroll = getScrollDistance();

      if (!initialized || reduceMotion.matches) {
        smoothScroll = targetScroll;
        initialized = true;
      } else {
        smoothScroll = lerp(smoothScroll, targetScroll, SCROLL_SMOOTHING);
      }
      // Snap once the remaining gap is imperceptible so the loop can settle.
      if (Math.abs(smoothScroll - targetScroll) < 0.08) {
        smoothScroll = targetScroll;
      }

      if (reduceMotion.matches) {
        pointerX = 0;
        pointerY = 0;
      } else {
        pointerX = lerp(pointerX, targetPointerX, POINTER_SMOOTHING);
        pointerY = lerp(pointerY, targetPointerY, POINTER_SMOOTHING);
      }

      const resolved: Record<string, SegmentState> = {};
      for (const segment of segmentList.current) {
        resolved[segment.id] = segmentInOut(
          smoothScroll,
          segment.enterStart,
          segment.enterEnd,
          segment.exitStart,
          segment.exitEnd,
        );
      }

      const total = Math.max(1, rig.offsetHeight - window.innerHeight);
      frameCallback.current(
        {
          scroll: smoothScroll,
          progress: clamp(smoothScroll / total),
          pointerX,
          pointerY,
          segments: resolved,
        },
        stage,
      );

      for (const panel of panels) {
        const id = panel.dataset.segment;
        if (id === undefined) continue;
        const state = resolved[id];
        if (!state) continue;

        const visible = state.active > 0.015;
        const active = state.active > 0.6;

        if (applied.get(`${id}:visible`) !== visible) {
          panel.classList.toggle("is-visible", visible);
          applied.set(`${id}:visible`, visible);
        }
        if (applied.get(`${id}:active`) !== active) {
          panel.classList.toggle("is-active", active);
          applied.set(`${id}:active`, active);
        }
      }

      const scrollSettling = Math.abs(smoothScroll - targetScroll) > 0.08;
      const pointerSettling =
        !reduceMotion.matches &&
        (Math.abs(pointerX - targetPointerX) > 0.001 ||
          Math.abs(pointerY - targetPointerY) > 0.001);

      if (scrollSettling || pointerSettling) requestTick();
    };

    const requestTick = (): void => {
      if (rafPending) return;
      rafPending = true;
      rafId = requestAnimationFrame(update);
    };

    const onScroll = (): void => requestTick();

    const onPointerMove = (event: PointerEvent): void => {
      targetPointerX = event.clientX / window.innerWidth - 0.5;
      targetPointerY = event.clientY / window.innerHeight - 0.5;
      requestTick();
    };

    const onResize = (): void => requestTick();

    const onReduceMotionChange = (): void => {
      initialized = false;
      requestTick();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);
    reduceMotion.addEventListener("change", onReduceMotionChange);

    requestTick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      reduceMotion.removeEventListener("change", onReduceMotionChange);
    };
  }, [rigRef, stageRef]);
}
