import type { RefObject } from "react";
import { portfolio } from "../portfolio.config";

interface BackgroundVideoProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  shadeRef: RefObject<HTMLDivElement | null>;
}

/**
 * Full-screen fixed video that sits behind every section. It never plays —
 * its `currentTime` is scrubbed by `useVideoScrub`. The shade layer above it
 * darkens and cools the frame as the hero leaves so foreground copy stays
 * readable.
 */
export function BackgroundVideo({ videoRef, shadeRef }: BackgroundVideoProps) {
  return (
    <>
      <video
        ref={videoRef}
        className="bg-video"
        src={portfolio.videoUrl}
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
        aria-hidden="true"
      />
      <div ref={shadeRef} className="video-shade" aria-hidden="true" />
    </>
  );
}
