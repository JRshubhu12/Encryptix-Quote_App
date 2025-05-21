
'use client';

import Link from 'next/link';
import { Home, Heart, Share2, Settings, PanelLeft } from 'lucide-react';
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

  const handleLikesClick = () => {
    toast({ title: 'Likes', description: 'This feature is coming soon!' });
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: 'QuoteCraft App',
        text: 'Check out QuoteCraft for daily inspiration and humor!',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://quotecraft.example.com',
      })
      .then(() => console.log('Successful share'))
      .catch((error) => {
        console.log('Error sharing', error);
        toast({ variant: 'destructive', title: 'Share Failed', description: 'Could not share at this time.' });
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
        {/* Optional: Add a logo or title here when expanded */}
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
            <SidebarMenuButton onClick={handleLikesClick} tooltip={{content: "Likes", side: "right", align: "center"}} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <Heart />
              <span>Likes</span>
            </SidebarMenuButton>
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
