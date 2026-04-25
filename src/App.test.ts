import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import App from "./App.vue";

const SECTION_ANCHOR_IDS = [
  "hero",
  "work",
  "experience",
  "award",
  "skills",
  "education",
  "contact",
] as const;

describe("App (Phase 2 layout shell)", () => {
  it("mounts all section elements with required anchor ids", () => {
    const w = mount(App, {
      global: {
        stubs: {
          SiteHeader: { template: "<header class='stub-site-header' />" },
          CustomCursor: { template: "<div />" },
        },
      },
    });
    for (const id of SECTION_ANCHOR_IDS) {
      expect(w.find(`#${id}`).exists()).toBe(true);
    }
    w.unmount();
  });
});
