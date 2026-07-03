import { useEffect, useRef } from "react";
import { useSpring } from "framer-motion";
import { isLiteMode } from "../../hooks/useMobileProfile";

/**
 * Cursor-driven "bend" physics for a branch/flourish.
 *
 * Proximity is measured against the branch's whole bounding box, so hovering
 * anywhere along it (including near the tip) drives the bend — not only near
 * the root. The branch rotates around its pinned root (`rootFrac`), so the
 * origin stays planted, and springs back to rest when the cursor leaves.
 *
 * Anchor is measured from `mountRef` — this must be a STABLE (non-transformed)
 * element so the reading doesn't feed back into the transform we apply.
 */
export function useCursorBend(
  mountRef,
  { rootFrac = { x: 0, y: 0.5 }, radius = 150, maxRotate = 20 } = {}
) {
  const rotate = useSpring(0, { stiffness: 140, damping: 14, mass: 0.7 });
  const state = useRef({ px: 0, py: 0, pending: false, frame: 0 });
  const rx = rootFrac.x;
  const ry = rootFrac.y;

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return undefined;
    if (isLiteMode()) return undefined;

    const s = state.current;
    const rest = () => rotate.set(0);

    const apply = () => {
      s.pending = false;
      const rect = el.getBoundingClientRect();

      // distance from the cursor to the branch's bounding box (0 when inside)
      const nearX = Math.max(rect.left, Math.min(s.px, rect.right));
      const nearY = Math.max(rect.top, Math.min(s.py, rect.bottom));
      const dist = Math.hypot(s.px - nearX, s.py - nearY);

      if (dist >= radius) {
        rest();
        return;
      }

      const influence = 1 - dist / radius;

      // rotate the branch so its tip leans toward the cursor, pivoting at root
      const pivotX = rect.left + rx * rect.width;
      const pivotY = rect.top + ry * rect.height;
      const dx = s.px - pivotX;
      const dy = s.py - pivotY;
      const pivotDist = Math.hypot(dx, dy) || 1;
      const dirY = dy / pivotDist;

      rotate.set(dirY * maxRotate * influence);
    };

    const onMove = (event) => {
      s.px = event.clientX;
      s.py = event.clientY;
      if (!s.pending) {
        s.pending = true;
        s.frame = window.requestAnimationFrame(apply);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", rest);
    window.addEventListener("blur", rest);

    return () => {
      window.cancelAnimationFrame(s.frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", rest);
      window.removeEventListener("blur", rest);
    };
  }, [mountRef, rx, ry, radius, maxRotate, rotate]);

  return { rotate };
}
