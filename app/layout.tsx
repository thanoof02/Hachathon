import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/nunito/500.css';
import '@fontsource/nunito/600.css';
import type { Metadata } from 'next';
import './globals.css';
import './expressive.css';
export const metadata: Metadata = {title:'Therapulse · Feel the pulse of your mind.',description:'Check in. Calm down. Get the right help. A private space for your wellbeing.'};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en" suppressHydrationWarning><body>{children}</body></html>; }


