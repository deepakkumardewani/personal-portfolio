import { useMouseInElement } from "@vueuse/core";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { gsap } from "./utils/gsap";

describe("Phase 0 dependencies", () => {
  it("resolves gsap, VueUse, and Zod", () => {
    expect(typeof gsap.to).toBe("function");
    expect(z.string().parse("x")).toBe("x");
    expect(typeof useMouseInElement).toBe("function");
  });
});
