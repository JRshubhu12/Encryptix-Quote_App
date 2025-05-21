
export interface QuoteItem {
  id: string;
  quote: string; // This will now store the original quote
  author: string;
  joke?: string; // This will now store the original joke
  isSaved: boolean;
  isFlipped: boolean;

  // New fields for translation
  displayQuote: string; // Text to actually display for the quote
  displayJoke?: string; // Text to actually display for the joke
  isTranslatedToHindi: boolean; // Flag to indicate if current display is Hindi

  // New fields for "Likes"
  isLiked: boolean;
  likes: number;
}

