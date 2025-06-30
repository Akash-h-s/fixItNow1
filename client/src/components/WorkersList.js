import React, { useEffect, useState } from 'react';
import TrackWorker from './TrackWorker';

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
  const [userRole, setUserRole] = useState(null); // 👈 New state to store role

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        const loggedInUser = JSON.parse(storedUser);
        setUserId(loggedInUser._id);
        setUserRole(loggedInUser.role); // 👈 Store the role
      }
    } catch {
      console.error('Invalid user data in localStorage');
    }
  }, []);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/workers');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setWorkers(await res.json());
      } catch (err) {
        console.error('Failed to fetch workers:', err);
      }
    };
    const fetchUserLocation = () => {
      navigator.geolocation?.getCurrentPosition(
        ({ coords }) => setUserCoords({ lat: coords.latitude, lng: coords.longitude }),
        (err) => console.error('Geolocation error:', err)
      );
    };
    fetchWorkers();
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

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Available Workers</h2>
      <div style={styles.grid}>
        {workers.map((worker) => (
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
            <p style={{ color: worker.available ? '#2e7d32' : '#c62828' }}>
              {worker.available ? 'Available' : 'Booked'}
            </p>

            {/* 👇 Hide Book Now if user is a worker */}
            {userRole !== 'worker' && (
              <button
                onClick={() => handleBookClick(worker)}
                disabled={!worker.available}
                style={{
                  ...styles.bookButton,
                  backgroundColor: worker.available ? '#1976d2' : '#bbb',
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
            {/* {distance && arrivalTime && (
              <div style={styles.etaBox}>
                <p><strong>Distance:</strong> {distance}</p>
                <p><strong>ETA:</strong> {arrivalTime}</p>
              </div>
            )} */}
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

// Keep your existing styles object here


// 🔧 Styles below remain unchanged
const styles = {
  popupPhoto: {
  width: 100,
  height: 100,
  borderRadius: '50%',
  objectFit: 'cover',
  margin: '0 auto 10px',
  display: 'block',
  border: '2px solid #ddd'
},
popupNoPhoto: {
  width: 100,
  height: 100,
  borderRadius: '50%',
  backgroundColor: '#eee',
  margin: '0 auto 10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  color: '#999'
},
popupTitle: {
  textAlign: 'center',
  marginBottom: 15
}
,  container: { padding: 20, maxWidth: 1200, margin: '0 auto' },
  header:    { textAlign: 'center', margin: '20px 0' },
  grid:      {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: 10,
    padding: 15,
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #eee'
  },
  noPhoto: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    margin: '0 auto 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#888'
  },
  name: { margin: '10px 0 5px' },
  bookButton: {
    marginTop: 10,
    padding: '10px 20px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: 5,
    color: '#fff',
    transition: 'background-color 0.2s'
  },
  popupOverlay: {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  popup: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90vw',
    maxWidth: 500,
    position: 'relative',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
  },
  closeBtn: {
    position: 'absolute', top: 10, right: 10,
    background: 'none', border: 'none', fontSize: 24, cursor: 'pointer'
  },
  label: { display: 'block', marginBottom: 5, fontWeight: '600' },
  input: {
    width: '100%', padding: 10, marginBottom: 15,
    borderRadius: 5, border: '1px solid #ddd'
  },
  etaBox: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15
  },
  actions: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  confirmBtn: {
    flex: 1, padding: '10px', backgroundColor: '#2e7d32',
    color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer'
  },
  mapBtn: {
    flex: 1, padding: '10px', backgroundColor: '#1976d2',
    color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer'
  },
  callBtn: {
    flex: 1, padding: '10px', backgroundColor: '#f57f17',
    color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer'
  },
  mapOverlay: {
    position: 'fixed', top: 0, left: 0,
    width: '100%', height: '100%',
    backgroundColor: '#fff', zIndex: 2000
  },
  mapClose: {
    padding: 10, backgroundColor: '#c62828',
    color: '#fff', border: 'none', fontSize: 18, cursor: 'pointer'
  }
};

export default WorkersList;
