import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.tsx';
import MobileHeader from './components/MobileHeader.tsx';
import Dashboard from './pages/Dashboard.tsx';
import AssetDetail from './pages/AssetDetail.tsx';
import Transactions from './pages/Transactions.tsx';
import Markets from './pages/Markets.tsx';
import NFT from './pages/NFT.tsx';
import Settings from './pages/Settings.tsx';
import { ToastProvider } from './components/ToastProvider.tsx';
import BottomNavBar from './components/BottomNavBar.tsx';
import { WalletProvider } from './contexts/WalletContext.tsx';
import { ProfileProvider } from './contexts/ProfileContext.tsx';
import Guide from './components/Guide.tsx';

const MainApp: React.FC = () => {
  const location = useLocation();
  return (
    <div className="flex h-screen bg-transparent text-gray-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 flex flex-col min-h-0 bg-transparent md:m-2 md:rounded-4xl">
          <MobileHeader />
          <div 
            key={location.pathname}
            className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 sm:pb-6 lg:pb-8 page-container-animate"
          >
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/portfolio" element={<Navigate to="/portfolio/ethereum" replace />} />
              <Route path="/portfolio/:chain" element={<AssetDetail />} />
              <Route path="/portfolio/:chain/:assetId" element={<AssetDetail />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/nft" element={<NFT />} />
              <Route path="/profile" element={<Settings />} />
            </Routes>
          </div>
        </main>
        <BottomNavBar />
        <Guide />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <WalletProvider>
        <ProfileProvider>
          <HashRouter>
            <MainApp />
          </HashRouter>
        </ProfileProvider>
      </WalletProvider>
    </ToastProvider>
  );
};

export default App;