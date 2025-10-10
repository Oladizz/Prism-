import React from 'react';

const Skeleton: React.FC<{ className?: string, children?: React.ReactNode }> = ({ className, children }) => {
  return (
    <div className={`relative overflow-hidden bg-secondary skeleton-shimmer rounded-lg ${className}`}>
        {children}
    </div>
  );
};

export default Skeleton;