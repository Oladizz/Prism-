import React from 'react';
import { Logo } from '../components/Sidebar.tsx';
import { EthereumIcon, SolanaIcon, PolygonIcon, MetaMaskIcon, PhantomIcon, ShieldIcon, InsightsIcon, TwitterIcon, DiscordIcon, CoinDeskIcon, DecryptIcon, TheBlockIcon, BlockworksIcon, CointelegraphIcon, QuoteIcon, SpreadsheetIcon } from '../components/icons/LandingIcons.tsx';
import { DashboardIcon, NftIcon, TradeIcon } from '../components/icons/NavigationIcons.tsx';
import { ASSETS } from '../constants.ts';

interface LandingProps {
  onLaunch: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-card border border-border rounded-3xl p-6 text-center hover-glow backdrop-blur-lg">
        <div className="w-12 h-12 bg-secondary text-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{children}</p>
    </div>
);

const FeaturedInSection: React.FC = () => (
    <div className="py-12">
        <div className="container mx-auto px-6">
            <p className="text-center text-sm font-semibold text-gray-500 mb-6">AS FEATURED IN</p>
            <div className="flex justify-center items-center gap-8 md:gap-12 flex-wrap">
                <CoinDeskIcon className="h-5 text-gray-500 hover:text-gray-300 transition-colors" />
                <DecryptIcon className="h-5 text-gray-500 hover:text-gray-300 transition-colors" />
                <BlockworksIcon className="h-5 text-gray-500 hover:text-gray-300 transition-colors" />
                <TheBlockIcon className="h-5 text-gray-500 hover:text-gray-300 transition-colors" />
                <CointelegraphIcon className="h-5 text-gray-500 hover:text-gray-300 transition-colors" />
            </div>
        </div>
    </div>
);

const BeforeAfterSection: React.FC = () => (
    <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-section-fade-in">
                <h2 className="text-3xl md:text-4xl font-bold text-white">From Chaos to Clarity</h2>
                <p className="max-w-xl mx-auto mt-3 text-gray-400">Stop the madness. Prism is your single source of truth.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center animate-section-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="bg-card border-red-500/20 border rounded-3xl p-8 backdrop-blur-lg">
                    <h3 className="text-2xl font-bold text-white mb-4">Before Prism</h3>
                    <p className="text-gray-400 mb-6">Juggling multiple wallets, exchanges, and spreadsheets just to see what you own. Sound familiar?</p>
                    <div className="relative h-48 flex items-center justify-center">
                        <div className="absolute top-4 left-8 animate-pulse"><MetaMaskIcon className="h-12 w-12 text-gray-400" /></div>
                        <div className="absolute top-16 right-4 animate-pulse delay-75"><PhantomIcon className="h-10 w-10 text-gray-400" /></div>
                        <div className="absolute bottom-8 left-1/4 animate-pulse delay-150"><TradeIcon className="h-12 w-12 text-gray-400" /></div>
                        <div className="absolute bottom-4 right-1/3 animate-pulse delay-200"><SpreadsheetIcon className="h-10 w-10 text-gray-400" /></div>
                        <p className="text-3xl text-red-500 font-bold">?</p>
                    </div>
                </div>
                <div className="bg-card border-accent/20 border rounded-3xl p-8 backdrop-blur-lg">
                    <h3 className="text-2xl font-bold text-white mb-4">With Prism</h3>
                    <p className="text-gray-400 mb-6">One dashboard. Every asset. Total clarity. Welcome to portfolio management, simplified.</p>
                    <div className="relative h-48 flex items-center justify-center bg-secondary/50 rounded-2xl">
                       <div className="flex items-center gap-4">
                            <Logo className="opacity-80" />
                       </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);


const testimonials = [
    {
        quote: "Prism is a game-changer. I went from spending an hour a day checking different apps to just five minutes. I finally have a clear picture of my entire portfolio.",
        name: "Alex Johnson",
        title: "DeFi Enthusiast",
        avatar: "https://i.pravatar.cc/40?u=alex"
    },
    {
        quote: "As an NFT collector, my portfolio was a mess. Prism's gallery is not only beautiful but essential. I discovered assets I forgot I even had!",
        name: "Casey Lee",
        title: "NFT Collector",
        avatar: "https://i.pravatar.cc/40?u=casey"
    },
     {
        quote: "The simplicity is unmatched. I can track my long-term holds and my degen plays all in one place without the headache. The security focus gives me peace of mind.",
        name: "Samira Khan",
        title: "Crypto Investor",
        avatar: "https://i.pravatar.cc/40?u=samira"
    }
];

const TestimonialCard: React.FC<typeof testimonials[0]> = ({ quote, name, title, avatar }) => (
    <div className="bg-card border border-border rounded-3xl p-6 flex flex-col justify-between hover-glow backdrop-blur-lg">
        <div>
            <QuoteIcon className="w-8 h-8 text-accent/50 mb-4" />
            <p className="text-gray-300">"{quote}"</p>
        </div>
        <div className="flex items-center gap-3 mt-6">
            <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
            <div>
                <p className="font-semibold text-white">{name}</p>
                <p className="text-sm text-gray-400">{title}</p>
            </div>
        </div>
    </div>
);

