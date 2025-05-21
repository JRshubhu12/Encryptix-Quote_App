
// API Ninjas Image Search API client

const API_NINJAS_KEY = process.env.API_NINJAS_API_KEY || process.env.NEXT_PUBLIC_API_NINJAS_API_KEY;

interface ApiNinjasImage {
  image_link: string;
  thumbnail_link: string;
  // Add other fields if needed, like width, height, source_display_name
}

export async function fetchImageFromApiNinjas(query: string, category?: string): Promise<string | null> {
  if (!API_NINJAS_KEY) {
    console.error('API Ninjas API key is not configured.');
    return null;
  }

  const safeQuery = encodeURIComponent(query);
  let url = `https://api.api-ninjas.com/v1/imagesearch?query=${safeQuery}&limit=1`;
  if (category) {
    url += `&category=${encodeURIComponent(category)}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': API_NINJAS_KEY,
      },
    });

    if (!response.ok) {
      // API Ninjas returns errors in plain text or JSON depending on the error
      let errorText = `API Ninjas API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorText += ` - ${errorData.error || JSON.stringify(errorData)}`;
      } catch (e) {
        // If parsing JSON fails, use the raw text
        const rawError = await response.text();
        errorText += ` - ${rawError}`;
      }
      console.error(errorText);
      return null;
    }

    const data: ApiNinjasImage[] = await response.json();

    if (data && data.length > 0 && data[0].image_link) {
      return data[0].image_link;
    } else {
      console.warn(`No images found on API Ninjas for query: "${query}"`);
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch image from API Ninjas:', error);
    return null;
  }
}
