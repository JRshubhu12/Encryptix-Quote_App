
'use client';

import { useEffect, useState } from 'react';
import { generateJoke as aiGenerateJoke } from '@/ai/flows/generate-joke';
import { translateText as aiTranslateText } from '@/ai/flows/translate-text-flow';
import QuoteCard from '@/components/quote-card';
import type { QuoteItem } from '@/lib/types';
import { getSavedQuotes } from '@/lib/local-storage';
import { BookmarkX, MessageSquareQuote } from 'lucide-react';

export default function SavedQuotesPage() {
  const [savedQuotes, setSavedQuotes] = useState<QuoteItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setSavedQuotes(getSavedQuotes());
    }
  }, []);

  const handleUpdateQuote = (updatedQuote: QuoteItem) => {
    // If a quote is unsaved from the saved page, it should be removed from the list
    if (!updatedQuote.isSaved) {
      setSavedQuotes(prevQuotes => prevQuotes.filter(q => q.id !== updatedQuote.id));
    } else {
      // If other properties are updated (e.g., flip state, translation), update it in the list
      setSavedQuotes(prevQuotes =>
        prevQuotes.map(q => (q.id === updatedQuote.id ? updatedQuote : q))
      );
    }
  };

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 md:p-8">
        <MessageSquareQuote className="w-16 h-16 text-primary animate-pulse" />
        <p className="text-muted-foreground mt-4">Loading Saved Quotes...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full bg-background p-4 md:p-8 pb-20 md:pb-8">
      <header className="my-8 md:my-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary font-serif flex items-center justify-center">
          <BookmarkX data-ai-hint="bookmark logo" className="w-10 h-10 sm:w-12 sm:h-12 mr-3 text-accent" />
          Saved Quotes
        </h1>
        <p className="text-muted-foreground mt-2 text-md sm:text-lg">Your collection of inspiring and funny moments.</p>
      </header>

      <main className="w-full max-w-6xl">
        {savedQuotes.length === 0 ? (
          <div className="text-center py-20">
            <BookmarkX className="w-24 h-24 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-2xl text-muted-foreground">No Saved Quotes Yet</p>
            <p className="text-md text-muted-foreground mt-2">
              Start exploring and save your favorite quotes by clicking the bookmark icon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {savedQuotes.map(quote => (
              <div key={quote.id} className="perspective">
                <QuoteCard
                  quote={quote}
                  onUpdateQuote={handleUpdateQuote}
                  generateJokeAction={aiGenerateJoke}
                  translateTextAction={aiTranslateText}
                />
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="py-12 mt-auto text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} QuoteCraft. All rights reserved.</p>
        <p>
          Developed by <a href="https://shubhamcoder.netlify.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Shubham</a>.
        </p>
      </footer>
    </div>
  );
}
