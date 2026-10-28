import { useRef, useEffect } from 'react';
import { gsap } from '../../lib/gsap';
import { usePointerFine } from '../../hooks/usePointerFine';

export function Button({
  as: Tag = 'button',
  variant = 'default',
  size = 'hero',
  magnetic = false,
  className = '',
  children,
  ...props
}) {
  const btnRef = useRef(null);
  const isFine = usePointerFine();

  useEffect(() => {
    if (!magnetic || !isFine || !btnRef.current) return;
    const btn = btnRef.current;
    const qx = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3' });
    const qy = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3' });

    const onMouseMove = (e) => {
      const r = btn.getBoundingClientRect();
      qx((e.clientX - r.left - r.width / 2) * 0.3);
      qy((e.clientY - r.top - r.height / 2) * 0.4);
    };

    const onMouseLeave = () => {
      qx(0);
      qy(0);
    };

    btn.addEventListener('mousemove', onMouseMove);
    btn.addEventListener('mouseleave', onMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', onMouseMove);
      btn.removeEventListener('mouseleave', onMouseLeave);
      qx(0);
      qy(0);
    };
  }, [magnetic, isFine]);

  const sizeClass = size === 'hero' ? 'btn-hero' : size === 'project' ? 'btn-project' : 'btn-contact';
  const variantClass = variant === 'ghost' ? 'ghost' : '';

  return (
    <Tag
      ref={btnRef}
      className={`btn ${sizeClass} ${variantClass} text-ink ${className}`}
      data-cursor="link"
      {...props}
    >
      {children}
    </Tag>
  );
}
