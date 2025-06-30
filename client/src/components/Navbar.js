import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [paymentImageUrl, setPaymentImageUrl] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      if (storedUser.role === 'worker') {
        if (storedUser.qrCode) {
          setQrCodeUrl(`http://localhost:5000/uploads/${storedUser.qrCode}`);
        }
        if (storedUser.paymentImage) {
          setPaymentImageUrl(`http://localhost:5000/uploads/${storedUser.paymentImage}`);
        }
      }
      if (storedUser.photo) {
        setPhotoUrl(`http://localhost:5000/uploads/${storedUser.photo}`);
      } else {
        setPhotoUrl('');
      }
    }
  }, [user]);

  // ⛔ Hide dropdown on route change
  useEffect(() => {
    setShowDropdown(false);
  }, [location.pathname]);

  const renderAvatar = () => {
    if (photoUrl) {
      return <img src={photoUrl} alt="Profile" style={styles.avatar} />;
    } else if (user?.name) {
      return <div style={styles.userInitial}>{user.name.charAt(0).toUpperCase()}</div>;
    } else {
      return <div style={styles.userInitial}>U</div>;
    }
  };

  return (
    <>
      <style>{`
        .nav-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
          margin: 0 1rem;
        }
        .nav-link:hover {
          color: #facc15;
        }
      `}</style>

      <nav style={styles.navbar}>
        <div style={styles.logo}>🌿FixItNow</div>
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/workerslist">Services</Link>

          {user?.role === 'worker' && qrCodeUrl && (
            <button className="nav-link" onClick={() => setShowQR(true)} style={styles.linkButton}>QR Code</button>
          )}
          {user?.role === 'worker' && paymentImageUrl && (
            <button className="nav-link" onClick={() => setShowPayment(true)} style={styles.linkButton}>Payment</button>
          )}

          {!user ? (
            <>
              <Link className="nav-link" to="/signup">Signup</Link>
              <Link className="nav-link" to="/login">Login</Link>
            </>
          ) : (
            <div style={styles.accountIcon} onClick={() => setShowDropdown(!showDropdown)}>
              {renderAvatar()}
              {showDropdown && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownHeader}>
                    <div style={styles.userName}>{user.name}</div>
                    <div style={styles.userRole}>{user.role}</div>
                  </div>
                  <button style={styles.logoutButton} onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {showQR && (
        <div style={styles.qrPopup}>
          <div style={styles.qrContainer}>
            <h3>Your QR Code</h3>
            <img src={qrCodeUrl} alt="QR Code" style={{ width: 350, height: 350 }} />
            <br />
            <button onClick={() => setShowQR(false)} style={styles.closeBtn}>Close</button>
          </div>
        </div>
      )}

      {showPayment && (
        <div style={styles.qrPopup}>
          <div style={styles.qrContainer}>
            <h3>Payment QR</h3>
            <img src={paymentImageUrl} alt="Payment" style={{ width: 350, height: 350 }} />
            <br />
            <button onClick={() => setShowPayment(false)} style={styles.closeBtn}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    backgroundColor: '#111827',
    color: 'white',
    alignItems: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'white',
    fontWeight: '500',
    margin: '0 1rem',
  },
  accountIcon: {
    marginLeft: '1rem',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #fff',
  },
  userInitial: {
    width: 35,
    height: 35,
    borderRadius: '50%',
    backgroundColor: '#facc15',
    color: '#111827',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: '3.2rem',
    right: 0,
    width: '180px',
    backgroundColor: '#f9fafb',
    color: '#111827',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    zIndex: 999,
  },
  dropdownHeader: {
    padding: '0.75rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
  },
  userName: {
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  userRole: {
    fontSize: '0.8rem',
    color: '#6b7280',
    marginTop: '0.2rem',
  },
  logoutButton: {
    padding: '0.6rem 1rem',
    backgroundColor: '#ef4444',
    border: 'none',
    color: 'white',
    borderRadius: '0 0 8px 8px',
    width: '100%',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  qrPopup: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  qrContainer: {
    background: 'white',
    padding: '2rem',
    borderRadius: '10px',
    textAlign: 'center',
  },
  closeBtn: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#111827',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Navbar;
