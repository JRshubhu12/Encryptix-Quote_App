'use client';

import { generateJoke as aiGenerateJoke } from '@/ai/flows/generate-joke';
import QuoteCard from '@/components/quote-card';
import type { QuoteItem } from '@/lib/types';
import { MessageSquareQuote } from 'lucide-react';
import { useEffect, useState } from 'react';

const initialQuotesData: Omit<QuoteItem, 'joke' | 'likes' | 'isSaved' | 'isFlipped'>[] = [
  { id: '1', quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { id: '2', quote: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { id: '3', quote: "The mind is everything. What you think you become.", author: "Buddha" },
  { id: '4', quote: "Your time is limited, so don’t waste it living someone else’s life.", author: "Steve Jobs"},
  { id: '5', quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { id: '6', quote: "Life is what happens when you're busy making other plans.", author: "John Lennon" }
];

export default function HomePage() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Initialize quotes with random like/save states for demo purposes
    setQuotes(
      initialQuotesData.map(q => ({
        ...q,
        joke: undefined,
        likes: Math.floor(Math.random() * 100),
        isSaved: Math.random() > 0.7,
        isFlipped: false,
        isLikedByCurrentUser: Math.random() > 0.5 // Demo field
      }))
    );
  }, []);

  const handleUpdateQuote = (updatedQuote: QuoteItem) => {
    setQuotes(prevQuotes =>
      prevQuotes.map(q => (q.id === updatedQuote.id ? updatedQuote : q))
    );
  };

  if (!isClient) {
    // Render nothing or a loading indicator on the server/first render
    // to avoid hydration mismatches with random initial data
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 md:p-8">
            <MessageSquareQuote className="w-16 h-16 text-primary animate-pulse" />
            <p className="text-muted-foreground mt-4">Loading QuoteCraft...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4 md:p-8">
      <header className="my-8 md:my-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary font-serif flex items-center justify-center">
          <MessageSquareQuote data-ai-hint="logo quote" className="w-10 h-10 sm:w-12 sm:h-12 mr-3 text-accent" />
          QuoteCraft
        </h1>
        <p className="text-muted-foreground mt-2 text-md sm:text-lg">Inspiration and humor, one flip at a time.</p>
      </header>

      <main className="w-full max-w-6xl">
        {quotes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-muted-foreground">No quotes to display right now.</p>
            <p className="text-sm text-muted-foreground mt-2">Maybe try refreshing or check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {quotes.map(quote => (
              <div key={quote.id} className="perspective">
                <QuoteCard
                  quote={quote}
                  onUpdateQuote={handleUpdateQuote}
                  generateJokeAction={aiGenerateJoke}
                />
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="py-12 mt-auto text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} QuoteCraft. All rights reserved.</p>
      </footer>
    </div>
  );
}
