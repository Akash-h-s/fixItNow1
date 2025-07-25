import React, { useEffect, useState } from 'react';
import TrackWorker from './TrackWorker';
import Hero from '../components/herosection';

const WorkersList = () => {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [formData, setFormData] = useState({ location: '', doorNumber: '' });
  const [distance, setDistance] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [userCoords, setUserCoords] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        const loggedInUser = JSON.parse(storedUser);
        setUserId(loggedInUser._id);
        setUserRole(loggedInUser.role);
      }
    } catch {
      console.error('Invalid user data in localStorage');
    }
  }, []);

  const fetchWorkers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/workers');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setWorkers(await res.json());
    } catch (err) {
      console.error('Failed to fetch workers:', err);
    }
  };

  useEffect(() => {
    fetchWorkers();
    const fetchUserLocation = () => {
      navigator.geolocation?.getCurrentPosition(
        ({ coords }) => setUserCoords({ lat: coords.latitude, lng: coords.longitude }),
        (err) => console.error('Geolocation error:', err)
      );
    };
    fetchUserLocation();
  }, []);

  useEffect(() => {
    document.body.style.overflow = showMap ? 'hidden' : 'auto';
  }, [showMap]);

  const handleBookClick = (worker) => {
    setSelectedWorker(worker);
    setFormData({ location: '', doorNumber: '' });
    setDistance('');
    setArrivalTime('');
    setShowBookingPopup(true);
    setShowMap(false);
  };

  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...formData, [name]: value };
    setFormData(newForm);

    if (newForm.location && newForm.doorNumber) {
      setDistance(`${(Math.random() * 8 + 2).toFixed(2)} km`);
      setArrivalTime(`${Math.floor(Math.random() * 15 + 10)} minutes`);
    } else {
      setDistance('');
      setArrivalTime('');
    }
  };

  const handleConfirmBooking = async () => {
    if (!formData.location || !formData.doorNumber) {
      alert('Please enter address and door number.');
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/workerRoutes/${selectedWorker._id}/book`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            location: formData.location,
            doorNumber: formData.doorNumber,
            userId,
          }),
        }
      );

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `HTTP error! status: ${res.status}`);
      }

      alert(data.message);
      setShowBookingPopup(false);

      fetchWorkers();

    } catch (err) {
      console.error('Booking error:', err);
      alert(`Booking failed: ${err.message}`);
    }
  };

  const handleContact = () => {
    if (selectedWorker?.phoneNumber) {
      window.open(`tel:${selectedWorker.phoneNumber}`, '_self');
    } else {
      alert('Worker phone number unavailable.');
    }
  };

  const handleClosePopup = () => {
    setShowBookingPopup(false);
    setShowMap(false);
  };

  // ✅ Filter workers by searchQuery
  const filteredWorkers = workers.filter(worker =>
    worker.workSpecification?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <Hero />
      <h2 style={styles.header}>Available Workers</h2>

      {/* ✅ Search bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by skill e.g. plumber"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.grid}>
        {filteredWorkers.map((worker) => (
          <div key={worker._id} style={styles.card}>
            {worker.photo ? (
              <img
                src={`http://localhost:5000/uploads/${worker.photo}`}
                alt={worker.name}
                style={styles.avatar}
              />
            ) : (
              <div style={styles.noPhoto}>No Photo</div>
            )}
            <h3 style={styles.name}>{worker.name}</h3>
            <p><strong>Skill:</strong> {worker.workSpecification || 'N/A'}</p>
            <p><strong>Location:</strong> {worker.location || 'N/A'}</p>
            <p style={{ color: worker.available ? '#90ee90' : '#f08080' }}>
              {worker.available ? 'Available' : 'Booked'}
            </p>

            {userRole === 'user' && (
              <button
                onClick={() => handleBookClick(worker)}
                disabled={!worker.available}
                style={{
                  ...styles.bookButton,
                  backgroundColor: worker.available ? '#1976d2' : '#555',
                  cursor: worker.available ? 'pointer' : 'not-allowed',
                }}
              >
                {worker.available ? 'Book Now' : 'Unavailable'}
              </button>
            )}
          </div>
        ))}
      </div>

      {showBookingPopup && selectedWorker && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <button style={styles.closeBtn} onClick={handleClosePopup}>×</button>
            {selectedWorker.photo ? (
              <img
                src={`http://localhost:5000/uploads/${selectedWorker.photo}`}
                alt={selectedWorker.name}
                style={styles.popupPhoto}
              />
            ) : (
              <div style={styles.popupNoPhoto}>No Photo</div>
            )}
            <h3 style={styles.popupTitle}>Book {selectedWorker.name}</h3>
            <label style={styles.label}>Your Address:</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleBookingFormChange}
              placeholder="Enter your full address"
              style={styles.input}
            />
            <label style={styles.label}>Door Number:</label>
            <input
              name="doorNumber"
              value={formData.doorNumber}
              onChange={handleBookingFormChange}
              placeholder="Flat/Door #"
              style={styles.input}
            />
            <div style={styles.actions}>
              <button style={styles.confirmBtn} onClick={handleConfirmBooking}>Confirm Booking</button>
              <button style={styles.mapBtn} onClick={() => setShowMap(true)}>View Location</button>
              <button style={styles.callBtn} onClick={handleContact}>Call Worker</button>
            </div>
          </div>
        </div>
      )}

      {showMap && selectedWorker && (
        <div style={styles.mapOverlay}>
          <button style={styles.mapClose} onClick={() => setShowMap(false)}>Close Map</button>
          <TrackWorker worker={selectedWorker} userCoords={userCoords} />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { width: '100vw', margin: 0, padding: 0, backgroundColor: '#1c1c1c', color: 'white', minHeight: '100vh', overflowX: 'hidden' },
  header: { textAlign: 'center', margin: '20px 0' },
  searchContainer: { textAlign: 'center', marginBottom: 20 },
  searchInput: { padding: 10, width: '80%', maxWidth: 400, borderRadius: 5, border: '1px solid #ccc', fontSize: 16 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, padding: '0 20px', boxSizing: 'border-box' },
  card: { border: '1px solid #444', borderRadius: 10, padding: 15, boxShadow: '0 2px 5px rgba(0,0,0,0.3)', textAlign: 'center', backgroundColor: '#2c2c2c' },
  avatar: { width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' },
  noPhoto: { width: 100, height: 100, borderRadius: '50%', backgroundColor: '#555', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ddd' },
  name: { margin: '10px 0 5px' },
  bookButton: { marginTop: 10, padding: '10px 20px', fontSize: '1rem', border: 'none', borderRadius: 5, color: '#fff', transition: 'background-color 0.2s' },
  popupOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  popup: { backgroundColor: '#333', color: '#fff', borderRadius: 10, padding: 20, width: '90vw', maxWidth: 500, position: 'relative', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' },
  closeBtn: { position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', fontSize: 24, color: '#fff', cursor: 'pointer' },
  label: { display: 'block', marginBottom: 5, fontWeight: '600' },
  input: { width: '100%', padding: 10, marginBottom: 15, borderRadius: 5, border: '1px solid #555', backgroundColor: '#222', color: '#fff' },
  actions: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  confirmBtn: { flex: 1, padding: '10px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' },
  mapBtn: { flex: 1, padding: '10px', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' },
  callBtn: { flex: 1, padding: '10px', backgroundColor: '#f57f17', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' },
  popupPhoto: { width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px', display: 'block', border: '2px solid #fff' },
  popupNoPhoto: { width: 100, height: 100, borderRadius: '50%', backgroundColor: '#555', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#ddd' },
  popupTitle: { textAlign: 'center', marginBottom: 15 },
  mapOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#fff', zIndex: 2000 },
  mapClose: { padding: 10, backgroundColor: '#c62828', color: '#fff', border: 'none', fontSize: 18, cursor: 'pointer' }
};

export default WorkersList;
