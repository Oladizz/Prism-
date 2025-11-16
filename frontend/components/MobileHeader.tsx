import React from 'react';
import { useLocation } from 'react-router-dom';
import { Logo } from './Sidebar.tsx';

const getTitleFromPath = (pathname: string): string => {
    const route = pathname.split('/')[1];
    if (!route) return 'Dashboard';
    if (route === 'nft') return 'NFT Gallery';
    return route.charAt(0).toUpperCase() + route.slice(1);
};

const MobileHeader: React.FC = () => {
    const location = useLocation();
    const title = getTitleFromPath(location.pathname);

    return (
        <header className="md:hidden relative flex items-center p-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
            <Logo />
            <h1 className="text-lg font-bold text-white absolute left-1/2 -translate-x-1/2">{title}</h1>
        </header>
    );
};

export default MobileHeader;