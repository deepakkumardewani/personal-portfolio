import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import { portfolio } from "@/data/portfolio.config";
import HeroSection from "./HeroSection.vue";

describe("HeroSection (Phase 3 static)", () => {
  it("mounts with char spans, tagline from config, and scroll cue", () => {
    const w = mount(HeroSection);
    const chars = w.findAll(".char");
    expect(chars.length).toBe(portfolio.name.toUpperCase().length);
    expect(w.find(".hero__tagline").text()).toContain(portfolio.tagline);
    expect(w.find(".hero__scroll-line").exists()).toBe(true);
    w.unmount();
  });
});
