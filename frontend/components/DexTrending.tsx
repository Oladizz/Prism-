import React, { useState, useEffect } from 'react';
import { getCgTrending } from '../services/api';
import Skeleton from './Skeleton';
import { Link } from 'react-router-dom';

const DexTrending: React.FC = () => {
    const [trendingTokens, setTrendingTokens] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const tokens = await getCgTrending();
                setTrendingTokens(tokens);
            } catch (error) {
                console.error('Error fetching trending tokens:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrending();
    }, []);

    if (isLoading) {
        return <Skeleton className="h-[268px] rounded-3xl" />;
    }

    if (trendingTokens.length === 0) {
        return null; // Don't render if there are no trending tokens
    }

    return (
        <div className="bg-card border border-border p-6 rounded-3xl backdrop-blur-lg">
            <h3 className="text-xl font-bold text-white mb-4">Trending on CoinGecko</h3>
            <div className="space-y-3">
                {trendingTokens.slice(0, 5).map((token, index) => {
                    return (
                        <div key={token.item.id} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-400">{index + 1}</span>
                                <img src={token.item.small} alt={token.item.name} className="w-6 h-6" />
                                <Link to={`/markets/coin/${token.item.id}`} className="text-sm text-white font-semibold hover:text-accent">{token.item.name}</Link>
                                <span className="text-sm text-gray-400">{token.item.symbol}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DexTrending;
