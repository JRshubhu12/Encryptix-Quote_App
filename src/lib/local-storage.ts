
'use client';

import type { QuoteItem } from './types';

const SAVED_QUOTES_KEY = 'quoteCraftSavedItems';

export function getSavedQuotes(): QuoteItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const savedItems = localStorage.getItem(SAVED_QUOTES_KEY);
  try {
    return savedItems ? JSON.parse(savedItems) : [];
  } catch (error) {
    console.error("Error parsing saved quotes from local storage:", error);
    return [];
  }
}

export function saveQuote(quoteToSave: QuoteItem): void {
  if (typeof window === 'undefined') return;
  const savedQuotes = getSavedQuotes();
  // Ensure isSaved is true for the item being saved
  const itemToStore = { ...quoteToSave, isSaved: true };
  
  if (!savedQuotes.find(q => q.id === itemToStore.id)) {
    const updatedQuotes = [...savedQuotes, itemToStore];
    localStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(updatedQuotes));
  } else {
    // If it's already there, update it (e.g., if joke was added or translation state changed)
    const updatedQuotes = savedQuotes.map(q =>
      q.id === itemToStore.id ? itemToStore : q
    );
    localStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(updatedQuotes));
  }
}

export function unsaveQuote(quoteId: string): void {
  if (typeof window === 'undefined') return;
  let savedQuotes = getSavedQuotes();
  savedQuotes = savedQuotes.filter(q => q.id !== quoteId);
  localStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(savedQuotes));
}

export function isQuoteSaved(quoteId: string): boolean {
  if (typeof window === 'undefined') return false;
  const savedQuotes = getSavedQuotes();
  return savedQuotes.some(q => q.id === quoteId);
}
