"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { sections } from "@/data/sections";
import { socials } from "@/data/socials";
import { EMAIL, RESUME_URL } from "@/data/site";
import { toggleTheme } from "@/components/theme-toggle";

const OPEN_EVENT = "palette:open";

interface Command {
  id: string;
  label: string;
  /** Shown muted on the right. */
  hint: string;
  /** Extra words the filter matches. */
  keywords?: string;
  /** Return "stay" to keep the menu open. */
  run: () => void | "stay";
}

/** The header's way in, for anyone who doesn't know the shortcut. */
export function PaletteButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      aria-label="Open the command menu"
      title="Command menu"
      className="nav-link"
    >
      ⌘K
    </button>
  );
}

/**
 * The command menu: ⌘K, Ctrl+K or "/" opens a native <dialog> with every
 * place on the site and a few actions. Type to filter, arrows to move,
 * Enter to run, Escape to close. Mounted once in app/layout.tsx.
 */
export function CommandPalette() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => {
      window.location.assign(href);
    };
    const out = (href: string) => () => {
      window.open(href, "_blank", "noopener,noreferrer");
    };
    return [
      ...sections.map((s) => ({ id: `go-${s.id}`, label: s.label, hint: "Section", run: go(`/#${s.id}`) })),
      { id: "repos", label: "All repositories", hint: "Page", keywords: "work projects github", run: go("/work") },
      {
        id: "copy-email",
        label: "Copy email address",
        hint: EMAIL,
        keywords: "contact mail",
        run: () => {
          navigator.clipboard?.writeText(EMAIL).then(
            () => setCopied(true),
            () => window.location.assign(`mailto:${EMAIL}`)
          );
          return "stay" as const;
        },
      },
      { id: "email", label: "Write an email", hint: "Opens your mail app", keywords: "contact hire", run: go(`mailto:${EMAIL}`) },
      { id: "resume", label: "Download résumé", hint: "PDF", keywords: "resume cv", run: go(RESUME_URL) },
      ...socials
        .filter((s) => !s.noBlank)
        .map((s) => ({ id: `social-${s.name}`, label: s.name, hint: "Opens in a new tab", run: out(s.href) })),
      { id: "theme", label: "Switch theme", hint: "Black / white", keywords: "dark light mode", run: toggleTheme },
    ];
  }, []);

  const q = query.trim().toLowerCase();
  const list = q
    ? commands.filter((c) => `${c.label} ${c.hint} ${c.keywords ?? ""}`.toLowerCase().includes(q))
    : commands;
  const index = Math.min(active, Math.max(0, list.length - 1));

  useEffect(() => {
    const open = () => {
      const d = dialog.current;
      if (!d || d.open) return;
      setQuery("");
      setActive(0);
      setCopied(false);
      d.showModal();
      input.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.closest("input, textarea, select, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, open);
    };
  }, []);

  const run = (c: Command | undefined) => {
    if (!c) return;
    if (c.run() === "stay") {
      /* Let "Copied" be read, then get out of the way. */
      setTimeout(() => dialog.current?.close(), 900);
      return;
    }
    dialog.current?.close();
  };

  const move = (to: number) => {
    if (!list.length) return;
    const next = (to + list.length) % list.length;
    setActive(next);
    document.getElementById(`cmd-${list[next].id}`)?.scrollIntoView({ block: "nearest" });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(index + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(index - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(list[index]);
    }
  };

  return (
    <dialog
      ref={dialog}
      aria-label="Command menu"
      className="palette"
      /* A click on the backdrop lands on the dialog itself, not a child. */
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
    >
      <input
        ref={input}
        type="text"
        role="combobox"
        aria-expanded="true"
        aria-controls="palette-list"
        aria-activedescendant={list[index] ? `cmd-${list[index].id}` : undefined}
        aria-label="Search commands"
        placeholder="Go to a section, copy my email, switch theme…"
        autoComplete="off"
        spellCheck={false}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
        className="palette-input"
      />
      <ul id="palette-list" role="listbox" aria-label="Commands" className="palette-list">
        {list.map((c, i) => (
          <li
            key={c.id}
            id={`cmd-${c.id}`}
            role="option"
            aria-selected={i === index}
            onPointerMove={() => i !== index && setActive(i)}
            onClick={() => run(c)}
            className="palette-item"
          >
            <span>{c.label}</span>
            <span className="small palette-hint">{c.id === "copy-email" && copied ? "Copied" : c.hint}</span>
          </li>
        ))}
        {!list.length && <li className="palette-empty small">Nothing matches “{query.trim()}”.</li>}
      </ul>
      <p className="small palette-foot">↑ ↓ to move, Enter to run, Esc to close</p>
    </dialog>
  );
}
