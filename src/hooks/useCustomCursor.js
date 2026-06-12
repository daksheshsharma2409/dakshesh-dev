import { useEffect, useRef, useState } from 'react';

/**
 * A custom magnetic cursor that follows the pointer and grows on hover over
 * interactive elements. Hidden on touch devices via CSS.
 */
export function useCustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Skip on touch-only devices
    const isTouch =
      window.matchMedia('(hover: none)').matches ||
      'ontouchstart' in window;
    if (isTouch) return;
    setEnabled(true);

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: mouse.x, y: mouse.y };
    const dotPos = { x: mouse.x, y: mouse.y };

    let hovering = false;

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const tick = () => {
      // Dot follows the mouse almost instantly
      dotPos.x += (mouse.x - dotPos.x) * 0.85;
      dotPos.y += (mouse.y - dotPos.y) * 0.85;
      // Ring follows with a smooth lag
      ringPos.x += (mouse.x - ringPos.x) * 0.18;
      ringPos.y += (mouse.y - ringPos.y) * 0.18;

      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      const scale = hovering ? 2.2 : 1;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);

    const interactiveSel = 'a, button, [data-cursor="hover"], input, textarea';
    const onOver = (e) => {
      if (e.target.closest(interactiveSel)) {
        hovering = true;
        ring.classList.add('is-hover');
        dot.classList.add('is-hover');
      }
    };
    const onOut = (e) => {
      if (e.target.closest(interactiveSel)) {
        hovering = false;
        ring.classList.remove('is-hover');
        dot.classList.remove('is-hover');
      }
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  return { dotRef, ringRef, enabled };
}
