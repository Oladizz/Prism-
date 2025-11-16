import React from 'react';
import Skeleton from './Skeleton';

interface MarketStatsProps {
  data: any; // The data from getCmcGlobalMetrics
  isLoading: boolean;
}

const formatNumber = (value: number, decimals = 2) => {
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(decimals)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(decimals)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(decimals)}M`;
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

const MarketStats: React.FC<MarketStatsProps> = ({ data, isLoading }) => {
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  const {
    btc: btc_dominance,
    eth: eth_dominance,
  } = data.market_cap_percentage;

  const {
    active_cryptocurrencies,
    total_market_cap,
    total_volume,
  } = data;

  const stats = [
    { label: 'Market Cap', value: formatNumber(total_market_cap.usd) },
    { label: 'Volume (24h)', value: formatNumber(total_volume.usd) },
    { label: 'BTC Dominance', value: `${btc_dominance.toFixed(2)}%` },
    { label: 'ETH Dominance', value: `${eth_dominance.toFixed(2)}%` },
    { label: 'Cryptocurrencies', value: active_cryptocurrencies.toLocaleString() },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-2xl p-4">
          <p className="text-sm text-gray-400">{stat.label}</p>
          <p className="text-lg font-bold text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default MarketStats;
