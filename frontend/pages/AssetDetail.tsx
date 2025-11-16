import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Header from '../components/Header.tsx';
import { useWallets } from '../contexts/WalletContext.tsx';
import Skeleton from '../components/Skeleton.tsx';
import { Transaction, TransactionStatus, Nft, Asset } from '../types.ts';
import { getAssets, getTransactions, getNfts, getAssetHistory } from '../services/api.ts';
import { useToast } from '../hooks/useToast.ts';
import { CHAINS } from '../constants.ts';

const StatCard: React.FC<{ title: string; value: string; subValue?: string; subValueColor?: string; }> = ({ title, value, subValue, subValueColor }) => (
    <div className="bg-card border border-border rounded-3xl p-4 backdrop-blur-lg">
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <p className="text-2xl font-semibold text-white">{value}</p>
        {subValue && <p className={`text-sm mt-1 font-semibold ${subValueColor}`}>{subValue}</p>}
    </div>
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

const getStatusClass = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.COMPLETED: return 'bg-green-500/10 text-green-400';
    case TransactionStatus.PENDING: return 'bg-yellow-500/10 text-yellow-400';
    case TransactionStatus.FAILED: return 'bg-red-500/10 text-red-400';
    default: return 'bg-gray-500/10 text-gray-400';
  }
};

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const [date, time] = transaction.date.split(' ');
  return (
    <tr className="border-b border-border last:border-0 font-mono">
        <td className="p-3">
            <p className="font-semibold text-white text-sm">{date}</p>
            <p className="text-xs text-gray-400">{time}</p>
        </td>
        <td className="p-3">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${transaction.type === 'Send' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                {transaction.type}
            </span>
        </td>
        <td className="p-3 text-right">
            <p className="font-semibold text-white text-sm">{transaction.amountCrypto.toFixed(6)} {transaction.asset.ticker}</p>
        </td>
        <td className="p-3 text-right">
            <p className="text-xs text-gray-400 font-mono">${transaction.amountUSD.toLocaleString()}</p>
        </td>
        <td className="p-3 text-right">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(transaction.status)}`}>
                {transaction.status}
            </span>
        </td>
    </tr>
  );
};


const AssetDetail: React.FC = () => {
    const { chain = 'ethereum', assetId } = useParams<{ chain?: string, assetId?: string }>();
    const navigate = useNavigate();
    const { wallets } = useWallets();
    const { addToast } = useToast();

    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30');
    const [allUserAssets, setAllUserAssets] = useState<Asset[]>([]);
    const [allUserTransactions, setAllUserTransactions] = useState<Transaction[]>([]);
    const [allUserNfts, setAllUserNfts] = useState<Nft[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const fetchAllData = async () => {
            if (wallets.length === 0) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const assetPromises = wallets.map(wallet => getAssets(chain, wallet.address));
                const transactionPromises = wallets.map(wallet => getTransactions(chain, wallet.address));
                const nftPromises = wallets.map(wallet => getNfts(chain, wallet.address));

                const assetResults = await Promise.all(assetPromises);
                const transactionResults = await Promise.all(transactionPromises);
                const nftResults = await Promise.all(nftPromises);

                const aggregatedAssets = assetResults.flat().reduce((acc, asset) => {
                    const existingAsset = acc.find(a => a.id === asset.id);
                    if (existingAsset) {
                        existingAsset.balanceCrypto += asset.balanceCrypto;
                        existingAsset.balanceUSD += asset.balanceUSD;
                    } else {
                        acc.push(asset);
                    }
                    return acc;
                }, [] as Asset[]);

                setAllUserAssets(aggregatedAssets);
                setAllUserTransactions(transactionResults.flat());
                setAllUserNfts(nftResults.flat());

                if (!assetId && aggregatedAssets.length > 0) {
                    navigate(`/portfolio/${chain}/${aggregatedAssets[0].id}`, { replace: true });
                }

            } catch (error) {
                console.error('Error fetching asset detail data:', error);
                addToast({ type: 'error', title: 'Error', message: 'Failed to load asset details.' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [chain, assetId, wallets, navigate, addToast]);

    const selectedAsset = useMemo(() => {
        return allUserAssets.find(a => a.id === assetId);
    }, [allUserAssets, assetId]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (selectedAsset && selectedAsset.coingeckoId) {
                try {
                    const history = await getAssetHistory(selectedAsset.coingeckoId, timeRange);
                    const holdingHistory = history.map(point => ({
                        date: new Date(point.date).toLocaleDateString(),
                        value: point.price * selectedAsset.balanceCrypto
                    }));
                    setChartData(holdingHistory);
                } catch (e) {
                    console.error(e);
                    addToast({ type: 'error', title: 'Chart Error', message: 'Could not load chart data.' });
                }
            }
        };
        fetchHistory();
    }, [selectedAsset, timeRange, addToast]);

    const assetTransactions = useMemo(() => {
        if (!selectedAsset) return [];
        return allUserTransactions.filter(tx => tx.asset.id === selectedAsset.id);
    }, [allUserTransactions, selectedAsset]);

    const chainStats = useMemo(() => {
        if (!selectedAsset) return null;
        
        const chainName = selectedAsset.chain;
        const assetsOnChain = allUserAssets.filter(a => a.chain === chainName);
        const transactionsOnChain = allUserTransactions.filter(tx => tx.chain === chainName);
        const nftsOnChain = allUserNfts.filter(nft => nft.chain === chainName);
        const totalGas = transactionsOnChain.reduce((sum, tx) => sum + (tx.gasFeeUSD || 0), 0);

        return {
            assetsCount: assetsOnChain.length,
            transactionCount: transactionsOnChain.length,
            totalGas,
            nftCount: nftsOnChain.length,
        };
    }, [selectedAsset, allUserAssets, allUserTransactions, allUserNfts]);


    const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newAssetId = e.target.value;
        if (newAssetId) navigate(`/portfolio/${chain}/${newAssetId}`);
    };
    
    if (wallets.length === 0 && !isLoading) {
         return (
            <div>
                <Header title="Portfolio" />
                <div className="text-center py-20 bg-card border border-border rounded-3xl mt-6 backdrop-blur-lg">
                    <h2 className="text-2xl font-bold text-white">No Wallets Found</h2>
                    <p className="text-gray-400 mt-2">Add a wallet in the settings to see your assets.</p>
                    <Link to="/profile" className="mt-6 inline-block bg-accent text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-accent-hover transition-colors">Go to Settings</Link>
                </div>
            </div>
        );
    }
    
    if (isLoading || !selectedAsset || !chainStats) {
        return (
             <div>
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4"><Header title="Portfolio" /><div className="flex gap-4"><Skeleton className="h-10 w-32 rounded-xl" /><Skeleton className="h-10 w-48 rounded-xl" /></div></div>
                <div className="space-y-6"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-24 rounded-3xl" />)}</div><Skeleton className="h-96 w-full rounded-3xl" /><Skeleton className="h-64 w-full rounded-3xl" /></div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <Header title="Portfolio" />
                <div className="flex items-center gap-2">
                    <select value={chain} onChange={(e) => navigate(`/portfolio/${e.target.value}`)} className="w-full sm:w-32 bg-secondary border border-border rounded-xl px-4 py-2 text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-accent appearance-none pr-10" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}>
                        {CHAINS.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                    </select>
                    <select value={assetId || ''} onChange={handleAssetChange} className="w-full sm:w-48 bg-secondary border border-border rounded-xl px-4 py-2 text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-accent appearance-none pr-10" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}>
                        {allUserAssets.map(asset => (<option key={asset.id} value={asset.id}>{asset.name} ({asset.ticker})</option>))}
                    </select>
                </div>
            </div>
            
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Asset Overview</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <StatCard title="Current Value" value={`$${selectedAsset.balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                        <StatCard title="Quantity Held" value={`${selectedAsset.balanceCrypto.toLocaleString('en-US', { maximumFractionDigits: 6 })} ${selectedAsset.ticker}`} />
                    </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">On the {selectedAsset.chain} Network</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
                        <div>
                            <p className="text-gray-400 text-sm">Assets Held</p>
                            <p className="text-2xl font-semibold text-white">{chainStats.assetsCount}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Transactions</p>
                            <p className="text-2xl font-semibold text-white">{chainStats.transactionCount.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Gas Spent</p>
                            <p className="text-2xl font-semibold text-white">${chainStats.totalGas.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">NFTs Held</p>
                            <p className="text-2xl font-semibold text-white">{chainStats.nftCount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-lg">
                    <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                         <div>
                            <p className="text-3xl font-bold text-white">${selectedAsset.balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <p className="text-sm text-gray-400">Current Holding Value</p>
                        </div>
                        <TimeRangeSelector selected={
                            timeRange === '1' ? '1D' :
                            timeRange === '7' ? '7D' :
                            timeRange === '30' ? '1M' :
                            timeRange === '365' ? '1Y' :
                            'ALL'
                        } onSelect={(range) => {
                            const daysMap: { [key: string]: string } = { '1D': '1', '7D': '7', '1M': '30', '1Y': '365', 'ALL': 'max' };
                            setTimeRange(daysMap[range]);
                        }} />
                    </div>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <defs><linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#9F00FF" stopOpacity={0.4}/><stop offset="95%" stopColor="#9F00FF" stopOpacity={0}/></linearGradient></defs>
                                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis orientation="right" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value).toLocaleString('en-US', { notation: 'compact' })}`} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(26, 26, 26, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', backdropFilter: 'blur(10px)' }} labelStyle={{ color: '#d1d5db' }} formatter={(value) => [`$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Value']}/>
                                <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" vertical={false} />
                                <Area type="monotone" dataKey="value" stroke="#9F00FF" strokeWidth={2} fill="url(#chartColor)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Transaction History for {selectedAsset.ticker}</h3>
                    <div className="overflow-x-auto">
                        {assetTransactions.length > 0 ? (
                        <table className="w-full text-left text-sm">
                            <thead className="text-gray-400">
                                <tr className="border-b border-border">
                                    <th className="p-3 font-semibold">DATE</th>
                                    <th className="p-3 font-semibold">TYPE</th>
                                    <th className="p-3 font-semibold text-right">AMOUNT</th>
                                    <th className="p-3 font-semibold text-right">VALUE</th>
                                    <th className="p-3 font-semibold text-right">STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assetTransactions.map(tx => <TransactionRow key={tx.id} transaction={tx} />)}
                            </tbody>
                        </table>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                No transactions found for {selectedAsset.name}.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetDetail;