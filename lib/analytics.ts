import { track } from "@vercel/analytics";

export function trackEvent(name: string, props?: Record<string, string | number | boolean>) {
  track(name, props);
}

export const events = {
  ctaClick: (label: string) => trackEvent("cta_click", { label }),
  projectView: (project: string) => trackEvent("project_view", { project }),
  resumeDownload: () => trackEvent("resume_download"),
  contactSubmit: (status: "success" | "error") => trackEvent("contact_submit", { status }),
  socialClick: (platform: string) => trackEvent("social_click", { platform }),
  themeToggle: (theme: string) => trackEvent("theme_toggle", { theme }),
  navClick: (section: string) => trackEvent("nav_click", { section }),
  sectionView: (section: string) => trackEvent("section_view", { section }),
} as const;
