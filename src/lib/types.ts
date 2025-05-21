
export interface QuoteItem {
  id: string;
  quote: string; // This will now store the original quote
  author: string;
  joke?: string; // This will now store the original joke
  // Removed: likes: number;
  isSaved: boolean;
  isFlipped: boolean;
  // Removed: isLikedByCurrentUser?: boolean;

  // New fields for translation
  displayQuote: string; // Text to actually display for the quote
  displayJoke?: string; // Text to actually display for the joke
  isTranslatedToHindi: boolean; // Flag to indicate if current display is Hindi
}
