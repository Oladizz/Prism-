import React from 'react';

// --- Chain & Wallet Icons ---
export const EthereumIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 22.5L12 16.5M12 22.5L5.25 12.75M12 22.5L18.75 12.75M12 16.5L5.25 12.75M12 16.5L18.75 12.75M5.25 12.75L12 1.5L18.75 12.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
export const SolanaIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M4.125 19.875H19.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.125 15.375H19.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.125 10.875H19.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.125 6.375H19.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
export const PolygonIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M7.875 4.875L12 2.25L16.125 4.875V10.125L12 12.75L7.875 10.125V4.875Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12.75L7.875 15.375L3.75 12.75V7.5L7.875 4.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12.75L16.125 15.375L20.25 12.75V7.5L16.125 4.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
export const MetaMaskIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M19.5 9.375V15.75L12 21.75L4.5 15.75V9.375L12 3.375L19.5 9.375Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M15 9.375L12 11.25L9 9.375" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 11.25V17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
export const PhantomIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12.75C9 12.75 9.75 15 12 15C14.25 15 15 12.75 15 12.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.125 10.125V10.135" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.875 10.125V10.135" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// --- Feature Icons ---
export const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const InsightsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
);

export const SpreadsheetIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m0 0v2.25m0-2.25h3.75m-3.75 0H5.25m11.25 0H15m0 0v2.25m0-2.25V5.25m0 0H9.75M15 5.25H18.75m0 0V15m0 0v2.25m0-2.25h-3.75M15 15h3.75M9 15h3.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v18h16.5V3H3.75z" />
    </svg>
);

// --- Publication Icons ---
export const CoinDeskIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 120 24" fill="currentColor" {...props}><path d="M0 24V0h23.018v24H0zm61.59 0V0h9.207v24h-9.207zm-22.195 0V0h2.93L51.532 24h-3.924L39.4 14.59v9.41H35.37v-9.4L26.163 24h-3.923L31.447 0h3.023l-9.3 14.6V0h-4.025v24zm42.39 0V0h11.721c6.552 0 11.814 5.262 11.814 11.814 0 6.552-5.262 11.814-11.814 11.814H81.785zm4.024-4.023h7.697c4.2 0 7.79-3.59 7.79-7.79s-3.59-7.79-7.79-7.79h-7.697v15.58zM108.977 0v24h2.93l9.01-24h-3.023l-7.495 19.98V0h-1.422z"></path></svg>
);
export const DecryptIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 24" fill="currentColor" {...props}><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c3.12 0 5.94-1.2 7.96-3.15L12 12V0zm0 24c6.627 0 12-5.373 12-12S18.627 0 12 0v12l7.96 8.85C17.94 22.8 15.12 24 12 24zM32.89 1.15h5.13v21.7h-5.13zM45.19 1.15h12.6c6.28 0 10.95 4.54 10.95 10.95S64.07 23 57.79 23h-12.6zm5.13 4.29v13.27h6.6c3.41 0 5.82-2.39 5.82-6.6s-2.41-6.67-5.82-6.67h-6.6zM76.5 1.15h5.13v17.41h8.21v4.29H76.5zM94.81 1.15c6.28 0 10.95 4.54 10.95 10.95S101.09 23 94.81 23c-6.28 0-10.95-4.54-10.95-10.95S88.53 1.15 94.81 1.15zm0 4.29c-3.41 0-5.82 2.39-5.82 6.6s2.41 6.67 5.82 6.67c3.41 0 5.82-2.39 5.82-6.67s-2.41-6.6-5.82-6.6z"></path></svg>
);
export const BlockworksIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 160 24" fill="currentColor" {...props}><path d="M.001 24V0h23.513c7.222 0 13.041 5.82 13.041 13.041v7.194c0 2.083-1.68 3.764-3.764 3.764H.001zm5.002-5.002h18.51c1.528 0 2.76-1.232 2.76-2.76v-8.203c0-4.444-3.6-8.04-8.04-8.04H5.003v19.002zM45.473 1.11h5.002v21.78h-5.002zM61.077.917h13.04c6.805 0 12.28 5.474 12.28 11.96 0 6.485-5.475 11.96-12.28 11.96h-13.04zm5.003 4.444v13.04h7.194c4.028 0 7.222-3.194 7.222-7.11 0-3.917-3.194-7.11-7.222-7.11h-7.194zM95.038.917h23.63c.694 0 1.25.556 1.25 1.25v19.583c0 .695-.555 1.25-1.25 1.25H95.038zm5.002 4.444v13.04h13.04V5.36h-13.04zM126.752.917h5.002v17.498h8.89v4.444h-13.89zM143.02 1.11h5.002v21.78h-5.002zM153.245.917l11.11 21.944h-5.277L153.245 9.86l-5.834 13.002h-5.277z"></path></svg>
);
export const TheBlockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 130 24" fill="currentColor" {...props}><path d="M0 24V0h24v24H0zM32 24V0h5v24h-5zM45 24V0h22c7.732 0 14 6.268 14 14v5c0 2.76-2.24 5-5 5H45zm5-19v14h16c2.21 0 4-1.79 4-4v-5c0-5.523-4.477-10-10-10H50zM89 24V0h22c7.732 0 14 6.268 14 14s-6.268 14-14 14H89zm5-19v14h16c4.97 0 9-4.03 9-9s-4.03-9-9-9H94z"></path></svg>
);
export const CointelegraphIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 200 24" fill="currentColor" {...props}><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c3.313 0 6.295-1.343 8.485-3.515L12 12V0zm12 12c0 6.627-5.373 12-12 12-3.313 0-6.295-1.343-8.485-3.515L12 12V0c6.627 0 12 5.373 12 12zM32.89 1.11h5.13v21.78h-5.13zM45.19 1.11h12.6c6.28 0 10.95 4.54 10.95 10.95S64.07 22.89 57.79 22.89h-12.6zm5.13 4.29v13.27h6.6c3.41 0 5.82-2.39 5.82-6.6s-2.41-6.67-5.82-6.67h-6.6zM76.5 1.11h5.13v17.41h8.21v4.29H76.5zM94.81 1.11c6.28 0 10.95 4.54 10.95 10.95S101.09 22.89 94.81 22.89s-10.95-4.54-10.95-10.95S88.53 1.11 94.81 1.11zm0 4.29c-3.41 0-5.82 2.39-5.82 6.6s2.41 6.67 5.82 6.67c3.41 0 5.82-2.39 5.82-6.67s-2.41-6.6-5.82-6.6zM113.12 1.11h5.13v21.78h-5.13zM125.32 1.11h5.13v17.41h8.21v4.29h-13.34zM146.66 1.11H159c6.28 0 10.95 4.54 10.95 10.95s-4.67 10.83-10.95 10.83h-7.21v-4.29h7.21c3.41 0 5.82-2.39 5.82-6.54s-2.41-6.67-5.82-6.67h-7.34zM177.89 1.11h5.13v21.78h-5.13zM189.98 1.11h5.13v17.41h8.21v4.29h-13.34z"></path></svg>
);

