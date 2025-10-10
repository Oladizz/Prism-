import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { DashboardIcon, PortfolioIcon, NftIcon, TradeIcon, ProfileIcon, MarketsIcon } from './icons/NavigationIcons.tsx';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { path: '/transactions', label: 'History', icon: TradeIcon },
  { path: '/nft', label: 'NFTs', icon: NftIcon },
  { path: '/markets', label: 'Markets', icon: MarketsIcon },
  { path: '/profile', label: 'Settings', icon: ProfileIcon },
];

const BottomNavBar: React.FC = () => {
    const location = useLocation();

    // The portfolio page is still accessible, but not from the main nav
    // We want to highlight the portfolio icon if we are on any portfolio-related page
    const isPortfolioActive = location.pathname.startsWith('/portfolio');

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-secondary backdrop-blur-lg border-t border-border z-40 rounded-t-3xl">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`relative flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-200 transform active:scale-90 ${isActive ? 'text-accent' : 'text-gray-400 hover:text-white'}`}
                        >
                            <item.icon className="h-6 w-6" />
                            <span className="text-xs font-medium">{item.label}</span>
                            {isActive && <div className="absolute top-0 h-1 w-8 bg-accent rounded-full shadow-[0_0_8px_#9F00FF]"></div>}
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNavBar;