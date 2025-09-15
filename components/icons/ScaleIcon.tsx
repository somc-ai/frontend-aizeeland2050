import React from 'react';

export const ScaleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75v16.5M9.75 20.25h4.5M1.5 4.5h21m-2.25 0L16.5 12a4.5 4.5 0 0 1-9 0L3.75 4.5" />
  </svg>
);