import React, { useState, useEffect } from 'react';
import { getCgCoinsMarkets } from '../services/api';
import Skeleton from './Skeleton';
import { Link } from 'react-router-dom';

const formatCurrency = (value: number, decimals = 2) => {
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

const CoinListings: React.FC = () => {
    const [listings, setListings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const data = await getCgCoinsMarkets();
                setListings(data);
            } catch (error) {
                console.error('Error fetching listings:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchListings();
    }, []);

    if (isLoading) {
        return <div className="overflow-x-auto">{Array.from({length: 10}).map((_, i) => <Skeleton key={i} className="h-16 w-full my-1"/>)}</div>;
    }

    if (listings.length === 0) {
        return null; // Don't render if there are no listings
    }

    return (
        <div className="bg-card p-6 rounded-3xl border border-border card-glow backdrop-blur-lg">
            <h2 className="text-xl font-bold text-white mb-4">Top Cryptocurrencies by Market Cap (CoinGecko)</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-black/20">
                        <tr>
                            <th className="p-4 font-semibold text-gray-300">#</th>
                            <th className="p-4 font-semibold text-gray-300">Name</th>
                            <th className="p-4 font-semibold text-gray-300 text-right">Price</th>
                            <th className="p-4 font-semibold text-gray-300 text-right">24h %</th>
                            <th className="p-4 font-semibold text-gray-300 text-right">Market Cap</th>
                            <th className="p-4 font-semibold text-gray-300 text-right">Volume (24h)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listings.slice(0, 10).map((token, index) => {
                            const isPositive = token.price_change_percentage_24h >= 0;
                            return (
                                <tr key={token.id} className="border-b border-border/50 hover:bg-secondary/50">
                                    <td className="p-4 text-gray-400">{index + 1}</td>
                                    <td className="p-4">
                                        <Link to={`/markets/coin/${token.id}`} className="flex items-center gap-3">
                                            <img src={token.image} alt={token.name} className="w-6 h-6" />
                                            <div>
                                                <p className="font-bold text-white">{token.name}</p>
                                                <p className="text-sm text-gray-400">{token.symbol.toUpperCase()}</p>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="p-4 text-right font-mono text-white">{formatCurrency(token.current_price)}</td>
                                    <td className={`p-4 text-right font-mono ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                        {isPositive ? '+' : ''}{token.price_change_percentage_24h.toFixed(2)}%
                                    </td>
                                    <td className="p-4 text-right font-mono text-white">{formatCurrency(token.market_cap)}</td>
                                    <td className="p-4 text-right font-mono text-white">{formatCurrency(token.total_volume)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CoinListings;