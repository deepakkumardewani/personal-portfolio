import { describe, expect, it } from "vitest";

import { useTheme } from "./useTheme";

describe("useTheme", () => {
  it("is a callable no-op scaffold", () => {
    expect(() => useTheme()).not.toThrow();
  });
});
