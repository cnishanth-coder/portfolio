import { useCallback, useEffect, useMemo, useRef } from "react";
import { portfolio } from "../portfolio.config";

interface SlideCard {
  key: string;
  index: number;
  kicker: string;
  title: string;
  description: string;
  link: { label: string; href: string };
}

/**
 * Section 4. An infinite card slider built from three identical sets of the
 * project array. Moving past either end jumps instantly (transition disabled
 * for one frame) into the matching card of the neighbouring set, so the loop
 * never visibly snaps.
 */
export function Projects() {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(portfolio.projects.length);
  const originalCount = portfolio.projects.length;

  const cards = useMemo<SlideCard[]>(() => {
    const sets = [0, 1, 2];
    return sets.flatMap((set) =>
      portfolio.projects.map((project, cardIndex) => ({
        key: `${set}-${cardIndex}`,
        index: set * originalCount + cardIndex,
        kicker: project.kicker,
        title: project.title,
        description: project.description,
        link: project.link,
      })),
    );
  }, [originalCount]);

  /** Push the current index into the DOM: track offset + active card class. */
  const applySlide = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const first = track.querySelector<HTMLElement>(".project-card");
    if (!first) return;

    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = first.offsetWidth + gap;

    track.style.setProperty("--shift", `${-step * activeRef.current}px`);
    track.style.setProperty(
      "--track-offset",
      `${Math.min(Math.max(window.innerWidth * 0.08, 24), 140)}px`,
    );

    const all = track.querySelectorAll<HTMLElement>(".project-card");
    all.forEach((card) => {
      card.classList.toggle(
        "is-current",
        Number(card.dataset.index) === activeRef.current,
      );
    });
  }, []);

  /** Instant, transition-free hop used by the normalisation step. */
  const jump = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      track.classList.add("is-jumping");
      activeRef.current = index;
      applySlide();
      requestAnimationFrame(() =>
        requestAnimationFrame(() => track.classList.remove("is-jumping")),
      );
    },
    [applySlide],
  );

  const normalize = useCallback(() => {
    if (activeRef.current >= originalCount * 2) {
      jump(activeRef.current - originalCount);
    } else if (activeRef.current < originalCount) {
      jump(activeRef.current + originalCount);
    }
  }, [jump, originalCount]);

  const move = useCallback(
    (direction: number) => {
      activeRef.current += direction;
      applySlide();
    },
    [applySlide],
  );

  const select = useCallback(
    (index: number) => {
      if (!Number.isFinite(index)) return;
      activeRef.current = index;
      applySlide();
    },
    [applySlide],
  );

  useEffect(() => {
    applySlide();

    const track = trackRef.current;
    if (!track) return;

    const onTransitionEnd = (event: TransitionEvent) => {
      // Cards transition their own transform too — only react to the track's.
      if (event.target !== track) return;
      if (event.propertyName === "transform") normalize();
    };
    const onResize = () => applySlide();

    track.addEventListener("transitionend", onTransitionEnd);
    window.addEventListener("resize", onResize);
    return () => {
      track.removeEventListener("transitionend", onTransitionEnd);
      window.removeEventListener("resize", onResize);
    };
  }, [applySlide, normalize]);

  return (
    <section
      className="panel panel--projects"
      id="projects"
      data-segment="projects"
      aria-label="Projects"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          move(-1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          move(1);
        }
      }}
    >
      <div className="projects-inner">
        <div className="projects-head">
          <p className="eyebrow">Projects</p>
          <h2>{portfolio.projectsIntro}</h2>
        </div>

        <div className="projects-viewport">
          <div className="projects-track" ref={trackRef}>
            {cards.map((card) => (
              <article
                key={card.key}
                className="project-card"
                data-index={card.index}
                onClick={() => select(card.index)}
              >
                <span className="project-kicker">{card.kicker}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <a
                  className="project-link"
                  href={card.link.href}
                  onClick={(event) => event.stopPropagation()}
                >
                  {card.link.label}
                </a>
              </article>
            ))}
          </div>
        </div>

        <div className="projects-controls" role="group" aria-label="Project slider controls">
          <button
            type="button"
            className="round-btn"
            aria-label="Previous project"
            onClick={() => move(-1)}
          >
            ←
          </button>
          <button
            type="button"
            className="round-btn"
            aria-label="Next project"
            onClick={() => move(1)}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
