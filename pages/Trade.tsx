import React from 'react';
import Header from '../components/Header.tsx';
import { TRANSACTIONS } from '../constants.ts';
import { Transaction, TransactionStatus, TransactionType } from '../types.ts';

const getStatusClass = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.COMPLETED:
      return 'bg-green-500/10 text-green-400';
    case TransactionStatus.PENDING:
      return 'bg-yellow-500/10 text-yellow-400';
    case TransactionStatus.FAILED:
      return 'bg-red-500/10 text-red-400';
    default:
      return 'bg-gray-500/10 text-gray-400';
  }
};

const getTypeIcon = (type: TransactionType) => {
  const baseClass = "w-5 h-5";
  switch(type) {
    case TransactionType.RECEIVE:
    case TransactionType.BUY:
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${baseClass} text-green-400`}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
    case TransactionType.SEND:
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${baseClass} text-red-400`}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>
    case TransactionType.SWAP:
       return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${baseClass} text-blue-400`}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
  }
}

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const Icon = transaction.asset.icon;
  return (
    <tr className="border-b border-border hover:bg-secondary">
      <td className="p-4">
        <div className="flex items-center gap-4">
            <div className="p-2 bg-secondary rounded-full">
                {getTypeIcon(transaction.type)}
            </div>
            <div>
              <p className="font-semibold text-white">{transaction.type}</p>
              <p className="text-sm text-gray-400">{transaction.date}</p>
            </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Icon className="w-8 h-8" />
          <span className="font-semibold text-white">{transaction.asset.name}</span>
        </div>
      </td>
      <td className="p-4">
        <p className="font-semibold text-white font-mono">{transaction.amountCrypto.toFixed(4)} {transaction.asset.ticker}</p>
        <p className="text-sm text-gray-400 font-mono">${transaction.amountUSD.toLocaleString()}</p>
      </td>
      <td className="p-4">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(transaction.status)}`}>
          {transaction.status}
        </span>
      </td>
    </tr>
  );
};


const Trade: React.FC = () => {
  return (
    <div>
      <Header title="Trade History" />
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-secondary">
              <tr>
                <th className="p-4 font-semibold text-gray-300">Type / Date</th>
                <th className="p-4 font-semibold text-gray-300">Asset</th>
                <th className="p-4 font-semibold text-gray-300">Amount</th>
                <th className="p-4 font-semibold text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map(tx => (
                <TransactionRow key={tx.id} transaction={tx} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Trade;