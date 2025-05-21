
import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import DesktopSidebar from '@/components/desktop-sidebar';
import BottomNav from '@/components/bottom-nav';
import { SidebarInset } from '@/components/ui/sidebar';
import React from 'react'; // Import React for Fragment
import Link from 'next/link'; // Import Link for the portfolio link

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'QuoteCraft',
  description: 'Inspiration and humor, one flip at a time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}>
        <div className="fixed top-0 left-0 right-0 z-50 text-center text-xs py-1 bg-card text-primary shadow-sm">
          Developed by <Link href="https://shubhamcoder.netlify.app" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline text-primary">Shubham</Link>
        </div>
        
        {/* Add padding-top to this wrapper to offset the fixed header height */}
        <div className="pt-6"> 
          <SidebarProvider defaultOpen={false}>
            <React.Fragment> {/* Wrapper to ensure SidebarProvider receives a single child element */}
              <div className="flex min-h-screen w-full">
                <DesktopSidebar />
                <SidebarInset className="flex-1 flex flex-col"> {/* Ensure SidebarInset is a flex container */}
                  {children}
                </SidebarInset>
              </div>
              <BottomNav />
            </React.Fragment>
          </SidebarProvider>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
