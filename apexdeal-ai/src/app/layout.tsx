import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'ApexDeal AI | Smarter Deals, Better Finds', description: 'Discover curated deals from trusted stores and shop smarter.', robots: { index: true, follow: true } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
