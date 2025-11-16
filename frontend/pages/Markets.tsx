import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header.tsx';
import { AreaChart, Area, LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import Skeleton from '../components/Skeleton.tsx';
import { Asset } from '../types.ts';
import { GridIcon, ListIcon, SortIcon } from '../components/icons/DetailIcons.tsx';
import { Link } from 'react-router-dom';
import MarketStats from '../components/MarketStats.tsx';
import EthGasFee from '../components/EthGasFee.tsx';
import CryptoTreasuries from '../components/CryptoTreasuries.tsx';
import AltcoinSeasonIndicator from '../components/AltcoinSeasonIndicator.tsx';
import EtfNetFlows from '../components/EtfNetFlows.tsx';
import MarketSentiment from '../components/MarketSentiment.tsx';
import TopCoinsIndex from '../components/TopCoinsIndex.tsx';
import DerivativesMetrics from '../components/DerivativesMetrics.tsx';
import CoinListings from '../components/CoinListings.tsx';
import { getCmcGlobalMetrics, getCmcGlobalMetricsHistory, getCgCoinsMarkets, getCgGlobal } from '../services/api';

const formatCurrency = (value: number, decimals = 2) => {
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

const FearGreedIndex: React.FC<{isLoading: boolean}> = ({ isLoading }) => {
    const [fearGreedData, setFearGreedData] = useState<{ value: string; value_classification: string; timestamp: string; } | null>(null);
    const [fgLoading, setFgLoading] = useState(true);

    useEffect(() => {
        const fetchFearGreedIndex = async () => {
            try {
                const response = await fetch('https://api.alternative.me/fng/');
                const data = await response.json();
                if (data && data.data && data.data.length > 0) {
                    setFearGreedData(data.data[0]);
                }
            } catch (error) {
                console.error('Error fetching Fear & Greed Index:', error);
            } finally {
                setFgLoading(false);
            }
        };
        fetchFearGreedIndex();
    }, []);

    if (isLoading || fgLoading) return <Skeleton className="h-[218px] rounded-3xl" />;

    if (!fearGreedData) {
        return (
            <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-lg">
                <h3 className="text-xl font-bold text-white mb-4">Fear & Greed Index</h3>
                <p className="text-gray-400">Fear & Greed Index data could not be loaded.</p>
            </div>
        );
    }

    const value = parseInt(fearGreedData.value);
    let barColorClass = 'bg-gray-400';
    if (value <= 25) barColorClass = 'bg-red-500'; // Extreme Fear
    else if (value <= 49) barColorClass = 'bg-orange-400'; // Fear
    else if (value <= 50) barColorClass = 'bg-yellow-400'; // Neutral
    else if (value <= 75) barColorClass = 'bg-green-400'; // Greed
    else barColorClass = 'bg-green-500'; // Extreme Greed

    return (
        <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-lg">
            <h3 className="text-xl font-bold text-white mb-4">Fear & Greed Index</h3>
            <div className="flex flex-col items-center justify-center h-40">
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className={`${barColorClass} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
                </div>
                <p className={`text-4xl font-bold mt-4`}>{fearGreedData.value}</p>
                <p className="text-sm text-gray-400">{fearGreedData.value_classification}</p>
            </div>
        </div>
    );
};

const MarketMovers: React.FC<{isLoading: boolean; allAssets: any[]}> = ({ isLoading, allAssets }) => {
    const movers = useMemo(() => {
        if (allAssets.length === 0) return { losers: [], gainers: [] };
        const sorted = [...allAssets].sort((a,b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
        return {
            losers: sorted.slice(0, 3),
            gainers: sorted.slice(-3).reverse()
        }
    }, [allAssets]);

    if (isLoading) return <Skeleton className="h-[218px] rounded-3xl" />;
    return (
         <div className="bg-card border border-border p-6 rounded-3xl backdrop-blur-lg">
            <h3 className="text-xl font-bold text-white mb-4">Market Movers</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2">Top Gainers</h4>
                    <div className="space-y-3">
                        {movers.gainers.map(asset => {
                            return <div key={asset.id} className="flex justify-between items-center"><div className="flex items-center gap-2"><img src={asset.image} className="w-6 h-6"/><span className="text-sm text-white">{asset.symbol.toUpperCase()}</span></div><span className="text-sm font-mono text-green-400">+{asset.price_change_percentage_24h.toFixed(2)}%</span></div>
                        })}
                    </div>
                </div>
                <div className="border-t border-border"></div>
                <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-2">Top Losers</h4>
                     <div className="space-y-3">
                        {movers.losers.map(asset => {
                            return <div key={asset.id} className="flex justify-between items-center"><div className="flex items-center gap-2"><img src={asset.image} className="w-6 h-6"/><span className="text-sm text-white">{asset.symbol.toUpperCase()}</span></div><span className="text-sm font-mono text-red-400">{asset.price_change_percentage_24h.toFixed(2)}%</span></div>
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TrendingNfts: React.FC<{isLoading: boolean;}> = ({ isLoading }) => {
    const [trendingNfts, setTrendingNfts] = useState<any[]>([]);
    const OPENSEA_API_KEY = import.meta.env.VITE_OPENSEA_API_KEY;

    useEffect(() => {
        const fetchTrendingNfts = async () => {
            if (isLoading || !OPENSEA_API_KEY) {
                if (!OPENSEA_API_KEY) {
                    console.warn('OpenSea API key is not set. Skipping fetch for trending NFTs.');
                    setTrendingNfts([]);
                }
                return;
            }
            try {
                const response = await fetch('https://api.opensea.io/api/v2/collections?order_by=total_volume&limit=8', {
                    headers: {
                        'X-API-KEY': OPENSEA_API_KEY,
                    },
                });
                const data = await response.json();
                console.log('Markets: OpenSea collections response:', data);
                
                if (data.errors) {
                    console.error('OpenSea API errors:', data.errors);
                    setTrendingNfts([]);
                    return;
                }

                const nfts = [];
                // Ensure data.collections is an array before iterating
                if (Array.isArray(data.collections)) {
                    for (const collection of data.collections) {
                        const assetsResponse = await fetch(`https://api.opensea.io/api/v2/assets?collection_slug=${collection.slug}&limit=1`, {
                            headers: {
                                'X-API-KEY': OPENSEA_API_KEY,
                            },
                        });
                        const assetsData = await assetsResponse.json();
                        console.log(`Markets: OpenSea assets response for collection ${collection.slug}:`, assetsData);
                        if (assetsData.assets && assetsData.assets.length > 0) {
                            nfts.push({
                                id: assetsData.assets[0].id,
                                name: assetsData.assets[0].name,
                                imageUrl: assetsData.assets[0].image_url,
                                collection: collection.name,
                            });
                        } else {
                            console.warn(`Markets: No assets found for collection ${collection.slug} or assetsData.assets is empty.`);
                        }
                    }
                }
                setTrendingNfts(nfts);
            } catch (error) {
                console.error("Failed to fetch trending NFTs:", error);
            }
        };
        fetchTrendingNfts();
    }, [isLoading, OPENSEA_API_KEY]);

    if(isLoading) return <Skeleton className="h-[268px] rounded-3xl" />;

    if (!OPENSEA_API_KEY) {
        return (
            <div className="bg-card border border-border p-6 rounded-3xl backdrop-blur-lg">
                <h3 className="text-xl font-bold text-white mb-4">Trending NFTs</h3>
                <p className="text-gray-400">OpenSea API key is not configured. Please set `VITE_OPENSEA_API_KEY` in your `.env` file to enable this feature.</p>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border p-6 rounded-3xl backdrop-blur-lg">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                 <h3 className="text-xl font-bold text-white">Trending NFTs</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6" style={{ scrollbarWidth: 'none' }}>
                {trendingNfts.map(nft => (
                    <div key={nft.id} className="flex-shrink-0 w-40 bg-secondary rounded-xl overflow-hidden group hover-glow">
                        <img src={nft.imageUrl} alt={nft.name} className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="p-2"><p className="text-xs text-accent font-semibold truncate">{nft.collection}</p><p className="text-sm font-bold text-white mt-0.5 truncate">{nft.name}</p></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

type SortKeys = 'name' | 'price' | 'percent_change_24h' | 'market_cap' | 'volume_24h';
type SortDirection = 'asc' | 'desc';
interface SortConfig { key: SortKeys; direction: SortDirection; }

const Markets: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [marketData, setMarketData] = useState<any[]>([]);
    const [globalMetrics, setGlobalMetrics] = useState<any>(null);
    const [allAssets, setAllAssets] = useState<any[]>([]);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'market_cap', direction: 'desc' });
    const [displayLimit, setDisplayLimit] = useState(10);

    const btcDominance = globalMetrics?.btc_dominance || null;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch global metrics from CoinGecko
                const metrics = await getCgGlobal();
                setGlobalMetrics(metrics);

                // Fetch historical global metrics from CoinGecko
                // This is a placeholder as coingecko's free tier doesn't provide easy historical global data
                // For now, we will simulate it with a flat line
                if (metrics) {
                    const marketDataPoints = Array.from({length: 30}, (_, i) => ({
                        name: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        value: parseFloat((metrics.total_market_cap.usd / 1_000_000_000_000).toFixed(2)),
                    }));
                    setMarketData(marketDataPoints);
                } else {
                    setMarketData([]);
                }

                // Fetch assets from CoinGecko
                const assets = await getCgCoinsMarkets();
                setAllAssets(assets || []);

            } catch (error) {
                console.error("Failed to fetch market data:", error);
                setAllAssets([]);
                setMarketData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);
    
    const sortedAssets = useMemo(() => [...allAssets].sort((a, b) => {
        if (sortConfig.key === 'name') {
            return sortConfig.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        const aVal = a[sortConfig.key] || 0;
        const bVal = b[sortConfig.key] || 0;
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    }), [allAssets, sortConfig]);

    const handleSort = (key: SortKeys) => setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc' }));

    return (
        <div className="space-y-6">
            <Header title="Markets" />
            <MarketStats data={globalMetrics} isLoading={isLoading} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card p-6 rounded-3xl border border-border card-glow backdrop-blur-lg">
                    <h2 className="text-xl font-bold mb-1 text-white">Total Crypto Market Cap</h2>
                    <p className="text-gray-400 text-sm mb-4">Last 30 days</p>
                    <div className="h-64">{isLoading ? <Skeleton className="w-full h-full" /> : (<ResponsiveContainer><AreaChart data={marketData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}><defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#9F00FF" stopOpacity={0.8}/><stop offset="95%" stopColor="#9F00FF" stopOpacity={0}/></linearGradient></defs><Tooltip contentStyle={{ backgroundColor: 'rgba(26, 26, 26, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', backdropFilter: 'blur(10px)' }} labelStyle={{ color: '#d1d5db' }} formatter={(value) => [`$${Number(value).toLocaleString()} Trillion`, 'Market Cap']}/><Area type="monotone" dataKey="value" stroke="#9F00FF" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" /></AreaChart></ResponsiveContainer>)}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                    <EthGasFee isLoading={isLoading} />
                    <CryptoTreasuries isLoading={isLoading} />
                    <AltcoinSeasonIndicator btcDominance={btcDominance} isLoading={isLoading} />
                    <EtfNetFlows isLoading={isLoading} />
                    <MarketSentiment isLoading={isLoading} />
                    <TopCoinsIndex isLoading={isLoading} allAssets={allAssets} />
                    <DerivativesMetrics isLoading={isLoading} />
                    <FearGreedIndex isLoading={isLoading} />
                    <MarketMovers isLoading={isLoading} allAssets={allAssets} />
                </div>
            </div>
            
            <TrendingNfts isLoading={isLoading} />

            <CoinListings />
        </div>
    );
};

const SortableHeader: React.FC<{label: string; sortKey: SortKeys; sortConfig: SortConfig; onSort: (key: SortKeys) => void; className?: string;}> = ({ label, sortKey, sortConfig, onSort, className = '' }) => (<th className={`p-4 font-semibold text-gray-300 cursor-pointer hover:bg-black/20 transition-colors ${className}`} onClick={() => onSort(sortKey)}><div className="flex items-center gap-2 justify-end"><span className={sortConfig.key === sortKey ? '' : 'text-gray-500'}>{label}</span>{sortConfig.key === sortKey ? <SortIcon className={`w-4 h-4 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} /> : <SortIcon className="w-4 h-4 text-gray-600" />}</div></th>);

export default Markets;