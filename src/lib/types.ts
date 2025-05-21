export interface QuoteItem {
  id: string;
  quote: string;
  author: string;
  joke?: string;
  likes: number;
  isSaved: boolean;
  isFlipped: boolean;
}