// --- Testimonial Icons ---
export const QuoteIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="currentColor" viewBox="0 0 32 32" {...props}>
        <path d="M12.91,20.33a2.23,2.23,0,0,1-2.22,2.22A2.18,2.18,0,0,1,8.47,20.3V14.8H3.33a1.11,1.11,0,0,1-1.11-1.11V6.22A1.11,1.11,0,0,1,3.33,5.11H11.8a1.11,1.11,0,0,1,1.11,1.11Zm15.56,0a2.22,2.22,0,0,1-2.23,2.22,2.17,2.17,0,0,1-2.22-2.22V14.8H18.89a1.11,1.11,0,0,1-1.11-1.11V6.22A1.11,1.11,0,0,1,18.89,5.11h8.45a1.11,1.11,0,0,1,1.11,1.11Z"/>
    </svg>
);

// --- Social Icons ---
export const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);
export const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v19.056c0 1.368-1.104 2.472-2.46 2.472h-15.08c-1.356 0-2.46-1.104-2.46-2.472v-19.056c0-1.368 1.104-2.472 2.46-2.472h15.08zm-4.632 15.672c2.652-.024 3.324-1.62 3.324-1.62s-.864.648-1.524.924c.108-.3.12-.456.12-.624 0-1.092-.84-1.944-1.92-1.944-1.08 0-1.908.852-1.908 1.944 0 .18.012.336.12.624-.66.276-1.524-.924-1.524-.924s.672 1.596 3.324 1.62zm-6.012-1.62s-.864.648-1.524.924c.108-.3.12-.456.12-.624 0-1.092-.84-1.944-1.92-1.944-1.08 0-1.908.852-1.908 1.944 0 .18.012.336.12.624-.66.276-1.524-.924-1.524-.924s.672 1.596 3.324 1.62z" />
    </svg>
);