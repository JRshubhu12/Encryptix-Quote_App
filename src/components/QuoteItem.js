import React from 'react';

const QuoteItem = ({ quote }) => {
  return (
    <div className="quote-item">
      <p>{quote.text}</p>
      <p>- {quote.author}</p>
    </div>
  );
};

export default QuoteItem;
