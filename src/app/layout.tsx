
import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import DesktopSidebar from '@/components/desktop-sidebar';
import BottomNav from '@/components/bottom-nav';
import { SidebarInset } from '@/components/ui/sidebar';
import React from 'react'; // Import React for Fragment

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
        <Toaster />
      </body>
    </html>
  );
}
