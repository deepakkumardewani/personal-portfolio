import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { portfolio } from "@/data/portfolio.config";
import SiteFooter from "./SiteFooter.vue";

describe("SiteFooter", () => {
  it("mounts and surfaces config-driven links and copy", () => {
    const w = mount(SiteFooter);
    const text = w.text();
    expect(text).toMatch(/2026/);
    expect(text).toContain("Deepak Kumar Dewani");
    const links = w.findAll("a[href^='http'], a[href^='mailto']");
    const hrefs = links.map((a) => a.attributes("href"));
    expect(hrefs).toContain(portfolio.links.linkedin);
    expect(hrefs).toContain(portfolio.links.github);
    expect(hrefs).toContain(`mailto:${portfolio.email}`);
    const withRel = w.findAll("a[target='_blank']");
    for (const a of withRel) {
      expect(a.attributes("rel")).toBe("noopener noreferrer");
    }
  });
});
