'use client';

import React from 'react';

interface KaabaUnityLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const KaabaUnityLogo: React.FC<KaabaUnityLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }[size];

  return (
    <div className={`relative flex items-center justify-center rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-lg group-hover:scale-105 transition-all duration-300 ${sizeClasses} ${className}`}>
      {/* EXACT OFFICIAL KAABA & UNITY HANDS LOGO IMAGE PROVIDED BY USER */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src="/kaaba_logo_official.jpg" 
        alt="نشان کعبه معظمه و دست‌های وحدت اسلامی" 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-full"
      />
    </div>
  );
};
