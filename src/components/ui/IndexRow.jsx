import React from 'react';

export function IndexRow({
  as: Tag = 'div',
  index,
  title,
  subtitle,
  arrow = '↗',
  className = '',
  innerClassName = '',
  children,
  ...props
}) {
  return (
    <Tag className={`lr flex items-center border-b border-hair py-6 md:py-7 pr-2 ${className}`} {...props}>
      <span className={`rin flex items-center gap-5 md:gap-8 w-full ${innerClassName}`}>
        {index && <span className="mono text-dim w-6 flex-none">{index}</span>}
        {title && <span className="tt font-display text-[28px] md:text-[34px] font-semibold tracking-tight [font-variation-settings:'wdth'_75] transition-colors">{title}</span>}
        {subtitle && <span className="text-[14px] text-mute">{subtitle}</span>}
        {children}
      </span>
      {arrow && <span className="ar text-xl text-mute ml-auto flex-none">{arrow}</span>}
    </Tag>
  );
}
