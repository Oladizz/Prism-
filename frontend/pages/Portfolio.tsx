import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Header from '../components/Header.tsx';
import { usePortfolio } from '../contexts/PortfolioContext.tsx';
import { NFTS, TRANSACTIONS } from '../constants.ts';
import Skeleton from '../components/Skeleton.tsx';
import { GasFeeIcon } from '../components/icons/ActionIcons.tsx';
import { WalletIcon, NftCollectionIcon, CoinsIcon, AddIcon } from '../components/icons/DetailIcons.tsx';
import Modal from '../components/Modal.tsx';
import { useToast } from '../hooks/useToast.ts';
import { Asset } from '../types.ts';

const SummaryCard: React.FC<{ title: string; value: string; icon: React.ReactNode; change?: string; changeColor?: string }> = ({ title, value, icon, change, changeColor }) => (
    <div className="bg-card border border-border rounded-3xl p-4 flex items-start justify-between backdrop-blur-lg">
        <div>
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <p className="text-2xl font-semibold text-white">{value}</p>
            {change && <p className={`text-sm font-semibold ${changeColor}`}>{change}</p>}
        </div>
        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-accent p-2">
            {icon}
        </div>
    </div>
);

const Portfolio: React.FC = () => {
    const { assets, allAssets, addAsset, removeAsset } = usePortfolio();
    const [isLoading, setIsLoading] = useState(true);
    const [portfolioHistory, setPortfolioHistory] = useState<PortfolioHistory[]>([]);
    const [isManageAssetsModalOpen, setManageAssetsModalOpen] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            if (assets.length === 0) {
                setPortfolioHistory([]);
                setIsLoading(false); // Set loading to false if no assets
                return;
            }
            setIsLoading(true); // Set loading to true before fetching
            try {
                const history = await getPortfolioHistory(
                    assets.map(a => ({ coingeckoId: a.coingeckoId, balance: a.balanceCrypto }))
                );
                setPortfolioHistory(history);
            } catch (error) {
                console.error('Error fetching portfolio history:', error);
                // Optionally add a toast notification here
            } finally {
                setIsLoading(false); // Set loading to false after fetching
            }
        };
        fetchHistory();
    }, [assets]);

    const portfolioStats = useMemo(() => {
        const totalBalance = assets.reduce((acc, asset) => acc + asset.balanceUSD, 0);
        const totalGasFees = TRANSACTIONS.reduce((acc, tx) => acc + (tx.gasFeeUSD || 0), 0);
        const distributionData = assets.map(asset => ({ name: asset.ticker, value: asset.balanceUSD })).filter(d => d.value > 0);
        const totalNfts = NFTS.length;
        const totalCoins = assets.length;
        
        let portfolioChange = 0;
        let portfolioChangePercent = 0;

        if (portfolioHistory && portfolioHistory.length >= 2) {
            const currentValue = portfolioHistory[portfolioHistory.length - 1]?.value || 0;
            const previousValue = portfolioHistory[portfolioHistory.length - 2]?.value || 0;
            
            portfolioChange = currentValue - previousValue;
            if (previousValue !== 0) {
                portfolioChangePercent = (portfolioChange / previousValue) * 100;
            }
        }

        return { totalBalance, totalGasFees, distributionData, totalNfts, totalCoins, portfolioChange, portfolioChangePercent };
    }, [assets, portfolioHistory]);
    
    const COLORS = ['#9F00FF', '#00F6FF', '#DA00FF', '#CCCCCC', '#C566FF', '#AAAAAA', '#7F00CC', '#888888'];

    console.log('Portfolio: assets.length:', assets.length, 'isLoading:', isLoading);
    if (assets.length === 0 && !isLoading) {
         return (
            <div>
                <Header title="Portfolio Overview" />
                <div className="text-center py-20 bg-card border border-border rounded-3xl mt-6 backdrop-blur-lg">
                    <h2 className="text-2xl font-bold text-white">Your Portfolio is Empty</h2>
                    <p className="text-gray-400 mt-2">Add assets to start tracking your portfolio.</p>
                    <button 
                        onClick={() => setManageAssetsModalOpen(true)}
                        className="mt-6 flex items-center mx-auto gap-2 bg-accent text-white px-4 py-2 rounded-xl font-semibold hover:bg-accent-hover transition-colors">
                        <AddIcon className="h-5 w-5" />
                        <span>Add Your First Asset</span>
                    </button>
                </div>
                <ManageAssetsModal isOpen={isManageAssetsModalOpen} onClose={() => setManageAssetsModalOpen(false)} />
            </div>
        );
    }
    
    return (
        <div>
            <Header title="Portfolio Overview" />
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-[105px] rounded-3xl" />) : <>
                        <SummaryCard title="Total Value" value={`$${portfolioStats.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={<WalletIcon />} change={`${portfolioStats.portfolioChange >= 0 ? '+' : ''}$${portfolioStats.portfolioChange.toFixed(2)} (${portfolioStats.portfolioChangePercent >= 0 ? '+' : ''}${portfolioStats.portfolioChangePercent.toFixed(2)}%)`} changeColor={portfolioStats.portfolioChange >= 0 ? 'text-green-400' : 'text-red-400'} />
                        <SummaryCard title="Total NFTs" value={portfolioStats.totalNfts.toString()} icon={<NftCollectionIcon />} />
                        <SummaryCard title="Coins Held" value={portfolioStats.totalCoins.toString()} icon={<CoinsIcon />} />
                        <SummaryCard title="Total Gas Spent" value={`$${portfolioStats.totalGasFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={<GasFeeIcon />} />
                    </>}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                         <div className="bg-card border border-border rounded-3xl backdrop-blur-lg">
                             <div className="flex justify-between items-center p-6 pb-4">
                                <h3 className="text-xl font-semibold text-white">My Assets</h3>
                                <button onClick={() => setManageAssetsModalOpen(true)} className="bg-secondary text-white px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-card transition-colors border border-border">
                                    Manage
                                </button>
                             </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="text-sm text-gray-400"><tr className="border-b border-t border-border bg-black/20"><th className="p-4 font-semibold">Asset</th><th className="p-4 font-semibold text-right">Price</th><th className="p-4 font-semibold text-right">24h Change</th><th className="p-4 font-semibold text-right">Holdings</th></tr></thead>
                                    <tbody>
                                        {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                                            <tr key={i} className="border-b border-border"><td className="p-4"><div className="flex items-center gap-4"><Skeleton className="w-8 h-8 rounded-full" /><div><Skeleton className="h-4 w-20" /><Skeleton className="h-3 w-10 mt-2" /></div></div></td><td className="p-4 text-right"><Skeleton className="h-4 w-24 ml-auto" /></td><td className="p-4 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td><td className="p-4 text-right"><Skeleton className="h-4 w-24 ml-auto" /><Skeleton className="h-3 w-20 mt-2 ml-auto" /></td></tr>
                                        )) : assets.map(asset => {
                                            const isPositive = asset.change24h >= 0;
                                            const Icon = asset.icon;
                                            return (
                                            <tr key={asset.id} className="border-b border-border last:border-0 hover:bg-black/20">
                                                <td className="p-4"><Link to={`/portfolio/${asset.id}`} className="flex items-center gap-4 group"><div className="flex-shrink-0"><Icon className="w-8 h-8" /></div><div><p className="font-semibold text-white group-hover:text-accent">{asset.name}</p><p className="text-sm text-gray-400">{asset.ticker}</p></div></Link></td>
                                                <td className="p-4 font-mono text-white text-right">${asset.price.toLocaleString()}</td>
                                                <td className={`p-4 font-mono text-right ${isPositive ? 'text-green-400' : 'text-red-400'}`}>{isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%</td>
                                                <td className="p-4 text-right"><p className="font-semibold text-white font-mono">${asset.balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p><p className="text-sm text-gray-400 font-mono">{asset.balanceCrypto.toFixed(4)} {asset.ticker}</p></td>
                                            </tr>
                                        )})}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 backdrop-blur-lg">
                        <h3 className="text-xl font-semibold text-white mb-4">Asset Distribution</h3>
                        {isLoading ? <Skeleton className="h-64 w-full rounded-3xl" /> : 
                        <div className="flex flex-col items-center gap-6 h-full justify-center">
                            <div className="h-48 w-48">
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={portfolioStats.distributionData} cx="50%" cy="50%" labelLine={false} innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={3} dataKey="value">
                                            {portfolioStats.distributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="" />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(26, 26, 26, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', backdropFilter: 'blur(10px)' }} formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-full flex flex-col gap-3 max-w-xs mx-auto">
                                {portfolioStats.distributionData.sort((a,b) => b.value - a.value).slice(0, 5).map((entry, index) => (
                                    <div key={entry.name} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} /><span className="text-gray-300">{entry.name}</span></div>
                                        <span className="font-semibold text-white font-mono">{((entry.value / portfolioStats.totalBalance) * 100).toFixed(1)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
            <ManageAssetsModal isOpen={isManageAssetsModalOpen} onClose={() => setManageAssetsModalOpen(false)} />
        </div>
    );
};

const ManageAssetsModal: React.FC<{isOpen: boolean, onClose: () => void}> = ({ isOpen, onClose }) => {
    const { assets: userAssets, allAssets, addAsset, removeAsset } = usePortfolio();
    const availableAssets = allAssets.filter(asset => !userAssets.some(userAsset => userAsset.id === asset.id));
    const [assetToAdd, setAssetToAdd] = useState<Asset | null>(null);
    const [addAmount, setAddAmount] = useState('');
    const [assetToRemove, setAssetToRemove] = useState<Asset | null>(null);
    const { addToast } = useToast();

    const handleAdd = () => {
        const amount = parseFloat(addAmount);
        if (assetToAdd && !isNaN(amount) && amount > 0) {
            addAsset(assetToAdd.id, amount);
            addToast({ type: 'success', title: 'Asset Added', message: `${assetToAdd.name} added to your portfolio.` });
            setAssetToAdd(null);
            setAddAmount('');
        } else {
            addToast({ type: 'error', title: 'Invalid Input', message: 'Please select an asset and enter a valid amount.' });
        }
    };
     const handleRemoveAsset = () => {
        if (assetToRemove) {
            removeAsset(assetToRemove.id);
            addToast({ type: 'success', title: 'Asset Removed', message: `${assetToRemove.name} has been removed from your portfolio.` });
            setAssetToRemove(null);
        }
    };
    
    return (
       <>
        <Modal isOpen={isOpen} onClose={onClose} title="Manage Assets">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Add New Asset</h3>
                    {availableAssets.length > 0 ? (
                        <div className="space-y-3">
                            <select onChange={(e) => setAssetToAdd(allAssets.find(a => a.id === e.target.value) || null)} defaultValue="" className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}>
                                <option value="" disabled>Select an asset...</option>
                                {availableAssets.map(asset => <option key={asset.id} value={asset.id}>{asset.name} ({asset.ticker})</option>)}
                            </select>
                            <div className="flex gap-2">
                                <input type="number" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} placeholder="Amount (e.g., 0.5)" className="flex-grow bg-secondary border border-border rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent" />
                                <button onClick={handleAdd} disabled={!assetToAdd} className="bg-accent text-white px-4 py-2 rounded-xl font-semibold hover:bg-accent-hover transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">Add</button>
                            </div>
                        </div>
                    ) : <p className="text-sm text-gray-400">All available assets are in your portfolio.</p>}
                </div>

                <div className="border-t border-border"></div>
                
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">My Portfolio Assets</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {userAssets.map(asset => {
                            const Icon = asset.icon;
                            return (
                                <div key={asset.id} className="flex items-center justify-between bg-secondary p-2 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Icon className="w-8 h-8" />
                                        <div>
                                            <p className="font-semibold text-white">{asset.name}</p>
                                            <p className="text-sm text-gray-400">{asset.balanceCrypto} {asset.ticker}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setAssetToRemove(asset)} className="p-2 rounded-full text-gray-400 hover:bg-card hover:text-red-400 transition-colors" aria-label={`Remove ${asset.name}`}>
                                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Modal>
         <Modal isOpen={!!assetToRemove} onClose={() => setAssetToRemove(null)} title={`Remove ${assetToRemove?.name}?`}>
            <div className="space-y-6"><p className="text-sm text-gray-400">Are you sure you want to remove {assetToRemove?.name} from your portfolio? This action cannot be undone.</p><div className="flex justify-end gap-3"><button onClick={() => setAssetToRemove(null)} className="bg-secondary text-white px-4 py-2 rounded-xl font-semibold hover:bg-card transition-colors">Cancel</button><button onClick={handleRemoveAsset} className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors">Remove</button></div></div>
        </Modal>
       </>
    );
};

export default Portfolio;
