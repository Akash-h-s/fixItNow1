import React from 'react';

const MapView = ({ latitude, longitude }) => {
  return (
    <div style={{ height: '300px', width: '100%', marginTop: '1rem', border: '1px solid #ccc' }}>
      <p>Map showing location at:</p>
      <p>Latitude: {latitude}</p>
      <p>Longitude: {longitude}</p>
      {/* Later you can integrate Google Maps or Leaflet here */}
    </div>
  );
};

export default MapView;
