"use client";

import { Github, Linkedin, Instagram, Mail, ArrowUp } from "lucide-react";

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/YashvanthSankar",
    icon: Github,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/yashvanths",
    icon: Linkedin,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/yashavnth191206",
    icon: Instagram,
  },
  {
    name: "Email",
    href: "mailto:yashvanthsankar@gmail.com",
    icon: Mail,
  },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-12 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-xl font-bold text-white">YS.</span>
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} Yashvanth. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-400 transition-colors"
                aria-label={link.name}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors group"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
