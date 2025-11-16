import React, { useState, useEffect } from 'react';
import Skeleton from './Skeleton';

const EthGasFee: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const [gasPrice, setGasPrice] = useState<any>(null);
  const [gasLoading, setGasLoading] = useState(true);
  const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

  useEffect(() => {
    const fetchGasPrice = async () => {
      if (isLoading || !ETHERSCAN_API_KEY) {
        if (!ETHERSCAN_API_KEY) {
          console.warn('Etherscan API key is not set. Skipping fetch for ETH Gas Price.');
        }
        setGasLoading(false);
        return;
      }
      try {
        const response = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`);
        const data = await response.json();
        if (data.status === '1' && data.result) {
          setGasPrice(data.result);
        } else {
          console.error('Error fetching ETH Gas Price:', data.message);
        }
      } catch (error) {
        console.error('Error fetching ETH Gas Price:', error);
      } finally {
        setGasLoading(false);
      }
    };
    fetchGasPrice();
  }, [isLoading, ETHERSCAN_API_KEY]);

  if (isLoading || gasLoading) {
    return <Skeleton className="h-[120px] rounded-3xl" />;
  }

  if (!ETHERSCAN_API_KEY) {
    return (
      <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-lg">
        <h3 className="text-xl font-bold text-white mb-4">ETH Gas Price</h3>
        <p className="text-gray-400">Etherscan API key is not configured. Please set `VITE_ETHERSCAN_API_KEY` in your `.env` file to enable this feature.</p>
      </div>
    );
  }

  if (!gasPrice) {
    return (
      <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-lg">
        <h3 className="text-xl font-bold text-white mb-4">ETH Gas Price</h3>
        <p className="text-gray-400">ETH Gas Price data could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-lg">
      <h3 className="text-xl font-bold text-white mb-4">ETH Gas Price</h3>
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between">
          <p className="text-gray-400">SafeLow:</p>
          <p className="font-bold text-white">{gasPrice.SafeGasPrice} Gwei</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-400">Propose:</p>
          <p className="font-bold text-white">{gasPrice.ProposeGasPrice} Gwei</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-400">Fast:</p>
          <p className="font-bold text-white">{gasPrice.FastGasPrice} Gwei</p>
        </div>
      </div>
    </div>
  );
};

export default EthGasFee;
