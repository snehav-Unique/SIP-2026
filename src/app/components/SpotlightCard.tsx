import React from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor: _spotlightColor,
  ...rest
}: SpotlightCardProps) {
  return (
    <div className={`relative overflow-hidden ${className}`} {...rest}>
      {children}
    </div>
  );
}
