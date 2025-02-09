import React from 'react';

export const PrevIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      focusable="false"
      aria-hidden="true"
      className={className}
      style={{ pointerEvents: 'none', display: 'inherit', width: '100%', height: '100%' }}
    >
      <path
        clipRule="evenodd"
        d="M19.884 10.114a1.25 1.25 0 01-1.768 1.768L13.25 7.016v12.982a1.25 1.25 0 11-2.5 0V7.016l-4.866 4.866a1.25 1.25 0 11-1.768-1.768L12 2.23l7.884 7.884Z"
        fillRule="evenodd"
      ></path>
    </svg>
  );
};