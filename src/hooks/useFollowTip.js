import { useRef, useEffect } from 'react';
import { gsap } from '../lib/gsap';

export function useFollowTip({
  tipRef,
  offsetX = 30,
  offsetY = -60,
  maxClampX = (x) => x + 30,
  maxTilt = 14,
  tiltMultiplier = 0.6,
  enabled = true
}) {
  const qxRef = useRef(null);
  const qyRef = useRef(null);
  const qrRef = useRef(null);
  const lastXRef = useRef(0);
  const resetTimerRef = useRef(null);
  const isShownRef = useRef(false);

  useEffect(() => {
    if (!enabled || !tipRef.current) return;
    const el = tipRef.current;

    gsap.set(el, { scale: 0.6, rotation: 0, opacity: 0 });

    qxRef.current = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3' });
    qyRef.current = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3' });
    qrRef.current = gsap.quickTo(el, 'rotation', { duration: 0.7, ease: 'power3' });

    const onMouseMove = (e) => {
      const targetX = maxClampX(e.clientX);
      const targetY = e.clientY + offsetY;
      qxRef.current(targetX);
      qyRef.current(targetY);

      const vx = (e.clientX - lastXRef.current) * tiltMultiplier;
      qrRef.current(gsap.utils.clamp(-maxTilt, maxTilt, vx));
      lastXRef.current = e.clientX;

      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        if (qrRef.current) qrRef.current(0);
      }, 90);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      clearTimeout(resetTimerRef.current);
    };
  }, [enabled, tipRef, offsetX, offsetY, maxTilt, tiltMultiplier]);

  const show = (initialX, initialY) => {
    if (!tipRef.current) return;
    const el = tipRef.current;
    if (!isShownRef.current) {
      const targetX = maxClampX(initialX);
      const targetY = initialY + offsetY;
      gsap.set(el, { x: targetX, y: targetY });
      isShownRef.current = true;
    }
    gsap.to(el, { opacity: 1, scale: 1, duration: 0.55, ease: 'expo.out', overwrite: 'auto' });
  };

  const hide = () => {
    if (!tipRef.current) return;
    isShownRef.current = false;
    gsap.to(tipRef.current, { opacity: 0, scale: 0.6, duration: 0.35, ease: 'power3.in', overwrite: 'auto' });
  };

  return { show, hide, isShownRef };
}
