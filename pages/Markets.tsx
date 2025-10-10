import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header.tsx';
import { ASSETS, NFTS } from '../constants.ts';
import { AreaChart, Area, LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import Skeleton from '../components/Skeleton.tsx';
import { Asset, Nft } from '../types.ts';
import { GridIcon, ListIcon, SortIcon, GaugeIcon } from '../components/icons/DetailIcons.tsx';
import { Link } from 'react-router-dom';

const generateMarketData = () => {
    let value = 2.5; // in Trillions
    return Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        value *= (1 + (Math.random() - 0.48) * 0.05);
        return { name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: parseFloat(value.toFixed(2)) };
    });
};

const formatCurrency = (value: number, decimals = 2) => {
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

const FearGreedIndex: React.FC<{isLoading: boolean}> = ({ isLoading }) => {
    const [value, setValue] = useState(0);
    const [label, setLabel] = useState("Extreme Fear");

    useEffect(() => {
        if (!isLoading) {
            const finalValue = 72; // Mock data
            setValue(finalValue);
            if (finalValue > 75) setLabel("Extreme Greed");
            else if (finalValue > 55) setLabel("Greed");
            else if (finalValue > 45) setLabel("Neutral");
            else if (finalValue > 25) setLabel("Fear");
            else setLabel("Extreme Fear");
        }
    }, [isLoading]);

    const rotation = (value / 100) * 180 - 90;

    if (isLoading) return <Skeleton className="h-[218px] rounded-3xl" />;
    return (
        <div className="bg-card border border-border p-6 rounded-3xl backdrop-blur-lg flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold text-white">Fear & Greed Index</h3>
                <p className="text-sm text-gray-400">Market Sentiment</p>
            </div>
            <div className="relative aspect-video flex items-end justify-center -mb-4">
                <div className="absolute top-0 w-full h-1/2 overflow-hidden">
                    <div className="w-full h-[200%] border-[25px] border-gray-700 rounded-full border-t-green-500 border-l-red-500 border-r-green-500 transform -rotate-45"
                         style={{ borderColor: 'transparent', borderImage: 'conic-gradient(from -45deg, red, yellow, limegreen) 1' }}/>
                </div>
                <div className="relative z-10 w-2 h-2 rounded-full bg-white mb-[-4px]">
                    <div className="absolute bottom-0 left-1/2 w-px h-16 bg-white origin-bottom transition-transform duration-1000 ease-out" style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}>
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full border-2 border-background" />
                    </div>
                </div>
            </div>
             <div className="text-center z-10">
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="font-semibold" style={{color: `hsl(${(value/100)*120}, 100%, 50%)`}}>{label}</p>
            </div>
        </div>
    );
};

