import React from "react";

interface JusticeScalesProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export const JusticeScales: React.FC<JusticeScalesProps> = ({ 
  size = 40, 
  className = "",
  animate = false 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`${className} ${animate ? "animate-pulse" : ""}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Base/Stand */}
      <path
        d="M22 58H42V60H22V58Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M30 48H34V58H30V48Z"
        fill="currentColor"
      />
      
      {/* Center Pillar */}
      <path
        d="M31 14H33V48H31V14Z"
        fill="currentColor"
      />
      
      {/* Top Beam */}
      <path
        d="M8 12H56V14H8V12Z"
        fill="currentColor"
      />
      
      {/* Left Chain */}
      <path
        d="M14 14V22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Right Chain */}
      <path
        d="M50 14V22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Center Ornament */}
      <circle
        cx="32"
        cy="10"
        r="4"
        fill="currentColor"
      />
      <circle
        cx="32"
        cy="10"
        r="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.5"
      />
      
      {/* Left Scale Pan */}
      <ellipse
        cx="14"
        cy="26"
        rx="10"
        ry="3"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M4 26C4 30 8 34 14 34C20 34 24 30 24 26"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Right Scale Pan */}
      <ellipse
        cx="50"
        cy="26"
        rx="10"
        ry="3"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M40 26C40 30 44 34 50 34C56 34 60 30 60 26"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Decorative elements on beam */}
      <circle cx="8" cy="13" r="1.5" fill="currentColor" />
      <circle cx="56" cy="13" r="1.5" fill="currentColor" />
      
      {/* Base decoration */}
      <path
        d="M26 58C26 56 28 54 32 54C36 54 38 56 38 58"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
};
