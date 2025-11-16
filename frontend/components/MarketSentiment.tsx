import React from 'react';
import Skeleton from './Skeleton';

interface MarketSentimentProps {
  isLoading: boolean;
}

const MarketSentiment: React.FC<MarketSentimentProps> = ({ isLoading }) => {
  if (isLoading) {
    return <Skeleton className="h-[120px] rounded-3xl" />;
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-lg">
      <h3 className="text-xl font-bold text-white mb-4">Real-time Market Sentiment</h3>
      <p className="text-gray-400">
        Real-time market sentiment requires advanced data analysis and specialized APIs (e.g., social media, news).
      </p>
    </div>
  );
};

export default MarketSentiment;
