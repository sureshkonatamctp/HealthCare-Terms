import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [terms, setTerms] = useState([]);
  const [filteredTerms, setFilteredTerms] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetch('/data.json')
      .then((response) => response.json())
      .then((data) => {
        setTerms(data.termList);
        setFilteredTerms(data.termList);
      });
  }, []);

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    filterTerms(searchText, letter);
  };

  const handleSearchChange = (event) => {
    const text = event.target.value;
    setSearchText(text);
    filterTerms(text, selectedLetter);
  };

  const filterTerms = (text, letter) => {
    let filtered = terms;
    if (letter) {
      filtered = filtered.filter((term) =>
        term.title.toUpperCase().startsWith(letter)
      );
    }
    if (text) {
      filtered = filtered.filter((term) =>
        term.title.toLowerCase().includes(text.toLowerCase())
      );
    }
    setFilteredTerms(filtered);
  };

  const isLetterDisabled = (letter) => {
    return !terms.some(
      (term) =>
        term.title.startsWith(letter) &&
        term.title.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const firstLetter = term.title[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(term);
    return acc;
  }, {});

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">Find Care</h1>
          <input
            type="text"
            className="search-box"
            placeholder="What are you looking for?"
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>
      </header>
      <nav className="alphabet-nav">
        <h2 className='sub-header-title '>Treatments, Services and Specialties</h2>
        <ul className="alphabet-list">
          {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map(
            (letter) => (
              <li
                key={letter}
                className={`alphabet-item ${
                  isLetterDisabled(letter) ? 'disabled' : ''
                } ${selectedLetter === letter ? 'selected' : ''}`}
                onClick={() => !isLetterDisabled(letter) && handleLetterClick(letter)}
              >
                {letter}
              </li>
            )
          )}
        </ul>
      </nav>
      <main className="terms-container">
        {Object.keys(groupedTerms).length > 0 ? (
          Object.keys(groupedTerms).map((letter) => (
            <div key={letter} className="term-group">
              <h2 className="term-group-title">{letter}</h2>
              <ul className="term-list">
                {groupedTerms[letter].map((term, index) => (
                  <li key={index} className="term-item">
                    <a href={term.link} className="term-link">
                      {term.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="no-results">No results found</p>
        )}
      </main>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 HCA Houston Healthcare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
