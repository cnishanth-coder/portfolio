import { portfolio } from "../portfolio.config";

export function About() {
  return (
    <section
      className="panel"
      id="about"
      data-segment="about"
      aria-label="About"
    >
      <div className="panel-card">
        <p className="eyebrow">About</p>
        <h2>{portfolio.about.heading}</h2>
        <p className="lede">{portfolio.about.body}</p>
      </div>
    </section>
  );
}
