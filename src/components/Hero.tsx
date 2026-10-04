import { portfolio } from "../portfolio.config";

/**
 * Section 0. The name lifts, scales down and fades as the stage scrubs forward
 * (driven by `--hero-exit`, written on the stage by the scroll engine).
 */
export function Hero() {
  return (
    <section
      className="panel panel--hero is-visible"
      id="top"
      data-segment="hero"
      aria-label="Introduction"
    >
      <div className="hero-inner">
        <h1 className="hero-title">{portfolio.name}</h1>
        <div className="hero-sub">
          <p className="hero-tagline">{portfolio.tagline}</p>
          <ul className="hero-tags" aria-label="Focus areas">
            {portfolio.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
