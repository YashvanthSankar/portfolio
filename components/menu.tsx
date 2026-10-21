"use client";

import { useRef } from "react";
import { sections } from "@/data/sections";
import { GITHUB_URL } from "@/data/site";

/**
 * The site menu: a "Menu" button that opens a native <dialog>. Inside,
 * every section is a card in one row that scrolls sideways and snaps,
 * plus a card for GitHub and one for all repositories. Escape, the
 * backdrop and choosing a card all close it.
 */
export function Menu({ home = true }: { home?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const prefix = home ? "" : "/";

  const cards = [
    ...sections.map((s) => ({ ...s, href: `${prefix}#${s.id}`, external: false })),
    { id: "repos", label: "All repositories", blurb: "Everything public on GitHub.", href: "/work", external: false },
    { id: "github", label: "GitHub", blurb: "Profile and source.", href: GITHUB_URL, external: true },
  ];

  const close = () => ref.current?.close();

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className="nav-link">
        Menu
      </button>

      <dialog
        ref={ref}
        aria-label="Site menu"
        className="menu"
        /* A click on the backdrop lands on the dialog itself, not a child. */
        onClick={(e) => e.target === ref.current && close()}
      >
        <div className="col flex items-center justify-between pt-7">
          <span className="font-medium">Yashvanth</span>
          <button type="button" onClick={close} className="nav-link small">
            Close
          </button>
        </div>

        <div className="menu-track">
          {cards.map((c) => (
            <a
              key={c.id}
              href={c.href}
              {...(c.external && { target: "_blank", rel: "noopener noreferrer" })}
              onClick={close}
              className="menu-card"
            >
              <span className="h-item">{c.label}</span>
              <span className="small text-muted">{c.blurb}</span>
            </a>
          ))}
        </div>

        <p className="col small pb-7 text-muted">Scroll sideways · Esc to close</p>
      </dialog>
    </>
  );
}
