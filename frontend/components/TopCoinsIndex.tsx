import React from 'react';
import Skeleton from './Skeleton';
import { Link } from 'react-router-dom';

interface TopCoinsIndexProps {
  isLoading: boolean;
  allAssets: any[];
}

const TopCoinsIndex: React.FC<TopCoinsIndexProps> = ({ isLoading, allAssets }) => {
  if (isLoading) {
    return <Skeleton className="h-[218px] rounded-3xl" />;
  }

  const topCoins = allAssets.slice(0, 5);

  return (
    <div className="bg-card border border-border p-6 rounded-3xl backdrop-blur-lg">
      <h3 className="text-xl font-bold text-white mb-4">Top 5 by Market Cap</h3>
      <div className="space-y-3">
        {topCoins.map((token, index) => {
            const isPositive = token.price_change_percentage_24h >= 0;
            return (
                <div key={token.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">{index + 1}</span>
                        <img src={token.image} alt={token.name} className="w-6 h-6" />
                        <Link to={`/markets/coin/${token.id}`} className="text-sm text-white font-semibold hover:text-accent">{token.name}</Link>
                        <span className="text-sm text-gray-400">{token.symbol}</span>
                    </div>
                    <span className={`text-sm font-mono ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}{token.price_change_percentage_24h.toFixed(2)}%
                    </span>
                </div>
            );
        })}
      </div>
       <p className="text-xs text-gray-500 mt-4">Data from CoinGecko</p>
    </div>
  );
};

export default TopCoinsIndex;