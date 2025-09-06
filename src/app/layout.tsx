import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ARGUS Glass - AI Navigation Assistant',
  description: 'AI-Powered Offline Navigation and Text-Reading Assistant for Visually Impaired Individuals',
  keywords: ['accessibility', 'navigation', 'AI', 'OCR', 'vision assistance', 'humanitarian technology'],
  authors: [{ name: 'ARGUS Glass Team' }],
  creator: 'ARGUS Glass',
  publisher: 'ARGUS Glass',
  robots: 'index, follow',
  openGraph: {
    title: 'ARGUS Glass - AI Navigation Assistant',
    description: 'AI-Powered Offline Navigation and Text-Reading Assistant for Visually Impaired Individuals',
    type: 'website',
    locale: 'en_US',
    siteName: 'ARGUS Glass',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARGUS Glass - AI Navigation Assistant',
    description: 'AI-Powered Offline Navigation and Text-Reading Assistant for Visually Impaired Individuals',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#3b82f6',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ARGUS Glass',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ARGUS Glass" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="root">
          {children}
        </div>
        
        {/* Accessibility enhancements */}
        <div id="announcements" aria-live="polite" aria-atomic="true" className="sr-only" />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
        

      </body>
    </html>
  );
}