import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import SkillOrbit from "@/components/ui/SkillOrbit.vue";
import { portfolio } from "@/data/portfolio.config";
import AwardSection from "./AwardSection.vue";
import ContactSection from "./ContactSection.vue";
import EducationSection from "./EducationSection.vue";
import ExperienceSection from "./ExperienceSection.vue";
import ProjectsSection from "./ProjectsSection.vue";
import SkillsSection from "./SkillsSection.vue";

describe("Phase 3 section smoke mounts", () => {
  it("mounts ProjectsSection with a panel per project", () => {
    const w = mount(ProjectsSection);
    const panels = w.findAll(".projects__panel");
    expect(panels.length).toBe(portfolio.projects.length);
    w.unmount();
  });

  it("mounts ExperienceSection with a card per role", () => {
    const w = mount(ExperienceSection);
    const n = portfolio.experience[0]?.roles.length ?? 0;
    expect(w.findAll(".experience__card").length).toBe(n);
    w.unmount();
  });

  it("mounts AwardSection with the award title from config", () => {
    const w = mount(AwardSection);
    expect(w.find(".award__title").text()).toBe(portfolio.award.title);
    w.unmount();
  });

  it("mounts SkillOrbit and SkillsSection with skill group labels", () => {
    const o = mount(SkillOrbit, {
      props: { skillGroups: portfolio.skillGroups },
    });
    expect(o.findAll(".skill-orbit__group").length).toBe(portfolio.skillGroups.length);
    o.unmount();
    const s = mount(SkillsSection);
    expect(s.find("#skills").exists()).toBe(true);
    expect(s.find(".skill-orbit__group").exists()).toBe(true);
    s.unmount();
  });

  it("mounts EducationSection and ContactSection with config-driven text", () => {
    const e = mount(EducationSection);
    expect(e.find(".education__degree").text()).toBe(portfolio.education.degree);
    e.unmount();
    const c = mount(ContactSection);
    expect(c.find("a.contact__headline").text()).toBe(portfolio.contactCta);
    expect(c.find("a.contact__headline").attributes("href")).toBe(`mailto:${portfolio.email}`);
    c.unmount();
  });
});