const TickerSection: React.FC = () => {
    const tickerItems = ASSETS.slice(0, 10);
    return (
        <div className="py-12 relative overflow-hidden bg-background">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10"></div>
            <div className="flex">
                <div className="flex-shrink-0 flex items-center animate-ticker-scroll">
                    {[...tickerItems, ...tickerItems].map((asset, index) => {
                        const isPositive = asset.change24h >= 0;
                        return (
                            <div key={index} className="flex items-center gap-2 px-6">
                                <span className="text-sm font-semibold text-gray-400">{asset.ticker}</span>
                                <span className="text-sm font-mono text-white">${asset.price.toLocaleString('en-US')}</span>
                                <span className={`text-sm font-mono ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                    {isPositive ? '▲' : '▼'} {Math.abs(asset.change24h).toFixed(2)}%
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


const Landing: React.FC<LandingProps> = ({ onLaunch }) => {
  return (
    <div className="bg-background text-gray-300">
      <header className="fixed top-0 left-0 right-0 z-30 bg-background/50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
          </nav>
          <button onClick={onLaunch} className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-accent-hover transition-colors">
            Launch App
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 text-center overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="animate-section-fade-in" style={{ animationDelay: '0.1s' }}>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                        The Command Center for <br/> Your <span className="text-accent">Digital Assets</span>.
                    </h1>
                    <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-400">
                        Track tokens, manage DeFi, and showcase NFTs across all your wallets in one beautifully unified, secure interface.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <button onClick={onLaunch} className="cta-glow-button bg-accent text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                            Launch App
                        </button>
                    </div>
                </div>

                <div className="animate-section-fade-in" style={{ animationDelay: '0.3s' }}>
                    <img src="https://i.postimg.cc/kXyVBr84/prism-hero-visual.png" alt="Prism Dashboard Preview" className="max-w-4xl mx-auto mt-12" />
                    <div className="mt-8 flex justify-center items-center gap-6">
                        <p className="text-sm text-gray-500 font-semibold">Supports:</p>
                        <div className="flex items-center gap-4">
                            <EthereumIcon className="h-6 w-6 text-gray-400" />
                            <SolanaIcon className="h-6 w-6 text-gray-400" />
                            <PolygonIcon className="h-6 w-6 text-gray-400" />
                            <MetaMaskIcon className="h-6 w-6 text-gray-400" />
                            <PhantomIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <FeaturedInSection />

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-section-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Everything You Own, All in One Place</h2>
              <p className="max-w-xl mx-auto mt-3 text-gray-400">Prism eliminates the clutter, giving you the clarity to make smarter decisions.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 animate-section-fade-in" style={{ animationDelay: '0.2s' }}>
              <FeatureCard icon={<DashboardIcon className="w-6 h-6" />} title="Unified Dashboard">
                See your complete net worth at a glance. We aggregate all your assets from every wallet and chain into one powerful view.
              </FeatureCard>
              <FeatureCard icon={<NftIcon className="w-6 h-6" />} title="Beautiful NFT Gallery">
                Finally, a worthy home for your digital art. Showcase and manage your entire NFT collection in a gallery it deserves.
              </FeatureCard>
              <FeatureCard icon={<InsightsIcon className="w-6 h-6" />} title="Actionable Insights">
                Effortlessly track your P&L and transaction history with powerful filtering and search. Understand your portfolio like never before.
              </FeatureCard>
            </div>
          </div>
        </section>
        
        <BeforeAfterSection />

        {/* Security Section */}
        <section id="security" className="py-20">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 animate-section-fade-in">
                    <div className="flex-shrink-0 text-accent">
                         <ShieldIcon className="w-24 h-24" />
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Your Keys, Your Crypto. Always.</h2>
                        <p className="mt-4 text-gray-400">
                            Security is our absolute priority. Prism is a non-custodial application, meaning we never have access to your private keys or your funds. You remain in complete control, always. Our platform is built on battle-tested security principles to keep your data safe and private.
                        </p>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12 animate-section-fade-in">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Loved by Investors and Collectors</h2>
                    <p className="max-w-xl mx-auto mt-3 text-gray-400">Don't just take our word for it. Here's what our users are saying.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 animate-section-fade-in" style={{ animationDelay: '0.2s' }}>
                    {testimonials.map((testimonial, i) => <TestimonialCard key={i} {...testimonial} />)}
                </div>
            </div>
        </section>

        <TickerSection />

        {/* Final CTA Section */}
        <section className="py-20">
            <div className="container mx-auto px-6 text-center animate-section-fade-in">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Take Control of Your Crypto?</h2>
                <p className="max-w-xl mx-auto mt-3 text-gray-400">Stop juggling apps and start building your future. Launch Prism and unlock the full picture of your digital wealth in seconds.</p>
                <div className="mt-8">
                     <button onClick={onLaunch} className="cta-glow-button bg-accent text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                        Get Started for Free
                    </button>
                </div>
            </div>
        </section>
      </main>

      <footer className="border-t border-border">
          <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
              <div>
                 <Logo />
                 <p className="text-sm text-gray-500 mt-2">&copy; {new Date().getFullYear()} Prism by 𝕆𝕃𝔸𝔻𝕀ℤℤ. All rights reserved.</p>
              </div>
              <div className="flex items-center gap-4 mt-6 md:mt-0">
                  <a href="#" className="text-gray-400 hover:text-white"><TwitterIcon className="w-6 h-6" /></a>
                  <a href="#" className="text-gray-400 hover:text-white"><DiscordIcon className="w-6 h-6" /></a>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default Landing;