import React, { useState } from 'react';

const LocationSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${value}`
      );
      const data = await res.json();
      setResults(data);
    } else {
      setResults([]);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder="Search Location"
        value={query}
        onChange={handleChange}
        required
        style={{
          padding: '0.7rem',
          marginBottom: '1rem',
          fontSize: '1rem',
          width: '100%',
        }}
      />
      {results.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            background: '#fff',
            border: '1px solid #ccc',
            maxHeight: '150px',
            overflowY: 'scroll',
            zIndex: 1,
            listStyle: 'none',
            padding: 0,
            width: '100%',
          }}
        >
          {results.map((place, i) => (
            <li
              key={i}
              onClick={() => {
                setQuery(place.display_name);
                setResults([]);
                onSelect(place.display_name);
              }}
              style={{
                padding: '0.5rem',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
              }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;
