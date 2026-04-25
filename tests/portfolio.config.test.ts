import { describe, expect, it } from "vitest";
import type { ZodIssue, z } from "zod";

import { PortfolioConfigSchema, portfolio } from "@/data/portfolio.config";

function cloneConfig(): z.infer<typeof PortfolioConfigSchema> {
  return structuredClone(portfolio);
}

describe("PortfolioConfigSchema", () => {
  it("parses successfully with the shipped valid config", () => {
    expect(() => PortfolioConfigSchema.parse(portfolio)).not.toThrow();
    const parsed = PortfolioConfigSchema.parse(portfolio);
    expect(parsed.name).toBe("Deepak Kumar Dewani");
  });

  it("includes 5 projects with all required string fields and year", () => {
    const parsed = PortfolioConfigSchema.parse(portfolio);
    expect(parsed.projects).toHaveLength(5);
    for (const p of parsed.projects) {
      expect(p.id).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.tagline).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.stack.length).toBeGreaterThan(0);
      expect(p.image).toBeTruthy();
      expect(p.accentColor).toBeTruthy();
      expect(typeof p.year).toBe("number");
    }
  });

  it("rejects invalid email with a Zod error mentioning the field path", () => {
    const bad = cloneConfig();
    bad.email = "not-an-email";
    const result = PortfolioConfigSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      const path = result.error.issues.map((i: ZodIssue) => i.path.join("."));
      expect(path.some((p: string) => p === "email" || p.endsWith("email"))).toBe(true);
    }
  });

  it("rejects when name is missing with a Zod error", () => {
    const bad = cloneConfig() as Record<string, unknown>;
    delete bad.name;
    const result = PortfolioConfigSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("rejects invalid links.linkedin URL with a Zod error on links path", () => {
    const bad = cloneConfig();
    bad.links = { ...bad.links, linkedin: "not-a-valid-url" };
    const result = PortfolioConfigSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      const pathStr = result.error.issues.map((i: ZodIssue) => i.path.join("."));
      expect(pathStr.some((p: string) => p.includes("linkedin"))).toBe(true);
    }
  });

  it("allows project url to be undefined without throwing", () => {
    const good = cloneConfig();
    const [first, ...rest] = good.projects;
    expect(first).toBeDefined();
    good.projects = [{ ...first, url: undefined }, ...rest] as typeof good.projects;
    expect(() => PortfolioConfigSchema.parse(good)).not.toThrow();
  });
});
