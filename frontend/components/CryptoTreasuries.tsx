import React, { useState, useEffect } from 'react';
import Skeleton from './Skeleton';
import { getCgTreasury } from '../services/api';

interface CryptoTreasuriesProps {
  isLoading: boolean;
}

const CryptoTreasuries: React.FC<CryptoTreasuriesProps> = ({ isLoading }) => {
  const [treasuryData, setTreasuryData] = useState<any>(null);
  const [treasuryLoading, setTreasuryLoading] = useState(true);

  useEffect(() => {
    const fetchTreasuryData = async () => {
      if (isLoading) {
        setTreasuryLoading(false);
        return;
      }
      try {
        // Fetch Bitcoin and Ethereum Treasuries from CoinGecko
        const [btcData, ethData] = await Promise.all([
          getCgTreasury('bitcoin'),
          getCgTreasury('ethereum')
        ]);

        if (btcData || ethData) {
          setTreasuryData({
            bitcoin: btcData,
            ethereum: ethData,
          });
        } else {
          console.error('Error fetching Crypto Treasury data from CoinGecko');
        }
      } catch (error) {
        console.error('Error fetching Crypto Treasury data:', error);
      } finally {
        setTreasuryLoading(false);
      }
    };
    fetchTreasuryData();
  }, [isLoading]);

  if (isLoading || treasuryLoading) {
    return <Skeleton className="h-[200px] rounded-3xl" />;
  }

  if (!treasuryData || (!treasuryData.bitcoin && !treasuryData.ethereum)) {
    return (
      <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-lg">
        <h3 className="text-xl font-bold text-white mb-4">Crypto Treasuries</h3>
        <p className="text-gray-400">Crypto Treasury data could not be loaded from CoinGecko.</p>
      </div>
    );
  }

  const formatNumber = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 0 });

  return (
    <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-lg">
      <h3 className="text-xl font-bold text-white mb-4">Public Company Treasuries</h3>
      {treasuryData.bitcoin && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-white mb-2">Bitcoin</h4>
          <p className="text-gray-400">Total BTC held: <span className="text-white font-bold">{formatNumber(treasuryData.bitcoin.total_holdings)} BTC</span></p>
          <p className="text-gray-400">Total USD value: <span className="text-white font-bold">${formatNumber(treasuryData.bitcoin.total_value_usd)}</span></p>
          <p className="text-gray-400">Number of companies: <span className="text-white font-bold">{treasuryData.bitcoin.companies.length}</span></p>
        </div>
      )}
       {treasuryData.ethereum && (
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">Ethereum</h4>
          <p className="text-gray-400">Total ETH held: <span className="text-white font-bold">{formatNumber(treasuryData.ethereum.total_holdings)} ETH</span></p>
          <p className="text-gray-400">Total USD value: <span className="text-white font-bold">${formatNumber(treasuryData.ethereum.total_value_usd)}</span></p>
          <p className="text-gray-400">Number of companies: <span className="text-white font-bold">{treasuryData.ethereum.companies.length}</span></p>
        </div>
      )}
      <p className="text-xs text-gray-500 mt-4">Data from CoinGecko</p>
    </div>
  );
};

export default CryptoTreasuries;
