import React from 'react';

const PercentageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 6a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);

export default PercentageIcon;
