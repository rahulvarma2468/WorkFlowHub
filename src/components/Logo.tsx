import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      role="img"
      aria-label="WorkflowHub Sun Logo"
      className={cn("h-8 w-8", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" /> {/* indigo-500 */}
          <stop offset="100%" stopColor="#8B5CF6" /> {/* purple-600 */}
        </linearGradient>
      </defs>
      <g strokeWidth="3" strokeLinecap="round">
        {/* Sun's core */}
        <circle cx="18" cy="18" r="6" fill="url(#logo-gradient)" stroke="none" />
        
        {/* Sun's rays */}
        <g stroke="url(#logo-gradient)">
          <path d="M18 10 V5" />
          <path d="M18 26 V31" />
          <path d="M10 18 H5" />
          <path d="M26 18 H31" />
          <path d="M12.8 12.8 L9.5 9.5" />
          <path d="M23.2 12.8 L26.5 9.5" />
          <path d="M12.8 23.2 L9.5 26.5" />
          <path d="M23.2 23.2 L26.5 26.5" />
        </g>
      </g>
    </svg>
  );
};

export default Logo;
