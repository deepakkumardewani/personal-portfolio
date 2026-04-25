import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/utils/gsap", () => {
  return {
    default: { to: vi.fn().mockReturnValue({}), killTweensOf: vi.fn() },
    ScrollTrigger: {
      create: () => ({ kill: vi.fn() }),
    },
    gsap: { to: vi.fn().mockReturnValue({}), killTweensOf: vi.fn() },
  };
});

import SiteHeader from "./SiteHeader.vue";

afterEach(() => {
  for (const id of ["hero", "work", "experience", "skills", "contact"]) {
    document.getElementById(id)?.remove();
  }
});

describe("SiteHeader", () => {
  it("mounts and exposes main navigation anchors and hamburger a11y", () => {
    for (const id of ["hero", "work", "experience", "skills", "contact"]) {
      const s = document.createElement("section");
      s.id = id;
      document.body.appendChild(s);
    }

    const w = mount(SiteHeader, { attachTo: document.body });
    expect(w.find("a[href='#work']").exists()).toBe(true);
    const btn = w.find("button[aria-controls='site-header-drawer']");
    expect(btn.attributes("aria-expanded")).toBe("false");
    w.unmount();
  });
});
