import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import QuoteWithImage from './components/QuoteWithImage';
import SavedQuotes from './components/SavedQuotes';
import './App.css';

function App() {
  const [username, setUsername] = useState('');

  const handleLogin = (username) => {
    setUsername(username);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login handleLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard username={username} />} />
        <Route path="/quotes" element={<QuoteWithImage />} />
        <Route path="/saved-quotes" element={<SavedQuotes />} />
      </Routes>
    </Router>
  );
}

export default App;
