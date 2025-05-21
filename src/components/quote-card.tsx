
'use client';

import type { GenerateJokeInput, GenerateJokeOutput } from '@/ai/flows/generate-joke';
import type { TranslateTextInput, TranslateTextOutput } from '@/ai/flows/translate-text-flow';
import type { QuoteItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
// Removed: import { fetchImageFromApiNinjas } from '@/lib/api-ninjas-images'; 
import { Bookmark, Heart, Lightbulb, RefreshCw, Share2, Copy, Smartphone, Twitter, Facebook, MessageSquare, Languages, Sparkles, Volume2 } from 'lucide-react'; // Removed ImageIcon, AlertCircle
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// Removed: import Image from 'next/image'; 
// Removed: import { Skeleton } from '@/components/ui/skeleton';


interface QuoteCardProps {
  quote: QuoteItem;
  onUpdateQuote: (updatedQuote: QuoteItem) => void;
  generateJokeAction: (input: GenerateJokeInput) => Promise<GenerateJokeOutput>;
  translateTextAction: (input: TranslateTextInput) => Promise<TranslateTextOutput>;
}

export default function QuoteCard({ quote, onUpdateQuote, generateJokeAction, translateTextAction }: QuoteCardProps) {
  const [isFlippedInternal, setIsFlippedInternal] = useState(quote.isFlipped);
  const [isLoadingJoke, setIsLoadingJoke] = useState(false);
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
  // Removed image related states: internalImageUrl, isFetchingImage, imageError
  
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setIsFlippedInternal(quote.isFlipped);
  }, [quote.isFlipped]);

  // Removed useEffect for loading image and getImageQuery callback

  const toggleFlip = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    const newFlippedState = !isFlippedInternal;
    setIsFlippedInternal(newFlippedState);
    onUpdateQuote({ ...quote, isFlipped: newFlippedState });
  };

  const handleSpeak = useCallback((textToSpeak?: string) => {
    if (!textToSpeak) return;

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false); 
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast({
        variant: 'destructive',
        title: 'Speech Error',
        description: 'Could not play audio.',
      });
    };
    speechSynthesis.speak(utterance);
  }, [toast]);


  const handleGenerateJoke = async () => {
    setIsLoadingJoke(true);
    try {
      const result = await generateJokeAction({ quote: quote.quote });
      const newJoke = result.joke;
      
      let newDisplayJoke = newJoke;
      if (quote.isTranslatedToHindi) {
        const translationResult = await translateTextAction({ text: newJoke, targetLanguage: 'Hindi' });
        newDisplayJoke = translationResult.translatedText;
      }

      onUpdateQuote({ ...quote, joke: newJoke, displayJoke: newDisplayJoke, isFlipped: true });
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
      onUpdateQuote({ ...quote, joke: "Oops! My joke circuits are a bit fuzzy right now.", displayJoke: "Oops! My joke circuits are a bit fuzzy right now." });
    } finally {
      setIsLoadingJoke(false);
    }
  };

  const handleTranslate = async () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    if (quote.isTranslatedToHindi) {
      onUpdateQuote({
        ...quote,
        displayQuote: quote.quote,
        displayJoke: quote.joke,
        isTranslatedToHindi: false,
      });
      toast({
        title: 'Switched to Original',
        description: 'Showing the original English text.',
      });
      return;
    }

    setIsLoadingTranslation(true);
    try {
      const translatedQuoteText = await translateTextAction({ text: quote.quote, targetLanguage: 'Hindi' });
      let translatedJokeText: string | undefined = undefined;
      if (quote.joke) {
        const jokeTranslationResult = await translateTextAction({ text: quote.joke, targetLanguage: 'Hindi' });
        translatedJokeText = jokeTranslationResult.translatedText;
      }
      
      onUpdateQuote({
        ...quote,
        displayQuote: translatedQuoteText.translatedText,
        displayJoke: translatedJokeText,
        isTranslatedToHindi: true,
      });
      toast({
        title: 'Translated to Hindi!',
        description: 'The content has been translated.',
      });
    } catch (error) {
      console.error('Failed to translate:', error);
      toast({
        variant: 'destructive',
        title: 'Translation Error',
        description: 'Could not translate the content at this time. Please try again.',
      });
    } finally {
      setIsLoadingTranslation(false);
    }
  };

  const handleLike = () => {
    const newLikes = quote.isLikedByCurrentUser ? quote.likes -1 : quote.likes + 1;
    const newIsLiked = !quote.isLikedByCurrentUser;
    onUpdateQuote({ ...quote, likes: newLikes, isLikedByCurrentUser: newIsLiked });
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

  const textToShare = `Quote: "${quote.displayQuote}" - ${quote.author}${quote.displayJoke ? `\n\nJoke: ${quote.displayJoke}` : ''}`;
  const pageUrl = typeof window !== "undefined" ? window.location.href : 'https://quotecraft.example.com'; 

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
        if (error instanceof DOMException && error.name === 'AbortError') {
          // No toast for abort
        } else {
          copyToClipboard(textToShare);
          toast({
            variant: 'default', 
            title: 'Copied to Clipboard',
            description: 'Native share failed or was cancelled. Content copied instead.',
          });
        }
      }
    } else {
      copyToClipboard(textToShare);
      toast({ title: 'Copied to Clipboard!', description: 'Native share not available. Content copied instead.' });
    }
  };


  return (
    <Card className="w-full max-w-md shadow-xl rounded-lg flex flex-col bg-transparent border-0">
      <div
        className={cn(
          'relative transition-transform duration-700 ease-in-out w-full preserve-3d',
          'h-[220px] md:h-[250px]', // Adjusted height
          isFlippedInternal ? 'my-rotate-y-180' : ''
        )}
      >
        {/* Front Face */}
        <div className="absolute w-full h-full bg-card rounded-t-lg p-4 flex flex-col justify-between backface-hidden border shadow-sm">
          {/* Image section removed */}
          <div className="overflow-y-auto flex-grow flex flex-col justify-center mb-2 pt-4"> {/* Added pt-4 for spacing */}
            <blockquote className="text-lg md:text-xl italic font-serif text-foreground/90">
              "{quote.displayQuote}"
            </blockquote>
            <div className="flex justify-between items-center mt-2">
                <p className="text-right text-xs text-muted-foreground">- {quote.author}</p>
                <Button variant="ghost" size="icon" onClick={() => handleSpeak(quote.displayQuote)} disabled={isSpeaking && speechSynthesis.speaking && speechSynthesis.utterance?.text === quote.displayQuote} aria-label="Listen to quote" className="h-7 w-7 hover:bg-accent/10">
                    <Volume2 className={cn("w-4 h-4 text-muted-foreground", (isSpeaking && speechSynthesis.speaking && speechSynthesis.utterance?.text === quote.displayQuote) ? "text-primary" : "hover:text-primary")} />
                </Button>
            </div>
          </div>
          <Button variant="link" onClick={(e) => { e.stopPropagation(); toggleFlip(); }} className="text-primary self-center mt-auto p-1 text-xs">
            Tap for Joke
          </Button>
        </div>

        {/* Back Face */}
        <div className="absolute w-full h-full bg-card rounded-t-lg p-6 flex flex-col justify-center my-rotate-y-180 backface-hidden border shadow-sm"> 
          <div className="overflow-y-auto h-full flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-primary mb-2">Joke Time!</h3>
            {isLoadingJoke || (isLoadingTranslation && quote.joke) ? (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                <span>{isLoadingJoke ? 'Crafting a joke...' : 'Translating joke...'}</span>
              </div>
            ) : quote.displayJoke ? (
              <div>
                <p className="text-foreground/90">{quote.displayJoke}</p>
                <div className="flex justify-end mt-2">
                    <Button variant="ghost" size="icon" onClick={() => handleSpeak(quote.displayJoke)} disabled={isSpeaking && speechSynthesis.speaking && speechSynthesis.utterance?.text === quote.displayJoke} aria-label="Listen to joke" className="h-7 w-7 hover:bg-accent/10">
                        <Volume2 className={cn("w-4 h-4 text-muted-foreground", (isSpeaking && speechSynthesis.speaking && speechSynthesis.utterance?.text === quote.displayJoke) ? "text-primary" : "hover:text-primary")} />
                    </Button>
                </div>
              </div>
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
            <Heart className={cn('w-5 h-5', quote.isLikedByCurrentUser ? 'text-destructive fill-destructive' : 'text-muted-foreground hover:text-destructive/80')} />
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

        <div className="flex flex-col items-end space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
          <Button
            onClick={(e) => { e.stopPropagation(); handleTranslate(); }}
            disabled={isLoadingTranslation}
            size="sm"
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary shadow-sm rounded-md w-full sm:w-auto"
          >
            {isLoadingTranslation ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Languages className="w-4 h-4 mr-2" />}
            {isLoadingTranslation ? "Translating..." : quote.isTranslatedToHindi ? "Show Original" : "To Hindi"}
          </Button>
          <Button 
            onClick={(e) => { e.stopPropagation(); handleGenerateJoke(); }} 
            disabled={isLoadingJoke || isLoadingTranslation} 
            size="sm" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-sm rounded-md w-full sm:w-auto"
          >
            {quote.isFlipped && quote.joke ? <Sparkles className="w-4 h-4 mr-2" /> : <Lightbulb className="w-4 h-4 mr-2" />}
            {isLoadingJoke ? "Thinking..." : quote.joke ? "New Joke" : "Get Joke"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
