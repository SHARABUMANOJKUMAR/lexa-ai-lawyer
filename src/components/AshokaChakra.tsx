import React from "react";

interface AshokaChakraProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export const AshokaChakra: React.FC<AshokaChakraProps> = ({ 
  size = 100, 
  className = "",
  animate = true 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${animate ? "chakra-spin" : ""} ${className}`}
    >
      {/* Outer Circle */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.8"
      />
      
      {/* Inner Circle */}
      <circle
        cx="50"
        cy="50"
        r="12"
        fill="currentColor"
        opacity="0.9"
      />
      
      {/* 24 Spokes */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const x1 = 50 + 15 * Math.cos(angle);
        const y1 = 50 + 15 * Math.sin(angle);
        const x2 = 50 + 45 * Math.cos(angle);
        const y2 = 50 + 45 * Math.sin(angle);
        
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.8"
          />
        );
      })}
    </svg>
  );
};
