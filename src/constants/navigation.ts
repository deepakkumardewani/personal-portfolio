/** Anchor ids used by the fixed header, footer, and scroll-spy. */
export const ANCHOR_IDS = {
  hero: "hero",
  work: "work",
  experience: "experience",
  skills: "skills",
  contact: "contact",
} as const;

/** Ordered for intersection-based active state (excludes only-in-page sections). */
export const MAIN_NAV_ANCHOR_KEYS = ["hero", "work", "experience", "skills", "contact"] as const;

export type MainNavAnchorKey = (typeof MAIN_NAV_ANCHOR_KEYS)[number];
