import React from 'react';

export function RollWord({ text, className = '' }) {
  return (
    <span className={`roll ${className}`}>
      <span className="r1">{text}</span>
      <span className="r2" aria-hidden="true">{text}</span>
    </span>
  );
}
