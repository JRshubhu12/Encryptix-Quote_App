const BASE_URL = 'https://api.api-ninjas.com/v1/quotes?category=happiness';
// const BASE_URL = 'https://api.api-ninjas.com/v1/jokes';
const API_KEY = 't7IB3XtTc5QS3B7w1kQaj0kH16826WEtSW35kq0e'; // Replace with your actual API key

export const getQuote = async () => {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        'X-Api-Key': API_KEY
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch quote:', error);
    throw error;
  }
};
