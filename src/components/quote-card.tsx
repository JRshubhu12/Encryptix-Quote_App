'use client';

import type { GenerateJokeInput, GenerateJokeOutput } from '@/ai/flows/generate-joke';
import type { QuoteItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Bookmark, Heart, Lightbulb, RefreshCw, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';

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
    // Keep parent state in sync if needed, or manage flip purely internally
    // For this example, we'll update parent's isFlipped for consistency if it matters elsewhere
    onUpdateQuote({ ...quote, isFlipped: newFlippedState });
  };

  const handleGenerateJoke = async () => {
    setIsLoadingJoke(true);
    try {
      const result = await generateJokeAction({ quote: quote.quote });
      const newJoke = result.joke;
      onUpdateQuote({ ...quote, joke: newJoke, isFlipped: true });
      setIsFlippedInternal(true); // Ensure card flips to show the new joke
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
      // Optionally set a placeholder error joke
      onUpdateQuote({ ...quote, joke: "Oops! My joke circuits are a bit fuzzy right now." });
    } finally {
      setIsLoadingJoke(false);
    }
  };

  const handleLike = () => {
    // Basic like toggle for demo; in a real app, this would be more complex
    const newLikes = quote.isLikedByCurrentUser ? quote.likes -1 : quote.likes + 1; // A mock field for demo
    const newIsLiked = !quote.isLikedByCurrentUser;

    onUpdateQuote({ ...quote, likes: newLikes, isLikedByCurrentUser: newIsLiked } as any); // any for demo field
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

  const handleShare = () => {
    const textToShare = `Quote: "${quote.quote}" - ${quote.author}${quote.joke ? `\n\nJoke: ${quote.joke}` : ''}`;
    if (navigator.share) {
      navigator.share({
        title: 'Check out this QuoteCraft card!',
        text: textToShare,
      }).catch(error => {
        console.error('Error sharing:', error)
        // Fallback to clipboard copy if share fails or is cancelled
        copyToClipboard(textToShare);
      });
    } else {
      copyToClipboard(textToShare);
    }
  };

  const copyToClipboard = (text: string) => {
     navigator.clipboard.writeText(text)
      .then(() => toast({ title: 'Copied to Clipboard!', description: 'Quote details are ready to paste.' }))
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast({ variant: 'destructive', title: 'Copy Failed', description: 'Could not copy details to clipboard.' });
      });
  }

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
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleShare(); }} aria-label="Share" className="hover:bg-accent/10 rounded-full">
            <Share2 className="w-5 h-5 text-muted-foreground hover:text-primary" />
          </Button>
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
