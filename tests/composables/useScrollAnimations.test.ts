/**
 * Task 25: unmount cleanup for scroll-driven animation composables.
 * GSAP is mocked so no real DOM / ScrollTrigger runtime is required.
 */
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";

const gsapMocks = vi.hoisted(() => ({
  contextRevert: vi.fn(),
  triggerKill: vi.fn(),
  scrollTriggerCreateKill: vi.fn(),
  lastScrollTriggerOnUpdate: null as null | (() => void),
}));

vi.mock("@/utils/gsap", () => {
  return {
    gsap: {
      fromTo: vi.fn(),
      set: vi.fn(),
      to: vi.fn(),
      killTweensOf: vi.fn(),
      timeline: () => ({ to: vi.fn() }),
      context: (fn: () => void) => {
        fn();
        return { revert: gsapMocks.contextRevert };
      },
    },
    ScrollTrigger: {
      getAll: () => [{ kill: gsapMocks.triggerKill } as { kill: () => void }],
      create: (opts: { onUpdate?: () => void }) => {
        gsapMocks.lastScrollTriggerOnUpdate = opts.onUpdate ?? null;
        return { kill: gsapMocks.scrollTriggerCreateKill };
      },
    },
  };
});

import {
  useAwardAnimation,
  useContactAnimation,
  useEducationAnimation,
  useExperienceAnimation,
  useHeroAnimation,
  useProjectsAnimation,
  useSiteHeaderScrollAnimation,
  useSkillOrbitTagBurst,
  useSkillOrbitTilt,
  useSkillsAnimation,
} from "@/composables/useScrollAnimations";

describe("useScrollAnimations cleanup on unmount", () => {
  beforeEach(() => {
    gsapMocks.contextRevert.mockClear();
    gsapMocks.triggerKill.mockClear();
    gsapMocks.lastScrollTriggerOnUpdate = null;
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it("useHeroAnimation: gsap context revert runs on unmount (ScrollTrigger safety net)", async () => {
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
    expect(gsapMocks.contextRevert).toHaveBeenCalled();
  });

  it("useExperienceAnimation: gsap context revert runs on unmount", async () => {
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
    expect(gsapMocks.contextRevert).toHaveBeenCalled();
  });

  it("useProjectsAnimation: gsap context revert runs on unmount", async () => {
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
    expect(gsapMocks.contextRevert).toHaveBeenCalled();
  });

  it("useAwardAnimation: gsap context revert runs on unmount", async () => {
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
    expect(gsapMocks.contextRevert).toHaveBeenCalled();
  });

  it("useSiteHeaderScrollAnimation: ScrollTrigger cleanup on unmount and onUpdate uses scrollY", async () => {
    const header = document.createElement("header");
    document.body.append(header);

    const C = defineComponent({
      setup() {
        const headerRef = ref<HTMLElement | null>(header);
        useSiteHeaderScrollAnimation(headerRef);
        return () => h("div");
      },
    });
    const w = mount(C);
    await flushPromises();
    await nextTick();
    const onUpdate = gsapMocks.lastScrollTriggerOnUpdate;
    expect(typeof onUpdate).toBe("function");
    const setY = (y: number) => {
      Object.defineProperty(window, "scrollY", {
        value: y,
        configurable: true,
        writable: true,
      });
    };
    setY(40);
    onUpdate?.();
    setY(200);
    onUpdate?.();
    setY(150);
    onUpdate?.();
    gsapMocks.scrollTriggerCreateKill.mockClear();
    w.unmount();
    expect(gsapMocks.scrollTriggerCreateKill).toHaveBeenCalled();
  });

  it("useSkillOrbitTilt: exposes stageStyle from orbit ref", async () => {
    const orbit = document.createElement("div");
    Object.defineProperty(orbit, "clientWidth", {
      value: 200,
      configurable: true,
    });
    Object.defineProperty(orbit, "clientHeight", {
      value: 200,
      configurable: true,
    });
    document.body.append(orbit);

    const C = defineComponent({
      setup() {
        const orbitRef = ref<HTMLElement | null>(orbit);
        const { stageStyle } = useSkillOrbitTilt(orbitRef);
        return () => h("div", { class: "t" }, String(stageStyle.value.transform ?? ""));
      },
    });
    const w = mount(C);
    await nextTick();
    expect(w.find(".t").exists()).toBe(true);
    w.unmount();
  });

  it("useSkillOrbitTagBurst: registers when satellite and tag refs align", async () => {
    const sat = document.createElement("div");
    const tags = document.createElement("div");
    document.body.append(sat, tags);

    const C = defineComponent({
      setup() {
        const satRefs = ref<(HTMLElement | null)[]>([sat]);
        const tagRefs = ref<(HTMLElement | null)[]>([tags]);
        const prefersReducedMotion = ref(false);
        useSkillOrbitTagBurst(satRefs, tagRefs, prefersReducedMotion);
        return () => h("div");
      },
    });
    const w = mount(C);
    await nextTick();
    w.unmount();
  });

  it("useSkillsAnimation: kills all ScrollTriggers on unmount", async () => {
    gsapMocks.triggerKill.mockClear();
    const C = defineComponent({
      setup() {
        useSkillsAnimation();
        return () => h("div");
      },
    });
    mount(C).unmount();
    expect(gsapMocks.triggerKill).toHaveBeenCalled();
  });

  it("useEducationAnimation: kills all ScrollTriggers on unmount", async () => {
    gsapMocks.triggerKill.mockClear();
    const C = defineComponent({
      setup() {
        useEducationAnimation();
        return () => h("div");
      },
    });
    mount(C).unmount();
    expect(gsapMocks.triggerKill).toHaveBeenCalled();
  });

  it("useContactAnimation: kills all ScrollTriggers on unmount", async () => {
    gsapMocks.triggerKill.mockClear();
    const C = defineComponent({
      setup() {
        useContactAnimation();
        return () => h("div");
      },
    });
    mount(C).unmount();
    expect(gsapMocks.triggerKill).toHaveBeenCalled();
  });
});
