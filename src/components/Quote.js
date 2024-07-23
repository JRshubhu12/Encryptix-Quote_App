import React, { useState, useEffect } from 'react';
import { getQuote } from '../utils/api';
import frameImage from '../assets/frame.png';
import './Quote.css';

const QuoteWithImage = () => {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [error, setError] = useState(null);
  const [likedQuotes, setLikedQuotes] = useState([]);

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      setError(null);
      const fetchedQuote = await getQuote();
      setCurrentQuote(fetchedQuote[0]); // API returns an array
    } catch (error) {
      setError('Failed to fetch quote. Please try again later.');
    }
  };

  const handleLike = () => {
    if (currentQuote && !likedQuotes.includes(currentQuote._id)) {
      setLikedQuotes([...likedQuotes, currentQuote._id]);
    }
  };

  return (
    <div className="quote-box" style={{ backgroundImage: `url(${frameImage})` }}>
      <h1 className="quote-app-title">Quote App</h1>
      <div className="quote-text-container">
        {error ? (
          <p className="quote-text">{error}</p>
        ) : currentQuote ? (
          <>
            <p className="quote-text">"{currentQuote.quote}"</p>
            <p className="quote-author">- {currentQuote.author}</p>
          </>
        ) : (
          <p className="quote-text">Loading quotes...</p>
        )}
      </div>
      <div className="quote-actions">
        <button onClick={fetchQuote} className="refresh-button">Refresh</button>
        <button onClick={handleLike} className="like-button">
          <svg
            height="32"
            width="32"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="empty"
          >
            <path d="M0 0H24V24H0z" fill="none"></path>
            <path
              d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2zm-3.566 15.604c.881-.556 1.676-1.109 2.42-1.701C18.335 14.533 20 11.943 20 9c0-2.36-1.537-4-3.5-4-1.076 0-2.24.57-3.086 1.414L12 7.828l-1.414-1.414C9.74 5.57 8.576 5 7.5 5 5.56 5 4 6.656 4 9c0 2.944 1.666 5.533 4.645 7.903.745.592 1.54 1.145 2.421 1.7.299.189.595.37.934.572.339-.202.635-.383.934-.571z"
            ></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="32"
            height="32"
            className="filled"
          >
            <path fill="none" d="M0 0H24V24H0z"></path>
            <path
              d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"
            ></path>
          </svg>
          Like
        </button>
      </div>
    </div>
  );
};

export default QuoteWithImage;
