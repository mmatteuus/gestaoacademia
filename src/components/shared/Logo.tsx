import React from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <img 
      src="/icons/logo-gemeos-white-bg.png" 
      alt="Gêmeos Academia" 
      className={`h-8 w-8 sm:h-9 sm:w-9 object-contain ${className}`}
      loading="lazy"
    />
  );
}