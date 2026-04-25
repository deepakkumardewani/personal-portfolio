import { describe, expect, it } from "vitest";

import { DEFAULT_ORBIT_RADIUS_PX, satellitePosition } from "./skillOrbitLayout";

describe("satellitePosition", () => {
  it("returns origin when total is 0", () => {
    expect(satellitePosition(0, 0, 100)).toEqual({ x: 0, y: 0 });
  });

  it("places 6 items on a circle with index 0 at 12 o'clock (negative y)", () => {
    const r = DEFAULT_ORBIT_RADIUS_PX;
    const p0 = satellitePosition(0, 6, r);
    expect(p0.x).toBeCloseTo(0, 5);
    expect(p0.y).toBeCloseTo(-r, 5);
  });

  it("is 90° per quarter for 4 satellites", () => {
    const r = 10;
    const t = 4;
    const a = satellitePosition(0, t, r);
    const b = satellitePosition(1, t, r);
    const dot = a.x * b.x + a.y * b.y;
    const mag = r * r;
    expect(dot / mag).toBeCloseTo(0, 5);
  });
});
