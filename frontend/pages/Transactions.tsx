import React, { useState, useMemo, useRef, useEffect, ReactNode } from 'react';
import Header from '../components/Header.tsx';
import { getTransactions } from '../services/api';
import { Transaction, TransactionStatus, TransactionType } from '../types.ts';
import { SearchIcon, ExpandMoreIcon } from '../components/icons/DetailIcons.tsx';
import Skeleton from '../components/Skeleton.tsx';
import { useToast } from '../hooks/useToast.ts';
import { useWallets } from '../contexts/WalletContext.tsx';
import { Link } from 'react-router-dom';

// --- Helper Components & Hooks ---

const useOnClickOutside = (ref: React.RefObject<HTMLDivElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

const FilterDropdown: React.FC<{ label: string; children: ReactNode; activeCount: number; widthClass?: string, disabled?: boolean }> = ({ label, children, activeCount, widthClass = 'w-64', disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, () => setIsOpen(false));
    
    const isActive = activeCount > 0;

    return (
        <div className="relative" ref={ref}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                disabled={disabled}
                className={`flex items-center justify-between gap-2 px-3 py-1.5 border rounded-xl text-sm transition-colors w-full sm:w-auto ${
                    isActive 
                    ? 'bg-accent/20 border-accent text-white' 
                    : 'bg-secondary border-border hover:border-gray-600 text-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                <span>{label}{isActive ? ` (${activeCount})` : ''}</span>
                <ExpandMoreIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className={`absolute top-full left-0 mt-2 ${widthClass} bg-secondary border border-border rounded-xl shadow-xl z-20 backdrop-blur-md`}>
                    {children}
                </div>
            )}
        </div>
    );
};

const CheckboxItem: React.FC<{ label: string; id: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, id, checked, onChange }) => (
    <label htmlFor={id} className="flex items-center space-x-3 p-3 text-sm text-gray-300 cursor-pointer hover:bg-card">
        <input 
            type="checkbox" 
            id={id}
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 rounded bg-card border-border text-accent focus:ring-accent focus:ring-offset-secondary"
        />
        <span>{label}</span>
    </label>
);

const getStatusClass = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.COMPLETED: return 'bg-green-500/10 text-green-400';
    case TransactionStatus.PENDING: return 'bg-yellow-500/10 text-yellow-400';
    case TransactionStatus.FAILED: return 'bg-red-500/10 text-red-400';
    default: return 'bg-gray-500/10 text-gray-400';
  }
};

const TypeBadge: React.FC<{ type: TransactionType }> = ({ type }) => {
  let className = '';
  switch (type) {
    case TransactionType.RECEIVE: case TransactionType.BUY: className = 'bg-green-500/10 text-green-400'; break;
    case TransactionType.SEND: className = 'bg-red-500/10 text-red-400'; break;
    case TransactionType.SWAP: className = 'bg-blue-500/10 text-blue-400'; break;
  }
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${className}`}>{type}</span>;
};

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const [date, time] = (transaction.date || '').split(' ');
  const Icon = transaction.asset && transaction.asset.icon ? transaction.asset.icon : () => <div className="w-8 h-8 rounded-full bg-gray-500" />;
  const renderFromTo = () => {
    switch(transaction.type) {
      case TransactionType.SEND: return (<div><p className="font-semibold text-white text-sm">To:</p><p className="text-xs text-gray-400 font-mono" title={transaction.address}>{transaction.address ? `${transaction.address.substring(0, 6)}...${transaction.address.substring(transaction.address.length - 4)}` : 'N/A'}</p></div>);
      case TransactionType.RECEIVE: return (<div><p className="font-semibold text-white text-sm">From:</p><p className="text-xs text-gray-400">External Wallet</p></div>);
      case TransactionType.BUY: case TransactionType.SWAP: return (<div><p className="font-semibold text-white text-sm">Source:</p><p className="text-xs text-gray-400">Platform</p></div>);
      default: return null;
    }
  };
  return (
    <tr className="border-b border-border hover:bg-black/20"><td className="p-4"><p className="font-semibold text-white text-sm">{date}</p><p className="text-xs text-gray-400">{time}</p></td><td className="p-4"><div className="flex items-center gap-3"><Icon className="w-8 h-8" /><div><p className="font-semibold text-white">{transaction.asset ? transaction.asset.name : ''}</p><p className="text-sm text-gray-400">{transaction.asset ? transaction.asset.ticker : ''}</p></div></div></td><td className="p-4"><p className="font-semibold text-white font-mono text-sm">{(transaction.amountCrypto || 0).toFixed(4)} {transaction.asset ? transaction.asset.ticker : ''}</p><p className="text-xs text-gray-400 font-mono">${(transaction.amountUSD || 0).toLocaleString()}</p></td><td className="p-4"><TypeBadge type={transaction.type} /></td><td className="p-4">{renderFromTo()}</td><td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(transaction.status)}`}>{transaction.status}</span></td></tr>
  );
};

const TransactionRowSkeleton: React.FC = () => (
    <tr className="border-b border-border"><td className="p-4"><Skeleton className="h-4 w-20" /><Skeleton className="h-3 w-12 mt-2" /></td><td className="p-4"><div className="flex items-center gap-3"><Skeleton className="w-8 h-8 rounded-full" /><div><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-10 mt-2" /></div></div></td><td className="p-4"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-16 mt-2" /></td><td className="p-4"><Skeleton className="h-6 w-16 rounded-full" /></td><td className="p-4"><Skeleton className="h-4 w-12" /><Skeleton className="h-3 w-20 mt-2" /></td><td className="p-4"><Skeleton className="h-6 w-24 rounded-full" /></td></tr>
);


const initialFilters = { searchTerm: '', startDate: '', endDate: '', types: new Set<string>(), statuses: new Set<string>(), wallets: new Set<string>(), chains: new Set<string>(), assets: new Set<string>() };

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stagingFilters, setStagingFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const { addToast } = useToast();
  const { wallets } = useWallets();

  useEffect(() => {
    const fetchTransactions = async () => {
        if (wallets.length === 0) {
            setIsLoading(false);
            return;
        }
      try {
        const chain = 'ethereum'; // Assuming all wallets are on ethereum for now
        const transactionPromises = wallets.map(wallet => getTransactions(chain, wallet.address));
        const transactionResults = await Promise.all(transactionPromises);
        const allTransactions = transactionResults.flat();
        setTransactions(allTransactions);
        addToast({
            type: 'success',
            title: 'Transactions Loaded',
            message: 'Your transaction history is up to date.',
        });
      } catch (error) {
        addToast({
            type: 'error',
            title: 'Error',
            message: 'Failed to load transactions.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [wallets, addToast]);

  const filterOptions = useMemo(() => ({
    wallets: [...new Set(transactions.map(tx => tx.wallet))],
    chains: [...new Set(transactions.map(tx => tx.chain))],
    assets: [...new Set(transactions.map(tx => tx.asset.ticker))],
    types: Object.values(TransactionType),
    statuses: Object.values(TransactionStatus),
  }), [transactions]);

  const handleMultiSelectChange = (category: keyof typeof stagingFilters, value: string) => {
    setStagingFilters(prev => {
        const newSet = new Set(prev[category as 'types']);
        if (newSet.has(value)) newSet.delete(value);
        else newSet.add(value);
        return { ...prev, [category]: newSet };
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStagingFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const { searchTerm, startDate, endDate, types, statuses, wallets, chains, assets } = appliedFilters;
      if (types.size > 0 && !types.has(tx.type)) return false;
      if (statuses.size > 0 && !statuses.has(tx.status)) return false;
      if (wallets.size > 0 && !wallets.has(tx.wallet)) return false;
      if (chains.size > 0 && !chains.has(tx.chain)) return false;
      if (assets.size > 0 && !assets.has(tx.asset.ticker)) return false;
      const txDate = new Date(tx.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);
      if (start && txDate < start) return false;
      if (end && txDate > end) return false;
      const lowercasedSearch = searchTerm.toLowerCase();
      if (lowercasedSearch && !(tx.asset.name.toLowerCase().includes(lowercasedSearch) || tx.asset.ticker.toLowerCase().includes(lowercasedSearch) || tx.amountCrypto.toString().includes(lowercasedSearch) || tx.amountUSD.toString().includes(lowercasedSearch) || (tx.address && tx.address.toLowerCase().includes(lowercasedSearch)) || tx.wallet.toLowerCase().includes(lowercasedSearch) || tx.chain.toLowerCase().includes(lowercasedSearch))) return false;
      return true;
    });
  }, [appliedFilters, transactions]);
  
  const handleApplyFilters = () => setAppliedFilters(stagingFilters);
  const handleClearFilters = () => { setStagingFilters(initialFilters); setAppliedFilters(initialFilters); };
  const hasActiveFilters = JSON.stringify(stagingFilters) !== JSON.stringify(initialFilters);

  if (wallets.length === 0 && !isLoading) {
    return (
        <div>
            <Header title="Transactions" />
            <div className="text-center py-20 bg-card border border-border rounded-3xl mt-6 backdrop-blur-lg">
                <h2 className="text-2xl font-bold text-white">No Wallets Found</h2>
                <p className="text-gray-400 mt-2">Add a wallet in the settings to see your transactions.</p>
                <Link to="/profile" className="mt-6 inline-block bg-accent text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-accent-hover transition-colors">Go to Settings</Link>
            </div>
        </div>
    );
  }

  return (
    <div>
      <Header title="Transactions" />
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="relative flex-grow min-w-[200px] sm:flex-grow-0 sm:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon className="w-4 h-4 text-gray-400" /></span>
          <input type="text" placeholder="Search transactions..." name="searchTerm" value={stagingFilters.searchTerm} onChange={handleInputChange} disabled={isLoading}
            className="w-full bg-secondary border border-border rounded-xl pl-9 pr-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"/>
        </div>

        <FilterDropdown label="Date Range" activeCount={Number(!!stagingFilters.startDate || !!stagingFilters.endDate)} disabled={isLoading}>
          <div className="p-3 space-y-3"><label className="text-xs text-gray-400 block mb-1">Start Date</label><input type="date" name="startDate" value={stagingFilters.startDate} onChange={handleInputChange} className="bg-card border border-border rounded-lg px-2 py-1 text-sm w-full"/><label className="text-xs text-gray-400 block mb-1">End Date</label><input type="date" name="endDate" value={stagingFilters.endDate} onChange={handleInputChange} min={stagingFilters.startDate} disabled={!stagingFilters.startDate} className="bg-card border border-border rounded-lg px-2 py-1 text-sm w-full disabled:opacity-50"/></div>
        </FilterDropdown>

        <FilterDropdown label="Wallet" activeCount={stagingFilters.wallets.size} disabled={isLoading}><div className="space-y-1 max-h-60 overflow-y-auto">{filterOptions.wallets.map(w => <CheckboxItem key={w} id={`w-${w}`} label={w} checked={stagingFilters.wallets.has(w)} onChange={() => handleMultiSelectChange('wallets', w)} />)}</div></FilterDropdown>
        <FilterDropdown label="Chain" activeCount={stagingFilters.chains.size} disabled={isLoading}><div className="space-y-1 max-h-60 overflow-y-auto">{filterOptions.chains.map(c => <CheckboxItem key={c} id={`c-${c}`} label={c} checked={stagingFilters.chains.has(c)} onChange={() => handleMultiSelectChange('chains', c)} />)}</div></FilterDropdown>
        <FilterDropdown label="Asset" activeCount={stagingFilters.assets.size} disabled={isLoading}><div className="space-y-1 max-h-60 overflow-y-auto">{filterOptions.assets.map(a => <CheckboxItem key={a} id={`a-${a}`} label={a} checked={stagingFilters.assets.has(a)} onChange={() => handleMultiSelectChange('assets', a)} />)}</div></FilterDropdown>
        <FilterDropdown label="Type" activeCount={stagingFilters.types.size} disabled={isLoading}><div className="space-y-1">{filterOptions.types.map(t => <CheckboxItem key={t} id={`t-${t}`} label={t} checked={stagingFilters.types.has(t)} onChange={() => handleMultiSelectChange('types', t)} />)}</div></FilterDropdown>
        <FilterDropdown label="Status" activeCount={stagingFilters.statuses.size} disabled={isLoading}><div className="space-y-1">{filterOptions.statuses.map(s => <CheckboxItem key={s} id={`s-${s}`} label={s} checked={stagingFilters.statuses.has(s)} onChange={() => handleMultiSelectChange('statuses', s)} />)}</div></FilterDropdown>

        <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
          <button onClick={handleApplyFilters} disabled={isLoading} className="bg-accent text-white px-4 py-1.5 rounded-xl text-sm font-semibold hover:bg-accent-hover transition-colors w-full sm:w-auto disabled:opacity-50">Apply filter</button>
          {hasActiveFilters && <button onClick={handleClearFilters} disabled={isLoading} className="bg-secondary text-white px-4 py-1.5 rounded-xl text-sm font-semibold hover:bg-card transition-colors w-full sm:w-auto disabled:opacity-50">Clear</button>}
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden backdrop-blur-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20"><tr><th className="p-4 font-semibold text-gray-300">Date & Time</th><th className="p-4 font-semibold text-gray-300">Asset</th><th className="p-4 font-semibold text-gray-300">Amount</th><th className="p-4 font-semibold text-gray-300">Type</th><th className="p-4 font-semibold text-gray-300">From/To</th><th className="p-4 font-semibold text-gray-300">Status</th></tr></thead>
            <tbody>
              {isLoading ? Array.from({ length: 10 }).map((_, i) => <TransactionRowSkeleton key={i} />) : (filteredTransactions.length > 0 ? filteredTransactions.map(tx => <TransactionRow key={tx.id} transaction={tx} />) : <tr><td colSpan={6} className="text-center p-8 text-gray-400">No transactions found for the selected filters.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;