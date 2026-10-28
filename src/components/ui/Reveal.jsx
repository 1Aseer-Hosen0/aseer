import React from 'react';

export function Reveal({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag data-rv className={className} {...props}>
      {children}
    </Tag>
  );
}
