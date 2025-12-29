
import React from 'react';

interface IconProps {
  className?: string;
}

const LightningBoltIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M11.25 4.533A9.75 9.75 0 0120.25 12c0 2.291-.762 4.41-2.071 6.133A3.75 3.75 0 0015.75 12c0-1.096.463-2.094 1.216-2.801A9.72 9.72 0 0011.25 4.533zM7.424 18.233A9.742 9.742 0 0012.75 4.533 9.72 9.72 0 008.284 9.199a3.75 3.75 0 00-2.433 6.333 9.71 9.71 0 001.573 2.7z"
      clipRule="evenodd"
    />
    <path d="M12.75 2.25a.75.75 0 00-1.5 0v.812c0 .493.184.96.51 1.325l.001.002.002.002a.75.75 0 001.238-.853A10.46 10.46 0 0012.75 3V2.25z" />
  </svg>
);

export default LightningBoltIcon;
