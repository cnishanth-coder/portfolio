import { useEffect, useRef, useState } from "react";
import { portfolio } from "../portfolio.config";

export function Contact() {
  const { heading, note, email, links } = portfolio.contact;
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked — the email is still visible on screen.
    }
  };

  return (
    <section
      className="panel"
      id="contact"
      data-segment="contact"
      aria-label="Contact"
    >
      <div className="panel-card">
        <p className="eyebrow">Contact</p>
        <h2>{heading}</h2>
        <p className="lede lede--tight">{note}</p>

        <div className="contact-pills">
          <button
            type="button"
            className="pill pill--solid"
            onClick={copyEmail}
            aria-label={`Copy email address ${email}`}
          >
            <span>{email}</span>
            <span className="pill-icon" aria-hidden="true">
              {copied ? "✓" : "⧉"}
            </span>
          </button>

          {links.map((link) => (
            <a
              key={link.label}
              className="pill"
              href={link.href}
              {...(link.download
                ? { download: link.download }
                : { target: "_blank", rel: "noreferrer" })}
            >
              {link.label}
              <span className="pill-icon" aria-hidden="true">
                {link.download ? "↓" : "↗"}
              </span>
            </a>
          ))}
        </div>

        <p className="copy-status" role="status" aria-live="polite">
          {copied ? "Email copied to clipboard." : ""}
        </p>
      </div>
    </section>
  );
}
