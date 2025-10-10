import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TRANSACTIONS, PORTFOLIO_HISTORY, GAS_FEES } from '../constants.ts';
import { AnalyzeTokenIcon, GasFeeIcon } from '../components/icons/ActionIcons.tsx';
import Modal from '../components/Modal.tsx';
import { useToast } from '../hooks/useToast.ts';
import Skeleton from '../components/Skeleton.tsx';
import { Asset, Transaction, PortfolioHistory } from '../types.ts';
import { usePortfolio } from '../contexts/PortfolioContext.tsx';

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-');

const DashboardActionCard: React.FC<{ icon: React.ReactNode; title: string; value?: string; subtitle?: string; onClick: () => void; }> = ({ icon, title, value, subtitle, onClick }) => (
    <button onClick={onClick} className="flex items-center justify-between gap-4 p-4 bg-card border border-border rounded-3xl hover:bg-secondary hover:border-gray-600 transition-colors duration-200 text-left w-full backdrop-blur-lg">
        <div>
            <span className="font-semibold text-white">{title}</span>
            {value ? (
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
            ) : (
                <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
            )}
        </div>
        <div className="w-10 h-10 text-accent flex-shrink-0 bg-secondary rounded-full flex items-center justify-center p-2">{icon}</div>
    </button>
);

