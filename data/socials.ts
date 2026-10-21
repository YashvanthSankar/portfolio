import { EMAIL, GITHUB_URL } from "@/data/site";

export interface Social {
  name: string;
  href: string;
  noBlank?: boolean;
}

export const socials: Social[] = [
  { name: "GitHub", href: GITHUB_URL },
  { name: "LinkedIn", href: "https://linkedin.com/in/yashvanths" },
  { name: "X", href: "https://x.com/yashvanths19" },
  { name: "Codeforces", href: "https://codeforces.com/profile/yashvanths" },
  { name: "LeetCode", href: "https://leetcode.com/u/yashvanths/" },
  { name: "Instagram", href: "https://instagram.com/yashvanth.19" },
  { name: "Email", href: `mailto:${EMAIL}`, noBlank: true },
];

/** Public profiles — what schema.org `sameAs` wants. */
export const profileUrls = socials.filter((s) => !s.noBlank).map((s) => s.href);
