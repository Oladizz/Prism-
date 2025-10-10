import React from 'react';
import { NavLink } from 'react-router-dom';
import { DashboardIcon, PortfolioIcon, TradeIcon, NftIcon, ProfileIcon, HelpIcon, LogoutIcon, MarketsIcon } from './icons/NavigationIcons.tsx';

const mainNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { path: '/transactions', label: 'Transactions', icon: TradeIcon },
  { path: '/nft', label: 'NFT Gallery', icon: NftIcon },
  { path: '/markets', label: 'Markets', icon: MarketsIcon },
  { path: '/profile', label: 'Settings', icon: ProfileIcon },
];

const secondaryNavItems = [
    { path: '#', label: 'Help & Support', icon: HelpIcon },
    { path: '#', label: 'Logout', icon: LogoutIcon },
]

export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`flex items-center gap-2 ${className}`}>
        <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-xl font-bold text-white">Prism</span>
    </div>
);


const UserProfile: React.FC = () => (
    <div className="flex items-center gap-3 px-2 mb-8">
        <div className="relative">
            <img 
                src="https://i.pravatar.cc/40?u=satoshi" 
                alt="Satoshi Nakamoto" 
                className="w-10 h-10 rounded-full border-2 border-accent/50 avatar-glow"
            />
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-black"></span>
        </div>
        <div>
            <p className="font-semibold text-white">Satoshi Nakamoto</p>
            <p className="text-sm text-gray-400">satoshi@nakamoto.com</p>
        </div>
    </div>
);

const NavItem: React.FC<{ path: string, label: string, icon: React.FC<any> }> = ({ path, label, icon: Icon }) => {
    return (
        <NavLink
            to={path}
            className={({ isActive }) => `
                relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-accent/20 text-white font-semibold active-link-indicator' 
                  : 'text-gray-400 hover:bg-card hover:text-white transform hover:-translate-y-px'}
            `}
        >
            <Icon className="h-6 w-6 flex-shrink-0" />
            <span className="truncate">{label}</span>
        </NavLink>
    );
};


const Sidebar: React.FC = () => {
  return (
      <aside className="w-64 bg-secondary backdrop-blur-lg p-4 flex-col border-r border-border hidden md:flex">
        <Logo className="px-2 mb-10" />
        <UserProfile />
        
        <nav className="flex flex-col gap-2 flex-grow">
          {mainNavItems.map((item) => <NavItem key={item.path} {...item} />)}
        </nav>
        
        <nav className="flex flex-col gap-2 pt-4 border-t border-border">
            {secondaryNavItems.map((item) => <NavItem key={item.label} {...item} />)}
        </nav>
      </aside>
  );
};

export default Sidebar;