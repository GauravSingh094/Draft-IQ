import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  id?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function GlassCard({ children, className = '', hover = true, id, onClick }: GlassCardProps) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`glass-panel rounded-2xl p-6 ${
        hover ? 'glass-panel-hover' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
