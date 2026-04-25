import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, nextTick, ref } from "vue";

vi.mock("@/utils/gsap", () => ({
  gsap: {
    quickSetter: vi.fn(() => (v: number) => v),
    set: vi.fn(),
    killTweensOf: vi.fn(),
  },
}));

import { useCustomCursor } from "@/composables/useCustomCursor";

function flushFrames(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

describe("useCustomCursor (composable behavior)", () => {
  const matchMediaM = vi.fn();

  beforeEach(() => {
    matchMediaM.mockImplementation((q: string) => ({
      matches: false,
      media: q,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: matchMediaM,
    });
  });

  afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
  });

  it("drives lerp and pointer path when not touch-coarse", async () => {
    const C = defineComponent({
      template: '<div ref="el" class="c" style="position: fixed; width: 24px; height: 24px" />',
      setup() {
        const el = ref<HTMLElement | null>(null);
        useCustomCursor(el);
        return { el };
      },
    });
    const w = mount(C, { attachTo: document.body });
    await nextTick();
    await flushFrames();

    for (let i = 0; i < 5; i++) {
      window.dispatchEvent(
        new PointerEvent("pointermove", {
          clientX: 200 + i * 3,
          clientY: 200 + i * 2,
          bubbles: true,
        }),
      );
      await flushFrames();
    }
    w.unmount();
  });

  it("uses magnetic target when elementFromPoint returns a link", async () => {
    const a = document.createElement("a");
    a.setAttribute("href", "https://example.com");
    const span = document.createElement("span");
    a.appendChild(span);
    document.body.appendChild(a);
    a.getBoundingClientRect = () =>
      ({
        width: 40,
        height: 20,
        top: 100,
        left: 100,
        right: 140,
        bottom: 120,
        x: 100,
        y: 100,
        toJSON: () => ({}),
      }) as DOMRect;
    const spy = vi.spyOn(document, "elementFromPoint").mockReturnValue(span);

    const C = defineComponent({
      template: '<div ref="el" class="c" style="position: fixed; width: 24px; height: 24px" />',
      setup() {
        const el = ref<HTMLElement | null>(null);
        useCustomCursor(el);
        return { el };
      },
    });
    const w = mount(C, { attachTo: document.body });
    await nextTick();
    await flushFrames();

    window.dispatchEvent(
      new PointerEvent("pointermove", {
        clientX: 120,
        clientY: 110,
        bubbles: true,
      }),
    );
    await flushFrames();

    expect(spy).toHaveBeenCalled();
    w.unmount();
  });
});
