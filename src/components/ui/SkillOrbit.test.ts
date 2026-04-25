import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import type { SkillGroup } from "@/types/portfolio";
import SkillOrbit from "./SkillOrbit.vue";

const sampleGroups: SkillGroup[] = [
  { label: "Frontend", skills: ["Vue", "TypeScript"] },
  { label: "Backend", skills: ["Node"] },
];

describe("SkillOrbit (Task 17)", () => {
  it("mounts without error with skill groups and exposes list + orbital regions", () => {
    const w = mount(SkillOrbit, { props: { skillGroups: sampleGroups } });
    expect(w.find(".skill-orbit__list").exists()).toBe(true);
    expect(w.find(".skill-orbit__orbital").exists()).toBe(true);
    expect(w.findAll(".skill-orbit__group").length).toBe(2);
    expect(w.find(".skill-orbit__center").text()).toContain("8+");
    w.unmount();
  });
});
