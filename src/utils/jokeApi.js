const JOKE_API_URL = 'https://official-joke-api.appspot.com/random_joke';

export const getJoke = async () => {
  try {
    const response = await fetch(JOKE_API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch joke');
    }
    const joke = await response.json();
    return `${joke.setup} ${joke.punchline}`;
  } catch (error) {
    console.error('Error fetching joke:', error);
    throw error;
  }
};
