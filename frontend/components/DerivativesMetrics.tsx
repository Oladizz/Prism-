import React from 'react';
import Skeleton from './Skeleton';

interface DerivativesMetricsProps {
  isLoading: boolean;
}

const DerivativesMetrics: React.FC<DerivativesMetricsProps> = ({ isLoading }) => {
  if (isLoading) {
    return <Skeleton className="h-[120px] rounded-3xl" />;
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-lg">
      <h3 className="text-xl font-bold text-white mb-4">Derivatives Metrics</h3>
      <p className="text-gray-400">
        Open Interest and other derivatives data are not available via free APIs. You can view this data for free on websites like{' '}
        <a href="https://www.coinglass.com/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          Coinglass
        </a>.
      </p>
    </div>
  );
};

export default DerivativesMetrics;
