import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";

const contextRevert = vi.fn();

vi.mock("@/utils/gsap", () => {
  return {
    gsap: {
      fromTo: vi.fn(),
      set: vi.fn(),
      to: vi.fn(),
      timeline: () => ({ to: vi.fn() }),
      context: (fn: () => void) => {
        fn();
        return { revert: contextRevert };
      },
    },
    ScrollTrigger: {
      getAll: () => [] as { kill: () => void }[],
      create: () => ({ kill: vi.fn() }),
    },
  };
});

import {
  useAwardAnimation,
  useExperienceAnimation,
  useHeroAnimation,
  useProjectsAnimation,
} from "./useScrollAnimations";

describe("useScrollAnimations Phase 5", () => {
  beforeEach(() => {
    contextRevert.mockClear();
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it("useHeroAnimation reverts gsap context on unmount", async () => {
    const h1 = document.createElement("h1");
    for (const c of "XY") {
      const s = document.createElement("span");
      s.className = "char";
      s.textContent = c;
      h1.append(s);
    }
    const p = document.createElement("p");
    document.body.append(h1, p);

    const C = defineComponent({
      setup() {
        const name = ref<HTMLElement | null>(h1);
        const tag = ref<HTMLElement | null>(p);
        useHeroAnimation(name, tag);
        return () => h("div");
      },
    });
    const w = mount(C);
    await flushPromises();
    await nextTick();
    w.unmount();
    expect(contextRevert).toHaveBeenCalled();
  });

  it("useProjectsAnimation reverts on unmount", async () => {
    const el = document.createElement("section");
    const panel = document.createElement("div");
    panel.className = "projects__panel";
    const title = document.createElement("h2");
    title.className = "project-card__title";
    const img = document.createElement("img");
    img.className = "project-card__image";
    const li = document.createElement("li");
    li.className = "project-card__stack-item";
    const ul = document.createElement("ul");
    ul.append(li);
    panel.append(title, ul, img);
    el.append(panel);
    document.body.append(el);

    const C = defineComponent({
      setup() {
        const section = ref<HTMLElement | null>(el);
        useProjectsAnimation(section);
        return () => h("div");
      },
    });
    const w = mount(C);
    await nextTick();
    w.unmount();
    expect(contextRevert).toHaveBeenCalled();
  });

  it("useExperienceAnimation reverts on unmount", async () => {
    const el = document.createElement("section");
    const li = document.createElement("li");
    li.className = "experience__card";
    const u = document.createElement("ul");
    u.className = "experience__highlights";
    u.appendChild(document.createElement("li"));
    li.appendChild(u);
    el.appendChild(li);
    document.body.append(el);

    const C = defineComponent({
      setup() {
        const section = ref<HTMLElement | null>(el);
        useExperienceAnimation(section);
        return () => h("div");
      },
    });
    const w = mount(C);
    await nextTick();
    w.unmount();
    expect(contextRevert).toHaveBeenCalled();
  });

  it("useAwardAnimation reverts on unmount", async () => {
    const el = document.createElement("section");
    const t = document.createElement("h2");
    t.className = "award__title";
    const m = document.createElement("p");
    m.className = "award__meta";
    el.append(t, m);
    document.body.append(el);

    const C = defineComponent({
      setup() {
        const section = ref<HTMLElement | null>(el);
        useAwardAnimation(section);
        return () => h("div");
      },
    });
    const w = mount(C);
    await nextTick();
    w.unmount();
    expect(contextRevert).toHaveBeenCalled();
  });
});
