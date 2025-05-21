
// Basic Pexels API client
// IMPORTANT: In a production app, the API key should not be exposed client-side.
// Consider using a Next.js API route as a proxy.

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || process.env.NEXT_PUBLIC_PEXELS_API_KEY; // Allow NEXT_PUBLIC_ for client-side access in this prototype

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page?: string;
}

export async function fetchImageFromPexels(query: string): Promise<string | null> {
  if (!PEXELS_API_KEY) {
    console.error('Pexels API key is not configured.');
    return null;
  }

  const safeQuery = encodeURIComponent(query);
  const url = `https://api.pexels.com/v1/search?query=${safeQuery}&per_page=1&orientation=landscape`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Pexels API error:', response.status, errorData);
      return null;
    }

    const data: PexelsSearchResponse = await response.json();

    if (data.photos && data.photos.length > 0) {
      // Prefer large2x for better quality, fallback to large or medium
      return data.photos[0].src.large2x || data.photos[0].src.large || data.photos[0].src.medium;
    } else {
      console.warn(`No images found on Pexels for query: "${query}"`);
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch image from Pexels:', error);
    return null;
  }
}
