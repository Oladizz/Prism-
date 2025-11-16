import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ASSETS, CRYPTO_DETAIL_DATA } from '../constants.ts';
import { BackArrowIcon, StarIcon, BuySellIcon } from '../components/icons/DetailIcons.tsx';

const StatCard: React.FC<{ title: string; value: string; change: number; isCurrency?: boolean }> = ({ title, value, change, isCurrency = true }) => {
    const isPositive = change >= 0;
    return (
        <div className="bg-card border border-border rounded-3xl p-4 backdrop-blur-lg">
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <p className="text-2xl font-semibold text-white mb-2">{value}</p>
            <div className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}
                {isCurrency && '$'}
                {Math.abs(change).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                {' '}({isPositive ? '+' : ''}{((change / parseFloat(value.replace(/[^0-9.-]+/g, ""))) * 100).toFixed(2)}%)
            </div>
        </div>
    );
};

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

const CryptoDetail: React.FC = () => {
    const { ticker } = useParams<{ ticker: string }>();
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('1D');

    const asset = ASSETS.find(a => a.ticker === ticker);
    const detailData = ticker ? CRYPTO_DETAIL_DATA[ticker] : null;

    if (!asset || !detailData) {
        return <div className="text-center p-10">Cryptocurrency not found.</div>;
    }
    
    const chartData = detailData.historicalChartData[timeRange];
    const Icon = asset.icon;

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                     <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-card">
                        <BackArrowIcon className="h-6 w-6" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-card">
                        <StarIcon className="h-6 w-6" />
                    </button>
                    <Icon className="w-10 h-10" />
                    <div>
                        <h1 className="text-2xl font-bold text-white">{asset.name} ({asset.ticker})</h1>
                        <p className="text-gray-400">The first decentralized cryptocurrency.</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-accent-hover transition-colors">
                    <BuySellIcon className="h-5 w-5" />
                    <span>Buy / Sell</span>
                </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard title="Price" value={`$${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} change={asset.price * (asset.change24h / 100)} />
                <StatCard title="24h Change" value={`+$1,675.34`} change={1.2} isCurrency={false} />
                <StatCard title="Market Cap" value={`$${(asset.marketCap / 1_000_000_000_000).toFixed(2)}T`} change={asset.marketCap * 0.031} />
                <StatCard title="Volume (24h)" value={`$${(asset.volume24h / 1_000_000_000).toFixed(1)}B`} change={asset.volume24h * 0.058} />
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-lg">
                <div className="flex justify-between items-center mb-4">
                     <div>
                        <p className="text-3xl font-bold text-white">${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-sm text-gray-400">Jan 01, 2024 - Present <span className="text-green-400 font-semibold">+124.5%</span></p>
                    </div>
                    <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} />
                </div>
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#9F00FF" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#9F00FF" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis orientation="right" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value).toLocaleString()}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(26, 26, 26, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', backdropFilter: 'blur(10px)' }}
                                labelStyle={{ color: '#d1d5db' }}
                                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Price']}
                            />
                            <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" vertical={false} />
                            <Area type="monotone" dataKey="price" stroke="#9F00FF" strokeWidth={2} fill="url(#chartColor)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-card border border-border rounded-3xl p-6 backdrop-blur-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">About {asset.name}</h3>
                    <p className="text-gray-400 text-sm mb-6">{detailData.description}</p>
                    <div className="space-y-3">
                        {detailData.links.map(link => (
                            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                                <link.icon className="h-5 w-5 text-gray-400" />
                                <span>{link.name}</span>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 backdrop-blur-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Historical Data</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-gray-400">
                                <tr className="border-b border-border">
                                    <th className="p-3 font-semibold">DATE</th>
                                    <th className="p-3 font-semibold">OPEN</th>
                                    <th className="p-3 font-semibold">HIGH</th>
                                    <th className="p-3 font-semibold">LOW</th>
                                    <th className="p-3 font-semibold">CLOSE</th>
                                    <th className="p-3 font-semibold">VOLUME</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailData.historicalTableData.map(row => (
                                    <tr key={row.date} className="border-b border-border last:border-0 font-mono">
                                        <td className="p-3">{row.date}</td>
                                        <td className="p-3">${row.open.toLocaleString()}</td>
                                        <td className="p-3">${row.high.toLocaleString()}</td>
                                        <td className="p-3">${row.low.toLocaleString()}</td>
                                        <td className="p-3">${row.close.toLocaleString()}</td>
                                        <td className="p-3">{row.volume}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CryptoDetail;