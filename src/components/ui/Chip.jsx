import React from 'react';

export function Chip({ status = false, stack = false, repo = false, className = '', children, ...props }) {
  if (status) {
    return (
      <span className={`inline-flex items-center gap-2 h-7 px-3 rounded-full border border-cyan/20 bg-cyan/[.06] text-cyan uppercase text-[10px] tracking-[.08em] ${className}`} {...props}>
        <i className="dot w-1.5 h-1.5 rounded-full bg-cyan" />
        {children}
      </span>
    );
  }

  if (stack) {
    return (
      <i className={`stack-chip not-italic ${className}`} {...props}>
        {children}
      </i>
    );
  }

  if (repo) {
    return (
      <span className={`inline-flex items-center h-7 px-3 rounded-full border border-hair text-mute text-[10px] ${className}`} {...props}>
        {children}
      </span>
    );
  }

  return (
    <span className={`chipx ${className}`} {...props}>
      {children}
    </span>
  );
}
