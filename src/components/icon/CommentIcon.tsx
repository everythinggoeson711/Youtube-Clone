import React from 'react';

export const CommentIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      focusable="false"
      aria-hidden="true"
      className={className}
      fill='#ffffff'
      style={{ pointerEvents: 'none', display: 'inherit', width: '30px', height: '30px' }}
    >
      <path d="M20 2H4c-1.1 0-2 .9-2 2v14l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2zm0-3H6V4h12v2z"></path>
    </svg>
  );
};