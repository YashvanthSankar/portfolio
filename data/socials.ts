import { EMAIL, GITHUB_URL } from "@/data/site";
import type { SocialIconName } from "@/components/ui/social-icon";

export interface Social {
  name: string;
  href: string;
  /** Symbol id in the sprite — see components/ui/social-icon.tsx. */
  icon: SocialIconName;
  noBlank?: boolean;
}

export const socials: Social[] = [
  { name: "GitHub", href: GITHUB_URL, icon: "github" },
  { name: "LinkedIn", href: "https://linkedin.com/in/yashvanths", icon: "linkedin" },
  { name: "X", href: "https://x.com/yashvanths19", icon: "x" },
  { name: "Codeforces", href: "https://codeforces.com/profile/yashvanths", icon: "codeforces" },
  { name: "LeetCode", href: "https://leetcode.com/u/yashvanths/", icon: "leetcode" },
  { name: "Instagram", href: "https://instagram.com/yashvanth.19", icon: "instagram" },
  { name: "Email", href: `mailto:${EMAIL}`, icon: "mail", noBlank: true },
];

/** Public profiles — what schema.org `sameAs` wants. */
export const profileUrls = socials.filter((s) => !s.noBlank).map((s) => s.href);
