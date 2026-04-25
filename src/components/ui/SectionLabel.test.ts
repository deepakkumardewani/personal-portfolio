import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import SectionLabel from "./SectionLabel.vue";

describe("SectionLabel", () => {
  it("mounts and shows index and label", () => {
    const w = mount(SectionLabel, { props: { index: "01", label: "WORK" } });
    expect(w.text()).toContain("01 / WORK");
  });
});
