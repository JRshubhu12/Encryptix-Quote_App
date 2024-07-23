import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './SavedQuotes.css';

const SavedQuotes = () => {
  const location = useLocation();
  const [savedQuotes, setSavedQuotes] = useState([]);

  useEffect(() => {
    const quoteFromState = location.state?.quote;
    if (quoteFromState) {
      const storedQuotes = JSON.parse(localStorage.getItem('savedQuotes')) || [];
      const isDuplicate = storedQuotes.some(
        (quote) => quote.quote === quoteFromState.quote && quote.author === quoteFromState.author
      );
      if (!isDuplicate) {
        const updatedQuotes = [...storedQuotes, quoteFromState];
        localStorage.setItem('savedQuotes', JSON.stringify(updatedQuotes));
        setSavedQuotes(updatedQuotes);
      } else {
        setSavedQuotes(storedQuotes);
      }
    } else {
      const storedQuotes = localStorage.getItem('savedQuotes');
      if (storedQuotes) {
        setSavedQuotes(JSON.parse(storedQuotes));
      }
    }
  }, [location.state]);

  return (
    <div className="saved-quote-container">
      <h1 className="saved-quote-title">Saved Quotes</h1>
      {savedQuotes.length > 0 ? (
        savedQuotes.map((quote, index) => (
          <div key={index} className="saved-quote-box">
            <p className="saved-quote-text">"{quote.quote}"</p>
            <p className="saved-quote-author">- {quote.author}</p>
          </div>
        ))
      ) : (
        <p className="no-quote">No quotes saved.</p>
      )}
       <footer className="footer"><Link to="/quotes">
       <button>
  <span class="transition"></span>
  <span class="gradient"></span>
  <span class="label">Go Back</span>
</button>

      </Link>
      </footer>
      
    </div>
  );
};

export default SavedQuotes;