export interface QuoteItem {
  id: string;
  quote: string; // This will now store the original quote
  author: string;
  joke?: string; // This will now store the original joke
  likes: number;
  isSaved: boolean;
  isFlipped: boolean;
  isLikedByCurrentUser?: boolean; // Keep this if it's used

  // New fields for translation
  displayQuote: string; // Text to actually display for the quote
  displayJoke?: string; // Text to actually display for the joke
  isTranslatedToHindi: boolean; // Flag to indicate if current display is Hindi

  // New field for AI-generated image
  imageUrl?: string;
}
