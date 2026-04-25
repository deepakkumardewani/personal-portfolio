import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import type { Project } from "@/types/portfolio";
import ProjectCard from "./ProjectCard.vue";

const baseProject: Project = {
  id: "p1",
  title: "Requestr",
  tagline: "A tagline for tests",
  description: "Desc",
  stack: ["Vue", "TypeScript"],
  image: "/projects/requestr.png",
  accentColor: "#6366f1",
  year: 2024,
  url: "https://example.com",
};

describe("ProjectCard (Phase 3 static)", () => {
  it("renders title, tagline, stack, counter, image alt, and live link", () => {
    const w = mount(ProjectCard, {
      props: { project: baseProject, index: 0, total: 5 },
    });
    expect(w.find(".project-card__title").text()).toBe(baseProject.title);
    expect(w.find(".project-card__tagline").text()).toBe(baseProject.tagline);
    expect(w.find(".project-card__counter").text().replaceAll(/\s+/g, " ").trim()).toBe("01 / 05");
    expect(w.find("img[loading='lazy']").attributes("alt")).toBe(baseProject.title);
    const link = w.find("a.project-card__link");
    expect(link.exists()).toBe(true);
    expect(link.attributes("rel")).toBe("noopener noreferrer");
    expect(link.attributes("target")).toBe("_blank");
    w.unmount();
  });

  it("hides the live link when project.url is undefined", () => {
    const w = mount(ProjectCard, {
      props: {
        project: { ...baseProject, url: undefined },
        index: 2,
        total: 5,
      },
    });
    expect(w.find("a.project-card__link").exists()).toBe(false);
    w.unmount();
  });
});
