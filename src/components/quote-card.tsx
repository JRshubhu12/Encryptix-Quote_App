
'use client';

import type { GenerateJokeInput, GenerateJokeOutput } from '@/ai/flows/generate-joke';
import type { QuoteItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Bookmark, Heart, Lightbulb, RefreshCw, Share2, Copy, Smartphone, Twitter, Facebook, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface QuoteCardProps {
  quote: QuoteItem;
  onUpdateQuote: (updatedQuote: QuoteItem) => void;
  generateJokeAction: (input: GenerateJokeInput) => Promise<GenerateJokeOutput>;
}

export default function QuoteCard({ quote, onUpdateQuote, generateJokeAction }: QuoteCardProps) {
  const [isFlippedInternal, setIsFlippedInternal] = useState(quote.isFlipped);
  const [isLoadingJoke, setIsLoadingJoke] = useState(false);
  const { toast } = useToast();

  const toggleFlip = () => {
    const newFlippedState = !isFlippedInternal;
    setIsFlippedInternal(newFlippedState);
    onUpdateQuote({ ...quote, isFlipped: newFlippedState });
  };

  const handleGenerateJoke = async () => {
    setIsLoadingJoke(true);
    try {
      const result = await generateJokeAction({ quote: quote.quote });
      const newJoke = result.joke;
      onUpdateQuote({ ...quote, joke: newJoke, isFlipped: true });
      setIsFlippedInternal(true);
      toast({
        title: 'Joke Generated!',
        description: 'A fresh joke has been crafted for you.',
      });
    } catch (error) {
      console.error('Failed to generate joke:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Joke',
        description: 'Could not generate a new joke at this time. Please try again.',
      });
      onUpdateQuote({ ...quote, joke: "Oops! My joke circuits are a bit fuzzy right now." });
    } finally {
      setIsLoadingJoke(false);
    }
  };

  const handleLike = () => {
    const newLikes = quote.isLikedByCurrentUser ? quote.likes -1 : quote.likes + 1;
    const newIsLiked = !quote.isLikedByCurrentUser;
    onUpdateQuote({ ...quote, likes: newLikes, isLikedByCurrentUser: newIsLiked } as any);
    if (newIsLiked) {
        toast({
        title: 'Liked!',
        description: `You liked "${quote.quote.substring(0, 20)}..."`,
        });
    }
  };

  const handleSave = () => {
    const newSavedState = !quote.isSaved;
    onUpdateQuote({ ...quote, isSaved: newSavedState });
    toast({
      title: newSavedState ? 'Quote Saved!' : 'Quote Unsaved',
      description: `"${quote.quote.substring(0,20)}..." ${newSavedState ? 'added to' : 'removed from'} your favorites.`,
    });
  };

  const copyToClipboard = (text: string) => {
     navigator.clipboard.writeText(text)
      .then(() => toast({ title: 'Copied to Clipboard!', description: 'Quote details are ready to paste.' }))
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast({ variant: 'destructive', title: 'Copy Failed', description: 'Could not copy details to clipboard.' });
      });
  };

  const textToShare = `Quote: "${quote.quote}" - ${quote.author}${quote.joke ? `\n\nJoke: ${quote.joke}` : ''}`;
  const pageUrl = typeof window !== "undefined" ? window.location.href : 'https://quotecraft.example.com'; // Replace with your actual app URL

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}&url=${encodeURIComponent(pageUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(textToShare)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
  };

  const shareOnWhatsApp = () => {
    const whatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare + ' ' + pageUrl)}`;
    window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quote by ${quote.author} - QuoteCraft`,
          text: textToShare,
          url: pageUrl,
        });
      } catch (error) {
        console.error('Error using native share:', error);
        // Fallback to clipboard if native share fails or is cancelled by user
        copyToClipboard(textToShare);
        toast({
          variant: 'default', // Changed from destructive as it's a fallback
          title: 'Copied to Clipboard',
          description: 'Native share failed or was cancelled. Content copied instead.',
        });
      }
    } else {
      // Should not happen if button is only rendered when navigator.share is true, but as a safe fallback
      copyToClipboard(textToShare);
      toast({ title: 'Copied to Clipboard!', description: 'Native share not available. Content copied instead.' });
    }
  };


  return (
    <Card className="w-full max-w-md shadow-xl rounded-lg flex flex-col bg-transparent border-0">
      <div
        className={cn(
          'relative transition-transform duration-700 ease-in-out w-full h-64 md:h-72 preserve-3d',
          isFlippedInternal ? 'my-rotate-y-180' : ''
        )}
      >
        {/* Front Face */}
        <div className="absolute w-full h-full bg-card rounded-t-lg p-6 flex flex-col justify-between backface-hidden border shadow-sm">
          <div className="overflow-y-auto h-full flex flex-col justify-center">
            <blockquote className="text-xl md:text-2xl italic font-serif text-foreground/90">
              "{quote.quote}"
            </blockquote>
            <p className="text-right text-sm text-muted-foreground mt-3">- {quote.author}</p>
          </div>
          <Button variant="link" onClick={(e) => { e.stopPropagation(); toggleFlip(); }} className="text-primary self-center mt-auto p-1 text-xs">
            Tap for Joke
          </Button>
        </div>

        {/* Back Face */}
        <div className="absolute w-full h-full bg-card rounded-t-lg p-6 flex flex-col justify-between my-rotate-y-180 backface-hidden border shadow-sm">
          <div className="overflow-y-auto h-full flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-primary mb-2">Joke Time!</h3>
            {isLoadingJoke ? (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                <span>Crafting a joke...</span>
              </div>
            ) : quote.joke ? (
              <p className="text-foreground/90">{quote.joke}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No joke here yet! Generate one or tap to flip.</p>
            )}
          </div>
           <Button variant="link" onClick={(e) => { e.stopPropagation(); toggleFlip(); }} className="text-primary self-center mt-auto p-1 text-xs">
            Tap for Quote
          </Button>
        </div>
      </div>

      {/* Actions Footer - always visible */}
      <CardFooter className="p-3 flex justify-between items-center border-t bg-card rounded-b-lg shadow-sm border">
        <div className="flex items-center space-x-0.5">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleLike(); }} aria-label="Like" className="hover:bg-accent/10 rounded-full">
            <Heart className={cn('w-5 h-5', (quote as any).isLikedByCurrentUser ? 'text-destructive fill-destructive' : 'text-muted-foreground hover:text-destructive/80')} />
          </Button>
          <span className="text-sm text-muted-foreground tabular-nums min-w-[2ch] text-left">{quote.likes}</span>
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleSave(); }} aria-label="Save" className="hover:bg-accent/10 rounded-full">
            <Bookmark className={cn('w-5 h-5', quote.isSaved ? 'text-accent fill-accent' : 'text-muted-foreground hover:text-accent/80')} />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Share" className="hover:bg-accent/10 rounded-full" onClick={(e) => e.stopPropagation()}>
                <Share2 className="w-5 h-5 text-muted-foreground hover:text-primary" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col gap-1">
                <Button variant="ghost" className="justify-start px-2 py-1.5 h-auto text-sm" onClick={(e) => { e.stopPropagation(); copyToClipboard(textToShare); }}>
                  <Copy className="mr-2 h-4 w-4" /> Copy Text
                </Button>
                {typeof navigator !== "undefined" && navigator.share && (
                  <Button variant="ghost" className="justify-start px-2 py-1.5 h-auto text-sm" onClick={(e) => { e.stopPropagation(); nativeShare(); }}>
                    <Smartphone className="mr-2 h-4 w-4" /> Share via...
                  </Button>
                )}
                <Button variant="ghost" className="justify-start px-2 py-1.5 h-auto text-sm" onClick={(e) => { e.stopPropagation(); shareOnTwitter(); }}>
                  <Twitter className="mr-2 h-4 w-4" /> Share on Twitter
                </Button>
                <Button variant="ghost" className="justify-start px-2 py-1.5 h-auto text-sm" onClick={(e) => { e.stopPropagation(); shareOnFacebook(); }}>
                  <Facebook className="mr-2 h-4 w-4" /> Share on Facebook
                </Button>
                <Button variant="ghost" className="justify-start px-2 py-1.5 h-auto text-sm" onClick={(e) => { e.stopPropagation(); shareOnWhatsApp(); }}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Share on WhatsApp
                </Button>
              </div>
            </PopoverContent>
          </Popover>

        </div>
        <Button 
          onClick={(e) => { e.stopPropagation(); handleGenerateJoke(); }} 
          disabled={isLoadingJoke} 
          size="sm" 
          className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-sm rounded-md"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          {isLoadingJoke ? "Thinking..." : quote.joke ? "New Joke" : "Get Joke"}
        </Button>
      </CardFooter>
    </Card>
  );
}

    