import React from 'react';
import { Logo } from './Logo';

interface HeaderProps {
  isMobile?: boolean;
}

export function Header({ isMobile }: HeaderProps) {
  return (
    <div 
      className={`fixed ${isMobile ? 'top-4 right-4' : 'top-1/2 -translate-y-1/2 right-6'} z-50`}
    >
      <div
        style={{
          background: 'rgba(247,247,247,0.8)',
          padding: isMobile ? '8px' : '12px',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        <Logo className={isMobile ? "w-[60px] h-[60px]" : "w-[100px] h-[100px]"} />
      </div>
    </div>
  );
}