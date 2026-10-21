"use client";

import { useRef } from "react";
import { sections } from "@/data/sections";
import { GITHUB_URL } from "@/data/site";

/**
 * The phone menu: a "Menu" button that opens a native <dialog> holding
 * every section as a plain list. Escape, the backdrop and choosing a
 * link all close it.
 */
export function Menu({ home = true }: { home?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const prefix = home ? "" : "/";
  const close = () => ref.current?.close();

  const items = [
    ...sections.map((s) => ({ id: s.id, label: s.label, href: `${prefix}#${s.id}`, external: false })),
    { id: "repos", label: "All repositories", href: "/work", external: false },
    { id: "github", label: "GitHub", href: GITHUB_URL, external: true },
  ];

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
        <div className="col pb-6 pt-7">
          <div className="flex items-center justify-between">
            <span className="font-medium">Yashvanth</span>
            <button type="button" onClick={close} className="nav-link small">
              Close
            </button>
          </div>
          <nav aria-label="Primary" className="mt-5 flex flex-col">
            {items.map((it) => (
              <a
                key={it.id}
                href={it.href}
                {...(it.external && { target: "_blank", rel: "noopener noreferrer" })}
                onClick={close}
                className="nav-link border-t border-line py-3 text-lg"
              >
                {it.label}
              </a>
            ))}
          </nav>
        </div>
      </dialog>
    </>
  );
}
