import React from 'react';

const Skeleton: React.FC<{ className?: string, children?: React.ReactNode }> = ({ className, children }) => {
  return (
    <div className={`bg-secondary animate-pulse rounded-lg ${className}`}>
        {children}
    </div>
  );
};

export default Skeleton;