const MarketMovers: React.FC<{isLoading: boolean}> = ({ isLoading }) => {
    const movers = useMemo(() => {
        const sorted = [...ASSETS].sort((a,b) => a.change24h - b.change24h);
        return {
            losers: sorted.slice(0, 3),
            gainers: sorted.slice(-3).reverse()
        }
    }, []);

    if (isLoading) return <Skeleton className="h-[218px] rounded-3xl" />;
    return (
         <div className="bg-card border border-border p-6 rounded-3xl backdrop-blur-lg">
            <h3 className="text-xl font-bold text-white mb-4">Market Movers</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2">Top Gainers</h4>
                    <div className="space-y-3">
                        {movers.gainers.map(asset => {
                            const Icon = asset.icon;
                            return <div key={asset.id} className="flex justify-between items-center"><div className="flex items-center gap-2"><Icon className="w-6 h-6"/><span className="text-sm text-white">{asset.ticker}</span></div><span className="text-sm font-mono text-green-400">+{asset.change24h.toFixed(2)}%</span></div>
                        })}
                    </div>
                </div>
                <div className="border-t border-border"></div>
                <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-2">Top Losers</h4>
                     <div className="space-y-3">
                        {movers.losers.map(asset => {
                            const Icon = asset.icon;
                            return <div key={asset.id} className="flex justify-between items-center"><div className="flex items-center gap-2"><Icon className="w-6 h-6"/><span className="text-sm text-white">{asset.ticker}</span></div><span className="text-sm font-mono text-red-400">{asset.change24h.toFixed(2)}%</span></div>
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TrendingNfts: React.FC<{isLoading: boolean}> = ({ isLoading }) => {
    const [selectedChain, setSelectedChain] = useState('All');
    const chains = ['All', 'Ethereum', 'Solana', 'Polygon']; // Mock chains

    const nfts = useMemo(() => {
        // In a real app, this would filter based on chain data
        return NFTS.slice(0, 8);
    }, [selectedChain]);

    if(isLoading) return <Skeleton className="h-[268px] rounded-3xl" />;

    return (
        <div className="bg-card border border-border p-6 rounded-3xl backdrop-blur-lg">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                 <h3 className="text-xl font-bold text-white">Trending NFTs</h3>
                 <div className="flex items-center bg-secondary p-1 rounded-xl">{chains.map(chain => (
                    <button key={chain} onClick={() => setSelectedChain(chain)} className={`px-3 py-1 text-sm font-semibold rounded-lg transition-colors ${selectedChain === chain ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'}`}>{chain}</button>
                ))}</div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6" style={{ scrollbarWidth: 'none' }}>
                {nfts.map(nft => (
                    <div key={nft.id} className="flex-shrink-0 w-40 bg-secondary rounded-xl overflow-hidden group hover-glow">
                        <img src={nft.imageUrl} alt={nft.name} className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="p-2"><p className="text-xs text-accent font-semibold truncate">{nft.collection}</p><p className="text-sm font-bold text-white mt-0.5 truncate">{nft.name}</p></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

type SortKeys = 'name' | 'price' | 'change24h' | 'marketCap' | 'volume24h';
type SortDirection = 'asc' | 'desc';
interface SortConfig { key: SortKeys; direction: SortDirection; }

const Markets: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [marketData, setMarketData] = useState<any[]>([]);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'marketCap', direction: 'desc' });

    const marketCapRanks = useMemo(() => new Map([...ASSETS].sort((a, b) => b.marketCap - a.marketCap).map((asset, index) => [asset.id, index + 1])), []);

    useEffect(() => {
        const timer = setTimeout(() => { setMarketData(generateMarketData()); setIsLoading(false); }, 1000);
        return () => clearTimeout(timer);
    }, []);
    
    const sortedAssets = useMemo(() => [...ASSETS].sort((a, b) => {
        if (sortConfig.key === 'name') return sortConfig.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        return sortConfig.direction === 'asc' ? a[sortConfig.key] - b[sortConfig.key] : b[sortConfig.key] - a[sortConfig.key];
    }), [sortConfig]);

    const handleSort = (key: SortKeys) => setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc' }));

    return (
        <div className="space-y-6">
            <Header title="Markets" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card p-6 rounded-3xl border border-border card-glow backdrop-blur-lg">
                    <h2 className="text-xl font-bold mb-1 text-white">Total Crypto Market Cap</h2>
                    <p className="text-gray-400 text-sm mb-4">Last 30 days</p>
                    <div className="h-64">{isLoading ? <Skeleton className="w-full h-full" /> : (<ResponsiveContainer><AreaChart data={marketData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}><defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#9F00FF" stopOpacity={0.8}/><stop offset="95%" stopColor="#9F00FF" stopOpacity={0}/></linearGradient></defs><Tooltip contentStyle={{ backgroundColor: 'rgba(26, 26, 26, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', backdropFilter: 'blur(10px)' }} labelStyle={{ color: '#d1d5db' }} formatter={(value) => [`$${Number(value).toLocaleString()} Trillion`, 'Market Cap']}/><Area type="monotone" dataKey="value" stroke="#9F00FF" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" /></AreaChart></ResponsiveContainer>)}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                    <FearGreedIndex isLoading={isLoading} />
                    <MarketMovers isLoading={isLoading} />
                </div>
            </div>
            
            <TrendingNfts isLoading={isLoading} />

            <div className="bg-card p-6 rounded-3xl border border-border card-glow backdrop-blur-lg">
                <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-white">All Cryptocurrencies</h2><div className="flex items-center gap-1 bg-secondary p-1 rounded-xl"><button onClick={() => setView('grid')} className={`p-1.5 rounded-lg ${view === 'grid' ? 'bg-accent' : 'hover:bg-card'}`} aria-label="Grid View"><GridIcon className="w-5 h-5" /></button><button onClick={() => setView('list')} className={`p-1.5 rounded-lg ${view === 'list' ? 'bg-accent' : 'hover:bg-card'}`} aria-label="List View"><ListIcon className="w-5 h-5" /></button></div></div>
                {isLoading ? (view === 'grid' ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({length: 10}).map((_, i) => <Skeleton key={i} className="h-[108px] rounded-2xl" />)}</div> : <div className="overflow-x-auto">{Array.from({length: 10}).map((_, i) => <Skeleton key={i} className="h-16 w-full my-1"/>)}</div>) : view === 'grid' ? (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{sortedAssets.map(asset => {const Icon = asset.icon; const isPositive = asset.change24h >= 0; return (<div key={asset.id} className="bg-secondary p-4 rounded-2xl border border-border hover-glow"><div className="flex items-center gap-3 mb-3"><Icon className="w-8 h-8" /><div><p className="font-bold text-white">{asset.name}</p><p className="text-sm text-gray-400">{asset.ticker}</p></div></div><div className="flex justify-between items-center"><p className="font-mono font-semibold text-white">{formatCurrency(asset.price)}</p><p className={`text-sm font-mono font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>{isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%</p></div></div>)})}</div>) : (<div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-black/20"><tr><th className="p-4 font-semibold text-gray-300">#</th><SortableHeader label="Name" sortKey="name" sortConfig={sortConfig} onSort={handleSort} /><SortableHeader label="Price" sortKey="price" sortConfig={sortConfig} onSort={handleSort} className="text-right" /><SortableHeader label="24h %" sortKey="change24h" sortConfig={sortConfig} onSort={handleSort} className="text-right"/><SortableHeader label="Market Cap" sortKey="marketCap" sortConfig={sortConfig} onSort={handleSort} className="text-right"/><SortableHeader label="Volume (24h)" sortKey="volume24h" sortConfig={sortConfig} onSort={handleSort} className="text-right"/><th className="p-4 font-semibold text-gray-300 text-right">Last 7 Days</th></tr></thead><tbody>{sortedAssets.map(asset => {const Icon = asset.icon; const isPositive = asset.change24h >= 0; const assetRank = marketCapRanks.get(asset.id); return (<tr key={asset.id} className="border-b border-border last:border-0 hover:bg-black/20"><td className="p-4 text-gray-400">{assetRank}</td><td className="p-4"><div className="flex items-center gap-4 group"><Icon className="w-8 h-8" /><div><p className="font-semibold text-white">{asset.name}</p><p className="text-sm text-gray-400">{asset.ticker}</p></div></div></td><td className="p-4 font-mono text-white text-right">{formatCurrency(asset.price)}</td><td className={`p-4 font-mono text-right ${isPositive ? 'text-green-400' : 'text-red-400'}`}>{isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%</td><td className="p-4 font-mono text-white text-right">{formatCurrency(asset.marketCap, 0)}</td><td className="p-4 font-mono text-white text-right">{formatCurrency(asset.volume24h, 0)}</td><td className="p-4"><div className="w-24 h-10 ml-auto"><ResponsiveContainer><LineChart data={asset.sparklineData}><Line type="monotone" dataKey="value" stroke={isPositive ? '#22c55e' : '#ef4444'} strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></td></tr>)})}</tbody></table></div>)}
            </div>
        </div>
    );
};

const SortableHeader: React.FC<{label: string; sortKey: SortKeys; sortConfig: SortConfig; onSort: (key: SortKeys) => void; className?: string;}> = ({ label, sortKey, sortConfig, onSort, className = '' }) => (<th className={`p-4 font-semibold text-gray-300 cursor-pointer hover:bg-black/20 transition-colors ${className}`} onClick={() => onSort(sortKey)}><div className="flex items-center gap-2 justify-end"><span className={sortConfig.key === sortKey ? '' : 'text-gray-500'}>{label}</span>{sortConfig.key === sortKey ? <SortIcon className={`w-4 h-4 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} /> : <SortIcon className="w-4 h-4 text-gray-600" />}</div></th>);

export default Markets;