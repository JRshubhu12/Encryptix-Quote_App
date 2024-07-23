import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getQuote } from '../utils/api';
import { getJoke } from '../utils/jokeApi';
import frameImage from '../assets/Rectangle6.png';
import image from '../assets/image 7.png';
import image2 from '../assets/8139555.webp';
import image3 from '../assets/image 8.png';
import './Quotes.css';

const QuoteWithImage = () => {
  const [currentText, setCurrentText] = useState(null);
  const [error, setError] = useState(null);
  const [likedTexts, setLikedTexts] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [isQuote, setIsQuote] = useState(true);
  const navigate = useNavigate();

  const saveQuote = (quote) => {
    // Implement your save logic here, e.g., save to local storage or API
    console.log('Saving quote:', quote);
  };
  const fetchText = useCallback(async () => {
    try {
      setError(null);
      const fetchedText = isQuote ? await getQuote() : await getJoke();
      setCurrentText(isQuote ? fetchedText[0] : fetchedText);
    } catch (error) {
      setError('Failed to fetch text. Please try again later.');
    }
  }, [isQuote]);

  useEffect(() => {
    fetchText();
  }, [fetchText]);

  const handleLike = () => {
    if (currentText && !likedTexts.some(text => text._id === currentText._id)) {
      const randomLikes = Math.floor(Math.random() * 100) + 1;
      setLikedTexts([...likedTexts, { _id: currentText._id, likes: randomLikes }]);
      setLikeCount(likeCount + 1);
    }
  };

  const handleToggle = () => {
    setIsQuote(!isQuote);
    setCurrentText(null);
    setLikeCount(0);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: isQuote ? 'Quote' : 'Joke',
        text: isQuote ? `${currentText.quote} - ${currentText.author}` : currentText,
      }).catch((error) => console.error('Error sharing', error));
    } else {
      alert('Web Share API is not supported in your browser.');
    }
  };

  const handleSave = () => {
    if (currentText) {
      saveQuote(currentText); // Call a function to save the quote
      navigate('/saved-quotes', { state: { quote: currentText } }); // Navigate to saved quotes page after saving
    }
  };

  return (
    <div className="quote-container">
      <h1 className="quote-app-title">Quote App</h1>
      <label className="switch">
        <input type="checkbox" checked={!isQuote} onChange={handleToggle} />
        <span className="slider"></span>
        <span className="switch-text">{isQuote ? 'Quote' : 'Joke'}</span>
      </label>
      <div className="quote-box" style={{ backgroundImage: `url(${frameImage})` }}>
        <div className="quote-text-container">
          {error ? (
            <p className="quote-text">{error}</p>
          ) : currentText ? (
            <>
              <p className="quote-text">"{isQuote ? currentText.quote : currentText}"</p>
              {isQuote && <p className="quote-author">- {currentText.author}</p>}
              {likedTexts.some(text => text._id === currentText._id) && (
                <p className="quote-likes">Likes: {likedTexts.find(text => text._id === currentText._id).likes}</p>
              )}
            </>
          ) : (
            <p className="quote-text">Loading {isQuote ? 'quotes' : 'jokes'}...</p>
          )}
        </div>
        <div className="quote-actions">
          <button onClick={fetchText} className="refresh-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-repeat"
              viewBox="0 0 16 16"
            >
              <path
                d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
              ></path>
              <path
                fillRule="evenodd"
                d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
              ></path>
            </svg>
            Refresh
          </button>
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
            <span className="like-count">{likeCount}</span>
          </button>
          <button onClick={handleShare} className="Btn">
            <span className="svgContainer">
              <svg viewBox="0 0 448 512">
                <path d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z"></path>
              </svg>
            </span>
            Share
          </button>
          <label onClick={handleSave} for="checkboxInput" class="bookmark">
  <input type="checkbox" id="checkboxInput" />
  <svg
    width="15"
    viewBox="0 0 50 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="svgIcon"
  >
    <path
      d="M46 62.0085L46 3.88139L3.99609 3.88139L3.99609 62.0085L24.5 45.5L46 62.0085Z"
      stroke="black"
      stroke-width="7"
    ></path>
  </svg>
</label>


        </div>
      </div>
      <footer className="footer">
        <a href="https://www.example.com" className="footer-image-link">
          <img className="footer-image" alt="Decorative" src={image} />
        </a>
        <Link to="/saved-quotes" className="footer-image-link">
          <img className="footer-image" alt="Decorative" src={image2} />
        </Link>
        <Link to="/dashboard" className="footer-image-link">
          <img className="footer-image" alt="Decorative" src={image3} />
        </Link>
      </footer>
    </div>
  );
};

export default QuoteWithImage; 