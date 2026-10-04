import { useEffect, type RefObject } from "react";
import { clamp } from "./useScrollTimeline";

/** How much of a full screen-width swipe maps to the whole clip. */
const SENSITIVITY = 0.8;

/**
 * Scrub a background video without ever playing it.
 *
 * - Pointer devices: horizontal mouse movement translates into a time delta.
 * - Touch devices: scroll progress maps to the clip's timeline.
 * - `prefers-reduced-motion`: scrubbing is disabled entirely.
 *
 * Seeks are throttled through the `seeked` event so the browser is never
 * flooded with `currentTime` writes while the user keeps moving.
 */
export function useVideoScrub(
  videoRef: RefObject<HTMLVideoElement | null>,
  sensitivity = SENSITIVITY,
): void {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(hover: none) and (pointer: coarse)");

    let ready = false;
    let seeking = false;
    let targetTime = 0;
    let prevX: number | null = null;

    const hasDuration = (): boolean =>
      Number.isFinite(video.duration) && video.duration > 0;

    const markReady = (): void => {
      ready = hasDuration();
      if (!ready || video.currentTime > 0) return;
      // Some browsers refuse to paint frame 0 until a seek happens. Nudge just
      // off zero so the character is visible before the pointer moves.
      try {
        video.currentTime = 0.001;
      } catch {
        // Seeking can throw before the media is decodable — safe to ignore.
      }
    };

    const seekIfNeeded = (): void => {
      if (!ready || seeking || !hasDuration()) return;
      // Nothing to do if the clip is already parked on the target frame.
      if (Math.abs(video.currentTime - targetTime) < 0.02) return;
      seeking = true;
      try {
        video.currentTime = targetTime;
      } catch {
        seeking = false;
      }
    };

    const onSeeked = (): void => {
      seeking = false;
      // Only queue another seek if the target kept moving while we waited.
      if (Math.abs(video.currentTime - targetTime) > 0.02) seekIfNeeded();
    };

    const onPointerMove = (event: PointerEvent): void => {
      if (prevX === null) {
        prevX = event.clientX;
        return;
      }
      const delta = event.clientX - prevX;
      prevX = event.clientX;
      if (!ready || !hasDuration()) return;

      targetTime = clamp(
        targetTime + (delta / window.innerWidth) * sensitivity * video.duration,
        0,
        video.duration,
      );
      seekIfNeeded();
    };

    const onScroll = (): void => {
      if (!ready || !hasDuration()) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? clamp(window.scrollY / max) : 0;
      targetTime = progress * video.duration;
      seekIfNeeded();
    };

    video.addEventListener("loadedmetadata", markReady);
    video.addEventListener("durationchange", markReady);
    if (video.readyState >= 1) markReady();

    if (!reduceMotion.matches) {
      video.addEventListener("seeked", onSeeked);
      if (coarsePointer.matches) {
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
      }
    }

    return () => {
      video.removeEventListener("loadedmetadata", markReady);
      video.removeEventListener("durationchange", markReady);
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [videoRef, sensitivity]);
}
