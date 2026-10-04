import { portfolio } from "../portfolio.config";

export function Services() {
  return (
    <section
      className="panel"
      id="services"
      data-segment="services"
      aria-label="What I can build"
    >
      <div className="panel-card panel-card--wide">
        <p className="eyebrow">What I can build</p>
        <h2>Freelance, done properly.</h2>
        <p className="lede">{portfolio.servicesIntro}</p>

        <div className="service-grid">
          {portfolio.services.map((service) => (
            <article className="service-card" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <a className="pill-link" href={service.cta.href}>
                {service.cta.label}
                <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
