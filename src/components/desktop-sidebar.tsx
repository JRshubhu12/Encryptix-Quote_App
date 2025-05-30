
'use client';

import Link from 'next/link';
import { Home, Bookmark, Share2, Settings, PanelLeft } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';


export default function DesktopSidebar() {
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
        if (error.name === 'AbortError') {
          console.log('Share cancelled by user.');
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

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon" className="hidden md:flex border-r bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="p-2 flex justify-center items-center group-data-[state=expanded]:justify-between">
        <h2 className="text-lg font-semibold group-data-[state=expanded]:opacity-100 group-data-[state=collapsed]:opacity-0 transition-opacity duration-200 ml-2">QuoteCraft</h2>
        <SidebarTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <PanelLeft />
          </Button>
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" passHref legacyBehavior>
              <SidebarMenuButton asChild isActive={pathname === '/'} tooltip={{content: "Home", side: "right", align: "center"}} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground">
                <a>
                  <Home />
                  <span>Home</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/saved" passHref legacyBehavior>
              <SidebarMenuButton asChild isActive={pathname === '/saved'} tooltip={{content: "Saved", side: "right", align: "center"}} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground">
                <a>
                  <Bookmark /> 
                  <span>Saved</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleShareClick} tooltip={{content: "Share App", side: "right", align: "center"}} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <Share2 />
              <span>Share App</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSettingsClick} tooltip={{content: "Settings", side: "right", align: "center"}} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 mt-auto border-t border-sidebar-border">
         <p className="text-xs text-sidebar-foreground/70 group-data-[state=expanded]:opacity-100 group-data-[state=collapsed]:opacity-0 transition-opacity duration-200 text-center">
            &copy; {new Date().getFullYear()}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
