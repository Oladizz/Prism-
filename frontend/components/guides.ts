import type { FC, SVGProps } from 'react';
import { DashboardIcon, PortfolioIcon, TradeIcon, NftIcon, ProfileIcon, MarketsIcon } from './icons/NavigationIcons.tsx';

export interface GuideStep {
    icon: FC<SVGProps<SVGSVGElement>>;
    title: string;
    content: string;
}

export const guides: Record<string, GuideStep[]> = {
    dashboard: [
        {
            icon: DashboardIcon,
            title: "Dashboard Overview",
            content: "This is your mission control. Get a high-level overview of your portfolio performance, recent activity, and market movers."
        },
        {
            icon: PortfolioIcon,
            title: "Total Balance & Performance",
            content: "Your total portfolio value is displayed at the top, along with today's gains or losses. The main chart tracks your portfolio's value over time."
        },
        {
            icon: TradeIcon,
            title: "Your Assets",
            content: "Quickly see all the assets you hold, their current price, and a mini-chart of their recent performance. Click on any asset to see more details."
        },
    ],
    transactions: [
        {
            icon: TradeIcon,
            title: "Transaction History",
            content: "This page lists every transaction across all your wallets and chains. It's your complete financial ledger."
        },
        {
            icon: DashboardIcon,
            title: "Search & Filter",
            content: "Use the powerful search bar and filter dropdowns at the top to find specific transactions. You can filter by date, wallet, chain, asset, type, and status."
        },
        {
            icon: ProfileIcon,
            title: "Apply & Clear",
            content: "After selecting your filters, click 'Apply' to see the results. Use 'Clear' to reset the view and see all transactions again."
        },
    ],
    nft: [
        {
            icon: NftIcon,
            title: "Your NFT Gallery",
            content: "Welcome to your personal gallery. All of your unique digital collectibles are displayed here."
        },
        {
            icon: DashboardIcon,
            title: "Find Your Favorites",
            content: "Easily find specific NFTs using the search bar. You can also filter your collection by name or sort them to organize your view."
        },
    ],
    markets: [
        {
            icon: MarketsIcon,
            title: "Market Pulse",
            content: "Stay on top of the crypto market. This page gives you a real-time snapshot of market trends, sentiment, and top-performing assets."
        },
        {
            icon: DashboardIcon,
            title: "Market Overview",
            content: "The main chart shows the total cryptocurrency market cap. The Fear & Greed Index is now available and helps you gauge the current market sentiment."
        },
        {
            icon: NftIcon,
            title: "Trending Assets",
            content: "Discover what's hot. See which cryptocurrencies are the top gainers and losers, and check out trending NFT collections."
        },
    ],
    settings: [
        {
            icon: ProfileIcon,
            title: "Settings & Preferences",
            content: "This is where you can customize your Prism experience. Each section is collapsible to keep things tidy."
        },
        {
            icon: DashboardIcon,
            title: "Customize Your View",
            content: "Adjust appearance settings like dark mode and set your preferred display currency for all financial values in the app."
        },
        {
            icon: PortfolioIcon,
            title: "Manage Wallets & Profile",
            content: "Add or remove your wallets and update your personal profile information. Don't forget to hit 'Save Changes' when you're done!"
        },
    ],
    portfolio: [
         {
            icon: PortfolioIcon,
            title: "Asset Deep Dive",
            content: "This is your detailed view for a single asset. Use the dropdown at the top to switch between different assets in your portfolio."
        },
        {
            icon: DashboardIcon,
            title: "Asset & Network Stats",
            content: "See the current value and quantity you hold of the selected asset. Below, find a summary of all your activity on that asset's blockchain network."
        },
        {
            icon: TradeIcon,
            title: "Value Over Time & History",
            content: "The chart tracks your holding's value based on historical market data. The table at the bottom shows every transaction you've made with this specific asset."
        },
    ]
};
