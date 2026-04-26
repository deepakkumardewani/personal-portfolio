import { usePreferredReducedMotion } from "@vueuse/core";
import { computed, nextTick, onMounted, onUnmounted, type Ref, ref, watch } from "vue";

import { gsap } from "@/utils/gsap";

const LERP = 0.35;
const MAGNET_STRENGTH = 0.4;
const INTERACTIVE_SELECTORS = "a[href], button, [data-cursor-magnetic]";

const HALF = 12;

function isReduced(v: boolean | "reduce" | "no-preference" | null | undefined): boolean {
  return v === true || v === "reduce";
}

function findMagneticElement(clientX: number, clientY: number): HTMLElement | null {
  const el = document.elementFromPoint(clientX, clientY);
  if (!el) {
    return null;
  }
  const interactive = el.closest(INTERACTIVE_SELECTORS);
  return interactive instanceof HTMLElement ? interactive : null;
}

/**
 * Custom crosshair: GSAP quickSetter for smooth follow; magnetic pull toward
 * interactive elements. Hidden when `(hover: none)`; reduced motion uses direct updates.
 */
export function useCustomCursor(rootRef: Readonly<Ref<HTMLElement | null>>) {
  const x = ref(0);
  const y = ref(0);
  const prefersReducedMotion = usePreferredReducedMotion();
  const isTouchCoarse = ref(false);

  let raf = 0;
  let setX: ((v: number) => void) | null = null;
  let setY: ((v: number) => void) | null = null;

  function makeQuickAxis(el: HTMLElement, prop: "x" | "y") {
    return gsap.quickSetter(el, prop, "px") as (v: number) => void;
  }
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let onPointerMove: ((e: PointerEvent) => void) | null = null;

  const reduced = computed(() => isReduced(prefersReducedMotion.value));

  function cancelRaf() {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  function applyTransform(nx: number, ny: number) {
    const el = rootRef.value;
    if (!el) {
      return;
    }
    if (reduced.value) {
      el.style.setProperty("transform", `translate3d(${nx}px, ${ny}px, 0)`);
      return;
    }
    setX?.(nx);
    setY?.(ny);
  }

  function tick() {
    raf = 0;
    if (reduced.value) {
      return;
    }
    currentX += (targetX - currentX) * LERP;
    currentY += (targetY - currentY) * LERP;
    applyTransform(currentX, currentY);
    x.value = currentX;
    y.value = currentY;
    if (Math.abs(targetX - currentX) > 0.15 || Math.abs(targetY - currentY) > 0.15) {
      raf = requestAnimationFrame(tick);
    }
  }

  function scheduleMove() {
    if (reduced.value) {
      applyTransform(targetX, targetY);
      x.value = targetX;
      y.value = targetY;
      return;
    }
    if (!raf) {
      raf = requestAnimationFrame(tick);
    }
  }

  function handlePointerMove(e: PointerEvent) {
    if (isTouchCoarse.value) {
      return;
    }
    const mag = !reduced.value ? findMagneticElement(e.clientX, e.clientY) : null;
    let ax = e.clientX;
    let ay = e.clientY;
    if (mag) {
      const r = mag.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      ax = e.clientX + (cx - e.clientX) * MAGNET_STRENGTH;
      ay = e.clientY + (cy - e.clientY) * MAGNET_STRENGTH;
    }
    targetX = ax - HALF;
    targetY = ay - HALF;
    if (reduced.value) {
      currentX = targetX;
      currentY = targetY;
    }
    scheduleMove();
  }

  function removePointerListener() {
    if (onPointerMove) {
      window.removeEventListener("pointermove", onPointerMove);
      onPointerMove = null;
    }
  }

  function teardown() {
    cancelRaf();
    removePointerListener();
    setX = null;
    setY = null;
    const el = rootRef.value;
    if (el) {
      gsap.killTweensOf(el);
    }
  }

  function setup() {
    teardown();
    const el = rootRef.value;
    if (!el || isTouchCoarse.value) {
      return;
    }
    if (reduced.value) {
      setX = null;
      setY = null;
    } else {
      setX = makeQuickAxis(el, "x");
      setY = makeQuickAxis(el, "y");
      gsap.set(el, { x: -HALF, y: -HALF, force3D: true });
      currentX = -HALF;
      currentY = -HALF;
      targetX = -HALF;
      targetY = -HALF;
    }
    onPointerMove = handlePointerMove;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
  }

  let offMm: (() => void) | null = null;

  onMounted(() => {
    const mm = window.matchMedia("(hover: none)");
    isTouchCoarse.value = mm.matches;
    const sync = () => {
      isTouchCoarse.value = mm.matches;
    };
    mm.addEventListener("change", sync);
    offMm = () => mm.removeEventListener("change", sync);
    void nextTick(setup);
  });

  watch(
    [() => rootRef.value, reduced, isTouchCoarse],
    () => {
      void nextTick(() => {
        if (isTouchCoarse.value) {
          teardown();
          return;
        }
        setup();
      });
    },
    { flush: "post" },
  );

  onUnmounted(() => {
    offMm?.();
    offMm = null;
    teardown();
  });

  return { x, y, isTouchCoarse, prefersReducedMotion: reduced };
}
