import React from 'react';
import QuoteItem from './QuoteItem';

const QuoteList = ({ quotes }) => {
  return (
    <div className="quote-list">
      {quotes.map((quote, index) => (
        <QuoteItem key={index} quote={quote} />
      ))}
    </div>
  );
};

export default QuoteList;
