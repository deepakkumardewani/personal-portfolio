import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

vi.mock("@/utils/gsap", () => ({
  gsap: {
    quickSetter: vi.fn(() => (x: number) => x),
    set: vi.fn(),
    killTweensOf: vi.fn(),
  },
}));

import CustomCursor from "@/components/ui/CustomCursor.vue";

describe("CustomCursor (useCustomCursor)", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("mounts the crosshair shell", async () => {
    const w = mount(CustomCursor, { attachTo: document.body });
    await nextTick();
    expect(w.find(".custom-cursor").exists()).toBe(true);
    w.unmount();
  });
});
