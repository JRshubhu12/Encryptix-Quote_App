import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuote } from '../utils/api';
import './Dashboard.css';

const Dashboard = ({ username }) => {
  const [quote, setQuote] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const fetchedQuote = await getQuote();
        setQuote(fetchedQuote[0].quote);
      } catch (error) {
        console.error('Error fetching quote:', error);
      }
    };

    fetchQuote();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      navigate('/login');
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome, {username}!</h1>
      <p>"{quote}"</p>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default Dashboard;