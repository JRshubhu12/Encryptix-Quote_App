
'use client';

import { Home, Bookmark, Share2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const { toast } = useToast();
  const pathname = usePathname();

  const handleShareClick = () => {
    const appUrl = 'https://bit.ly/QuoteCraft'; // Updated to Bitly link
    const portfolioUrl = 'https://shubhamcoder.netlify.app/';
    
    const shareData = {
      title: `QuoteCraft by Shubham - Inspiration & Humor`,
      text: `Explore QuoteCraft for inspiring quotes and fun jokes!\nDeveloped by Shubham: ${portfolioUrl}\n\nCheck it out: ${appUrl}`,
      url: appUrl,
    };

    if (navigator.share) {
      navigator.share(shareData)
      .then(() => console.log('Successful share'))
      .catch((error) => {
        console.log('Error sharing', error);
        // Check if the error is an AbortError (user cancelled share)
        if (error.name === 'AbortError') {
          console.log('Share cancelled by user.');
          // Optionally, don't show a toast if the user cancelled
        } else {
          toast({ variant: 'destructive', title: 'Share Failed', description: 'Could not share at this time.' });
        }
      });
    } else {
        toast({ title: 'Share App', description: 'Share functionality not available on this browser. You can copy the URL.' });
    }
  };

  const handleSettingsClick = () => {
    toast({ title: 'Settings', description: 'Settings page coming soon!' });
  };

  const navItemClasses = (isActive: boolean) => 
    cn(
      "flex flex-col items-center justify-center h-auto p-2 text-muted-foreground hover:text-primary focus:text-primary",
      isActive && "text-primary"
    );

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16">
        <Link href="/" passHref legacyBehavior>
          <Button variant="ghost" className={navItemClasses(pathname === '/')}>
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Button>
        </Link>
        <Link href="/saved" passHref legacyBehavior>
          <Button variant="ghost" className={navItemClasses(pathname === '/saved')}>
            <Bookmark className="w-6 h-6" />
            <span className="text-xs mt-1">Saved</span>
          </Button>
        </Link>
        <Button variant="ghost" onClick={handleShareClick} className={navItemClasses(false)}>
          <Share2 className="w-6 h-6" />
          <span className="text-xs mt-1">Share</span>
        </Button>
        <Button variant="ghost" onClick={handleSettingsClick} className={navItemClasses(false)}>
          <Settings className="w-6 h-6" />
          <span className="text-xs mt-1">Settings</span>
        </Button>
      </div>
    </div>
  );
}
