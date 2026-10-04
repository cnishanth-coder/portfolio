import { portfolio } from "../portfolio.config";

export function Skills() {
  return (
    <section
      className="panel"
      id="skills"
      data-segment="skills"
      aria-label="Skills"
    >
      <div className="panel-card panel-card--wide">
        <p className="eyebrow">Skills</p>
        <h2>What I build with.</h2>
        <p className="lede">{portfolio.skillsIntro}</p>

        <div className="skill-groups">
          {portfolio.skills.map((group) => (
            <div className="skill-group" key={group.group}>
              <h3>{group.group}</h3>
              <ul aria-label={`${group.group} tools`}>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
