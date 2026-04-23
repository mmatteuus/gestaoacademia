import React from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white flex items-center justify-center shrink-0 ${className}`}>
      <img 
        src="/icons/logo-gemeos-white-bg.png" 
        alt="Gêmeos Academia" 
        className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
        loading="lazy"
      />
    </div>
  );
}