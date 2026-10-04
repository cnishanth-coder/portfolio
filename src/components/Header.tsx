import { useEffect, useState } from "react";
import { navLinks, portfolio } from "../portfolio.config";

interface HeaderProps {
  /** Smooth-scroll to a stage section by id. */
  onNavigate: (id: string) => void;
}

const resumeLink = portfolio.contact.links.find((link) => link.label === "Resume");

/**
 * Fixed, transparent header. Desktop shows the logo, centred section links and
 * an underlined Resume link. Below 640px the links collapse into a hamburger
 * that morphs into an X and opens a full-screen blurred overlay.
 */
export function Header({ onNavigate }: HeaderProps) {
  const [open, setOpen] = useState(false);

  // Lock page scroll while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <header className="site-header">
        <a
          className="site-logo"
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            go("top");
          }}
        >
          {portfolio.logo}
        </a>

        <nav className="site-nav" aria-label="Main menu">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(event) => {
                event.preventDefault();
                go(link.id);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {resumeLink && (
          <a
            className="header-resume"
            href={resumeLink.href}
            {...(resumeLink.download
              ? { download: resumeLink.download }
              : { target: "_blank", rel: "noreferrer" })}
          >
            Resume
          </a>
        )}

        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </header>

      <nav
        id="mobile-menu"
        className={`mobile-menu${open ? " is-open" : ""}`}
        aria-label="Mobile menu"
        aria-hidden={!open}
        {...(!open ? { inert: true } : {})}
      >
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(event) => {
              event.preventDefault();
              go(link.id);
            }}
          >
            {link.label}
          </a>
        ))}
        {resumeLink && (
          <a
            className="mobile-resume"
            href={resumeLink.href}
            {...(resumeLink.download
              ? { download: resumeLink.download }
              : { target: "_blank", rel: "noreferrer" })}
            onClick={() => setOpen(false)}
          >
            Resume
          </a>
        )}
      </nav>
    </>
  );
}
