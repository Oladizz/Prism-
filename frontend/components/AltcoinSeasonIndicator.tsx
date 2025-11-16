import React from 'react';
import Skeleton from './Skeleton';

interface AltcoinSeasonIndicatorProps {
  btcDominance: number | null;
  isLoading: boolean;
}

const AltcoinSeasonIndicator: React.FC<AltcoinSeasonIndicatorProps> = ({ btcDominance, isLoading }) => {
  if (isLoading || btcDominance === null) {
    return <Skeleton className="h-[120px] rounded-3xl" />;
  }

  const isAltcoinSeason = btcDominance < 50; // Simplified definition: BTC dominance below 50%

  return (
    <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-lg">
      <h3 className="text-xl font-bold text-white mb-4">Altcoin Season</h3>
      <div className="flex flex-col items-center justify-center h-20">
        <p className={`text-3xl font-bold ${isAltcoinSeason ? 'text-green-400' : 'text-red-400'}`}>
          {isAltcoinSeason ? 'YES' : 'NO'}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Bitcoin Dominance: {btcDominance.toFixed(2)}%
        </p>
        <p className="text-xs text-gray-500 mt-1">
          (Simplified: Altcoin Season if BTC Dominance &lt; 50%)
        </p>
      </div>
    </div>
  );
};

export default AltcoinSeasonIndicator;
