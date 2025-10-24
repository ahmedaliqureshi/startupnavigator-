
import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.584C10.866 6.33 13.134 6.33 14.685 7.584l.043.033.043.033c1.552 1.254 1.552 3.27 0 4.524l-2.47 1.998a.75.75 0 01-1.05-.001l-2.47-1.998a3.25 3.25 0 010-4.524l.043-.034.043-.033zM12 3.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0112 3.75zM17.25 7.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM6 7.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H6.75A.75.75 0 016 7.5zM12 18a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0112 18z"
      clipRule="evenodd"
    />
  </svg>
);

export default SparklesIcon;
