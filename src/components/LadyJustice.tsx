import React from "react";

interface LadyJusticeProps {
  size?: number;
  className?: string;
}

export const LadyJustice: React.FC<LadyJusticeProps> = ({ 
  size = 40, 
  className = "" 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Balance beam */}
      <line
        x1="12"
        y1="20"
        x2="52"
        y2="20"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      
      {/* Center pillar */}
      <line
        x1="32"
        y1="20"
        x2="32"
        y2="58"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Base */}
      <path
        d="M22 58 L42 58 L40 62 L24 62 Z"
        fill="currentColor"
        opacity="0.9"
      />
      
      {/* Fulcrum triangle */}
      <path
        d="M28 20 L32 12 L36 20 Z"
        fill="currentColor"
        opacity="0.9"
      />
      
      {/* Left scale pan chain */}
      <line
        x1="12"
        y1="20"
        x2="8"
        y2="30"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="12"
        y1="20"
        x2="16"
        y2="30"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      
      {/* Left scale pan */}
      <ellipse
        cx="12"
        cy="34"
        rx="10"
        ry="4"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M2 34 Q2 38 12 40 Q22 38 22 34"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      
      {/* Right scale pan chain */}
      <line
        x1="52"
        y1="20"
        x2="48"
        y2="30"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="52"
        y1="20"
        x2="56"
        y2="30"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      
      {/* Right scale pan */}
      <ellipse
        cx="52"
        cy="34"
        rx="10"
        ry="4"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M42 34 Q42 38 52 40 Q62 38 62 34"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      
      {/* Decorative elements on beam */}
      <circle cx="32" cy="12" r="3" fill="currentColor" />
      
      {/* Small decorative circles at chain connections */}
      <circle cx="12" cy="20" r="2" fill="currentColor" />
      <circle cx="52" cy="20" r="2" fill="currentColor" />
    </svg>
  );
};