const TimeRangeSelector: React.FC<{ selected: string; onSelect: (range: string) => void }> = ({ selected, onSelect }) => {
    const ranges = ['1D', '7D', '1M', '1Y', 'ALL'];
    return (
        <div className="flex items-center bg-secondary p-1 rounded-xl">
            {ranges.map(range => (
                <button
                    key={range}
                    onClick={() => onSelect(range)}
                    className={`px-3 py-1 text-sm font-semibold rounded-lg transition-colors ${
                        selected === range ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    {range}
                </button>
            ))}
        </div>
    );
};

const Dashboard: React.FC = () => {
    const [timeRange, setTimeRange] = useState('1M');
    const [isAnalyzeTokenModalOpen, setAnalyzeTokenModalOpen] = useState(false);
    const [isGasTrackerModalOpen, setGasTrackerModalOpen] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [contractAddress, setContractAddress] = useState('');

    const { assets } = usePortfolio();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<{ assets: Asset[], transactions: Transaction[], portfolioHistory: PortfolioHistory[] }>({ assets: [], transactions: [], portfolioHistory: []});
    const { addToast } = useToast();

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setData({
                assets,
                transactions: TRANSACTIONS,
                portfolioHistory: PORTFOLIO_HISTORY,
            });
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [assets, addToast]);

    const { totalBalance, portfolioChangeValue, portfolioChange24h, totalGasFees, distributionData, topGainers, topLosers } = useMemo(() => {
        if (isLoading || !data.assets) return { totalBalance: 0, portfolioChangeValue: 0, portfolioChange24h: 0, totalGasFees: 0, distributionData: [], topGainers: [], topLosers: [] };
        
        const total = data.assets.reduce((acc, asset) => acc + asset.balanceUSD, 0);
        const change = 5.2; // Mock data
        const changeValue = total * (change / 100);
        const gas = data.transactions.reduce((acc, tx) => acc + (tx.gasFeeUSD || 0), 0);
        const distData = data.assets.map(asset => ({ name: asset.name, value: asset.balanceUSD })).filter(d => d.value > 0);
        const sortedAssets = [...data.assets].sort((a, b) => b.change24h - a.change24h);
        
        return {
            totalBalance: total,
            portfolioChange24h: change,
            portfolioChangeValue: changeValue,
            totalGasFees: gas,
            distributionData: distData,
            topGainers: sortedAssets.slice(0, 3),
            topLosers: sortedAssets.slice(-3).reverse()
        };
    }, [isLoading, data]);
    
    const handleAnalyzeToken = () => {
        if (!contractAddress) return;
        setIsAnalyzing(true);
        setAnalysisResult(null);
        setTimeout(() => {
            const isSafe = Math.random() > 0.3;
            setAnalysisResult(
                isSafe 
                ? '✅ This contract appears to be safe. Low risk detected.'
                : '⚠️ This contract has potential risks. High-risk functions detected. Proceed with caution.'
            );
            setIsAnalyzing(false);
        }, 1500);
    };
    
    const COLORS = ['#9F00FF', '#00F6FF', '#DA00FF', '#CCCCCC', '#C566FF', '#AAAAAA', '#7F00CC', '#888888'];

    return (
        <>
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, Satoshi!</h1>
                    <div className="hidden sm:block text-right">
                         <p className="text-gray-400 text-sm">Total Portfolio Value</p>
                         {isLoading ? <Skeleton className="h-8 w-48 mt-1" /> : <p className="text-2xl font-bold text-white">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
                    </div>
                </div>

                <div className="bg-card border border-border p-6 rounded-3xl sm:hidden backdrop-blur-lg">
                    <p className="text-gray-400 text-sm">Total Portfolio Value</p>
                    {isLoading ? <Skeleton className="h-10 w-3/4 mt-1" /> : <p className="text-4xl font-bold text-white">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
                    {isLoading ? <Skeleton className="h-5 w-1/2 mt-2" /> : <div className="text-green-400 text-sm font-semibold mt-1">+${portfolioChangeValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} (+{portfolioChange24h}%) today</div>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <DashboardActionCard icon={<AnalyzeTokenIcon />} title="Analyze Token" subtitle="Check contract safety" onClick={() => setAnalyzeTokenModalOpen(true)} />
                    {isLoading ? <Skeleton className="h-[88px] rounded-3xl" /> : <DashboardActionCard icon={<GasFeeIcon />} title="Total Gas Fees Paid" value={`$${totalGasFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} onClick={() => setGasTrackerModalOpen(true)} />}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-card border border-border p-6 rounded-3xl backdrop-blur-lg">
                            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                                 <h3 className="text-xl font-semibold text-white">Portfolio Performance</h3>
                                 <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} />
                            </div>
                            <div style={{ width: '100%', height: 300 }}>
                                {isLoading ? <Skeleton className="h-full w-full rounded-3xl" /> : (
                                <ResponsiveContainer>
                                    <AreaChart data={data.portfolioHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#9F00FF" stopOpacity={0.8}/><stop offset="95%" stopColor="#9F00FF" stopOpacity={0}/></linearGradient></defs>
                                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value)/1000}k`} />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(26, 26, 26, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', backdropFilter: 'blur(10px)' }} labelStyle={{ color: '#d1d5db' }} formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Value']}/>
                                        <Area type="monotone" dataKey="value" stroke="#9F00FF" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-3xl overflow-hidden backdrop-blur-lg">
                            <h3 className="text-xl font-semibold text-white p-6 pb-4">My Assets</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="text-sm text-gray-400"><tr className="border-b border-t border-border bg-black/20"><th className="p-4 font-semibold">Asset</th><th className="p-4 font-semibold">Price</th><th className="p-4 font-semibold">24h Change</th><th className="p-4 font-semibold">Holdings</th><th className="p-4 font-semibold text-right">7d Chart</th></tr></thead>
                                    <tbody>
                                        {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                                            <tr key={i} className="border-b border-border"><td className="p-4"><div className="flex items-center gap-4"><Skeleton className="w-8 h-8 rounded-full" /><div><Skeleton className="h-4 w-20" /><Skeleton className="h-3 w-10 mt-2" /></div></div></td><td className="p-4"><Skeleton className="h-4 w-24" /></td><td className="p-4"><Skeleton className="h-4 w-16" /></td><td className="p-4"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-20 mt-2" /></td><td className="p-4"><div className="flex justify-end"><Skeleton className="h-10 w-24" /></div></td></tr>
                                        )) : data.assets.map(asset => {
                                            const isPositive = asset.change24h >= 0;
                                            const Icon = asset.icon;
                                            return (
                                            <tr key={asset.id} className="border-b border-border last:border-0 hover:bg-black/20">
                                                <td className="p-4"><Link to={`/portfolio/asset/${asset.id}`} className="flex items-center gap-4 group"><div className="flex-shrink-0"><Icon className="w-8 h-8" /></div><div><p className="font-semibold text-white group-hover:text-accent">{asset.name}</p><p className="text-sm text-gray-400">{asset.ticker}</p></div></Link></td>
                                                <td className="p-4 font-mono text-white">${asset.price.toLocaleString()}</td>
                                                <td className={`p-4 font-mono ${isPositive ? 'text-green-400' : 'text-red-400'}`}>{isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%</td>
                                                <td className="p-4"><p className="font-semibold text-white font-mono">${asset.balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p><p className="text-sm text-gray-400 font-mono">{asset.balanceCrypto.toFixed(4)} {asset.ticker}</p></td>
                                                <td className="p-4"><div className="w-24 h-10 ml-auto"><ResponsiveContainer><LineChart data={asset.sparklineData}><Line type="monotone" dataKey="value" stroke={isPositive ? '#22c55e' : '#ef4444'} strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></td>
                                            </tr>
                                        )})}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="bg-card border border-border p-6 rounded-3xl backdrop-blur-lg">
                            <h3 className="text-xl font-semibold text-white mb-4">Portfolio Distribution</h3>
                            {isLoading ? <div className="flex flex-col items-center gap-6"><Skeleton className="w-40 h-40 rounded-full" /><div className="w-full space-y-3"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" /><Skeleton className="h-4 w-3/4" /></div></div> :
                            ( totalBalance > 0 ?
                            <div className="flex flex-col items-center gap-6">
                                <div className="relative w-40 h-40 flex-shrink-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={distributionData} cx="50%" cy="50%" labelLine={false} innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={2} dataKey="value">
                                                {distributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="" />)}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: 'rgba(26, 26, 26, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', backdropFilter: 'blur(10px)' }} formatter={(value) => [`$${Number(value).toLocaleString('en-US')}`, null]}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><p className="text-white text-2xl font-bold">${(totalBalance/1000).toFixed(1)}K</p></div>
                                </div>
                                <div className="w-full flex flex-col gap-3">
                                    {distributionData.map((entry, index) => (
                                        <div key={entry.name} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} /><span className="text-gray-300">{entry.name}</span></div>
                                            <span className="font-semibold text-white font-mono">{((entry.value / totalBalance) * 100).toFixed(1)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            : <div className="text-center py-8 text-gray-400">No assets to display.</div>
                            )}
                        </div>
                        
                        <div className="bg-card border border-border p-6 rounded-3xl backdrop-blur-lg">
                             <div className="flex justify-between items-center mb-2">
                                 <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
                                 <Link to="/transactions" className="text-sm text-accent hover:underline">View All</Link>
                             </div>
                            <div className="flex flex-col divide-y divide-border -mx-6">
                               {isLoading ? Array.from({length: 4}).map((_, i) => <div key={i} className="flex items-center justify-between py-3 px-6"><div className="flex items-center gap-4"><Skeleton className="w-10 h-10 rounded-full"/><div><Skeleton className="h-4 w-20"/><Skeleton className="h-3 w-12 mt-2"/></div></div><div className="text-right"><Skeleton className="h-4 w-24"/><Skeleton className="h-3 w-16 mt-2"/></div></div>) 
                               : data.transactions.slice(0, 4).map(tx => {
                                   const Icon = tx.asset.icon;
                                   return (
                                   <div key={tx.id} className="flex items-center justify-between py-3 px-6">
                                       <div className="flex items-center gap-4"><div className="p-2 bg-secondary rounded-full"><Icon className="w-6 h-6"/></div><div><p className="font-semibold text-white">{tx.asset.name}</p><p className="text-sm text-gray-400">{tx.type}</p></div></div>
                                       <div className="text-right"><p className={`font-semibold ${tx.type === 'Receive' || tx.type === 'Buy' ? 'text-green-400' : 'text-red-400'}`}>{tx.type === 'Receive' || tx.type === 'Buy' ? '+' : '-'} {tx.amountCrypto.toFixed(4)} {tx.asset.ticker}</p><p className="text-sm text-gray-400">${tx.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
                                   </div>
                               )})}
                            </div>
                        </div>

                        <div className="bg-card border border-border p-6 rounded-3xl backdrop-blur-lg">
                            <h3 className="text-xl font-semibold text-white mb-4">Market Movers</h3>
                            {isLoading ? <div className="space-y-4"><div><Skeleton className="h-4 w-24 mb-3"/><div className="space-y-3"><Skeleton className="h-5 w-full"/><Skeleton className="h-5 w-full"/><Skeleton className="h-5 w-full"/></div></div><Skeleton className="h-px w-full !my-4 !bg-border" /><div><Skeleton className="h-4 w-24 mb-3"/><div className="space-y-3"><Skeleton className="h-5 w-full"/><Skeleton className="h-5 w-full"/><Skeleton className="h-5 w-full"/></div></div></div> :
                            (<div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-green-400 mb-2">Top Gainers</h4>
                                    <div className="space-y-3">
                                        {topGainers.map(asset => {
                                            const Icon = asset.icon;
                                            return <div key={asset.id} className="flex justify-between items-center"><div className="flex items-center gap-2"><Icon className="w-6 h-6"/><span className="text-sm text-white">{asset.ticker}</span></div><span className="text-sm font-mono text-green-400">+{asset.change24h.toFixed(2)}%</span></div>
                                        })}
                                    </div>
                                </div>
                                <div className="border-t border-border"></div>
                                <div>
                                    <h4 className="text-sm font-semibold text-red-400 mb-2">Top Losers</h4>
                                     <div className="space-y-3">
                                        {topLosers.map(asset => {
                                            const Icon = asset.icon;
                                            return <div key={asset.id} className="flex justify-between items-center"><div className="flex items-center gap-2"><Icon className="w-6 h-6"/><span className="text-sm text-white">{asset.ticker}</span></div><span className="text-sm font-mono text-red-400">{asset.change24h.toFixed(2)}%</span></div>
                                        })}
                                    </div>
                                </div>
                            </div>)}
                        </div>
                    </div>
                </div>
            </div>
            
            <Modal isOpen={isAnalyzeTokenModalOpen} onClose={() => { setAnalyzeTokenModalOpen(false); setAnalysisResult(null); setContractAddress(''); }} title="Analyze Token Contract">
                <div className="space-y-4"><p className="text-sm text-gray-400">Enter a contract address to check for potential risks and safety. This is not financial advice.</p><div className="flex gap-2"><input type="text" value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} placeholder="0x..." className="flex-grow bg-secondary border border-border rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"/><button onClick={handleAnalyzeToken} disabled={isAnalyzing || !contractAddress} className="bg-accent text-white px-4 py-2 rounded-xl font-semibold hover:bg-accent-hover transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">{isAnalyzing ? 'Analyzing...' : 'Check'}</button></div>{analysisResult && (<div className={`p-4 rounded-xl text-sm ${analysisResult.includes('safe') ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>{analysisResult}</div>)}</div>
            </Modal>
            <Modal isOpen={isGasTrackerModalOpen} onClose={() => setGasTrackerModalOpen(false)} title="Live Gas Fees">
                <div className="space-y-4">{GAS_FEES.map(fee => { const Icon = fee.icon; return (<div key={fee.chain} className="bg-secondary p-3 rounded-xl flex items-center justify-between"><div className="flex items-center gap-3"><Icon className="w-8 h-8" /><span className="font-semibold text-white">{fee.chain}</span></div><div className="text-right"><p className="text-sm text-white font-mono"><span className="text-green-400">{fee.low}</span> / <span className="text-yellow-400">{fee.average}</span> / <span className="text-red-400">{fee.high}</span> Gwei</p><p className="text-xs text-gray-400">Avg: ~${fee.priceUSD.toFixed(2)}</p></div></div>)})}</div>
            </Modal>
        </>
    );
};

export default Dashboard;