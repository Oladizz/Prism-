import React from 'react';
import Skeleton from './Skeleton';

interface EtfNetFlowsProps {
  isLoading: boolean;
}

const EtfNetFlows: React.FC<EtfNetFlowsProps> = ({ isLoading }) => {
  if (isLoading) {
    return <Skeleton className="h-[120px] rounded-3xl" />;
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-lg">
      <h3 className="text-xl font-bold text-white mb-4">ETF Net Flows</h3>
      <p className="text-gray-400">
        ETF Net Flows data is not available via free APIs. You can view this data for free on websites like{' '}
        <a href="https://farside.co.uk/?p=997" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          Farside Investors
        </a>.
      </p>
    </div>
  );
};

export default EtfNetFlows;
