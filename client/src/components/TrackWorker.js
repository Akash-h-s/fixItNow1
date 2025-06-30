import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for marker icons in Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const TrackWorker = ({ worker, fullScreen = false }) => {
  const [workerCoords, setWorkerCoords] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Generates a nearby coordinate without using .toFixed before calculation
  const generateNearbyCoords = (lat, lng) => {
    const offsetLat = Math.random() * 0.01 - 0.005; // +/- 0.005
    const offsetLng = Math.random() * 0.01 - 0.005;
    return {
      lat: lat + offsetLat,
      lng: lng + offsetLng,
    };
  };

  const fetchCoordinates = async () => {
    try {
      setLoading(true);

      // 1. Worker coordinates
      if (!worker?.location) {
        setError('Worker location not provided.');
        return;
      }

      const workerRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(worker.location)}&format=json&limit=1`);
      const workerData = await workerRes.json();
      if (!workerData.length) {
        setError('Worker location not found on map.');
        return;
      }

      const wCoords = {
        lat: parseFloat(workerData[0].lat),
        lng: parseFloat(workerData[0].lon),
      };
      setWorkerCoords(wCoords);

      // 2. User location from localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError('User not logged in.');
        return;
      }

      const user = JSON.parse(storedUser);
      if (!user?.location) {
        setError('User location not found.');
        return;
      }

      const userRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(user.location)}&format=json&limit=1`);
      const userData = await userRes.json();
      if (!userData.length) {
        setError('User location not found on map.');
        return;
      }

      let uCoords = {
        lat: parseFloat(userData[0].lat),
        lng: parseFloat(userData[0].lon),
      };

      // 3. If city same, apply offset to avoid marker collision
      const userCity = user.location.toLowerCase().split(' ')[0];
      const workerCity = worker.location.toLowerCase().split(' ')[0];
      if (userCity === workerCity) {
        uCoords = generateNearbyCoords(wCoords.lat, wCoords.lng);
      }

      setUserCoords(uCoords);
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Failed to fetch coordinates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordinates();
  }, [worker]);

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Loading map...</div>;
  if (error) return <div style={{ padding: 20, color: 'red', textAlign: 'center' }}>{error}</div>;
  if (!workerCoords) return null;

 return (
  <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
    <MapContainer
      center={[workerCoords.lat, workerCoords.lng]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={[workerCoords.lat, workerCoords.lng]}>
        <Popup>
          <strong>{worker.name}</strong><br />
          {worker.location}
        </Popup>
      </Marker>

      {userCoords && (
        <Marker position={[userCoords.lat, userCoords.lng]}>
          <Popup>Your Location</Popup>
        </Marker>
      )}
    </MapContainer>
  </div>
);

};

export default TrackWorker;
