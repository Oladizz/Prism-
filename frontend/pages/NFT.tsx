import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header.tsx';
import { getNfts } from '../services/api';
import { Nft } from '../types.ts';
import Skeleton from '../components/Skeleton.tsx';
import { useToast } from '../hooks/useToast.ts';
import { SearchIcon } from '../components/icons/DetailIcons.tsx';
import { useWallets } from '../contexts/WalletContext.tsx';
import { Link } from 'react-router-dom';

import { NftIcon } from '../components/icons/NavigationIcons.tsx';

const NftCard: React.FC<{ nft: Nft }> = ({ nft }) => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-xl hover:border-accent/50 backdrop-blur-lg">
      <div className="aspect-square bg-secondary overflow-hidden">
        {nft.imageUrl ? (
          <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <NftIcon className="w-1/2 h-1/2 text-gray-500" />
          </div>
        )}
      </div>
      <div className="p-2">
        <p className="text-xs text-accent font-semibold truncate">{nft.collection}</p>
        <p className="text-sm font-bold text-white mt-0.5 truncate">{nft.name}</p>
      </div>
    </div>
  );
};

const NftCardSkeleton: React.FC = () => {
    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-2">
                <Skeleton className="h-3 w-1/2 mb-1" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
    );
};

const NFT: React.FC = () => {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();
  const { wallets } = useWallets();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('All Collections');
  const [sortBy, setSortBy] = useState('name-asc');

  useEffect(() => {
    const fetchNfts = async () => {
        if (wallets.length === 0) {
            setIsLoading(false);
            return;
        }
      try {
        const chain = 'ethereum'; // Assuming all wallets are on ethereum for now
        const nftPromises = wallets.map(wallet => getNfts(chain, wallet.address));
        const nftResults = await Promise.all(nftPromises);
        const allNfts = nftResults.flat();
        setNfts(allNfts);
        addToast({
            type: 'success',
            title: 'NFTs Loaded',
            message: 'Your gallery has been updated.',
        });
      } catch (error) {
        addToast({
            type: 'error',
            title: 'Error',
            message: 'Failed to load NFTs.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchNfts();
  }, [wallets, addToast]);

  const collections = useMemo(() => ['All Collections', ...Array.from(new Set(nfts.map(nft => nft.collection)))], [nfts]);

  const filteredAndSortedNfts = useMemo(() => {
    return nfts
      .filter(nft => {
        const matchesCollection = selectedCollection === 'All Collections' || nft.collection === selectedCollection;
        const matchesSearch = searchTerm === '' ||
          nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nft.collection.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCollection && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
  }, [nfts, searchTerm, selectedCollection, sortBy]);

  if (wallets.length === 0 && !isLoading) {
    return (
        <div>
            <Header title="NFT Gallery" />
            <div className="text-center py-20 bg-card border border-border rounded-3xl mt-6 backdrop-blur-lg">
                <h2 className="text-2xl font-bold text-white">No Wallets Found</h2>
                <p className="text-gray-400 mt-2">Add a wallet in the settings to see your NFTs.</p>
                <Link to="/profile" className="mt-6 inline-block bg-accent text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-accent-hover transition-colors">Go to Settings</Link>
            </div>
        </div>
    );
  }


  return (
    <div>
      <Header title="NFT Gallery" />
      
      {/* Filter and Sort Controls */}
      <div className="mb-6 bg-card border border-border rounded-3xl p-4 flex flex-col sm:flex-row items-center gap-4 backdrop-blur-lg">
          <div className="relative w-full sm:flex-grow">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon className="w-5 h-5 text-gray-400" /></span>
              <input
                  type="text"
                  placeholder="Search by name or collection..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
              />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-1/2 sm:w-48">
                  <select
                      value={selectedCollection}
                      onChange={(e) => setSelectedCollection(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                      }}
                  >
                      {collections.map(collection => <option key={collection} value={collection}>{collection}</option>)}
                  </select>
              </div>
              <div className="w-1/2 sm:w-48">
                  <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                      }}
                  >
                      <option value="name-asc">Name: A-Z</option>
                      <option value="name-desc">Name: Z-A</option>
                  </select>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading 
          ? Array.from({ length: 10 }).map((_, i) => <NftCardSkeleton key={i} />)
          : filteredAndSortedNfts.length > 0
            ? filteredAndSortedNfts.map(nft => <NftCard key={nft.id} nft={nft} />)
            : <div className="col-span-full text-center py-16">
                <h3 className="text-xl font-semibold text-white">No NFTs Found</h3>
                <p className="text-gray-400 mt-2">Try adjusting your search or filter criteria.</p>
              </div>
        }
      </div>
    </div>
  );
};

export default NFT;