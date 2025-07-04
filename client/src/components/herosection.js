import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // for navigation
import workersImage from '../utils/photo1.webp'; // adjust path as per your project

const HeroSection = () => {
  const facts = [
    "🔧 Blue-collar workers build our daily world.",
    "🛠️ They form over 60% of India's workforce.",
    "🚚 Without them, supply chains stall overnight.",
    "⚡ Electricians and plumbers keep homes running smoothly.",
    "🏗️ They are skilled experts, not just labourers.",
    "🧰 Hiring them empowers families and communities.",
  ];

  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [blink, setBlink] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % facts.length);
    }, 5000);

    const blinkInterval = setInterval(() => {
      setBlink(prev => !prev);
    }, 1000);

    return () => {
      clearInterval(factInterval);
      clearInterval(blinkInterval);
    };
  }, [facts.length]);

  const randomContacts = [
    "Akash - +91 6360434523",
    "Sita Devi - +91 9123456780",
    "Helping Hands NGO - +91 9988776655",
    "Community Help Center - +91 8899776655",
  ];

  const handleBecomeWorker = () => {
    navigate('/signup');
  };

  const handleContactUs = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        background: 'linear-gradient(to bottom, #0d001c, #000)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '3%',
        paddingRight: '3%',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Modal Popup */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              color: 'black',
              padding: '2rem',
              borderRadius: '10px',
              width: '300px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ marginBottom: '1rem' }}>Helping Committee</h3>
            <ul style={{ textAlign: 'left' }}>
              {randomContacts.map((contact, index) => (
                <li key={index}>{contact}</li>
              ))}
            </ul>
            <button
              onClick={closeModal}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '5px',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* TOP CENTER TEXT */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          maxWidth: '900px',
          zIndex: 20,
        }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Welcome to Our Worker Platform
        </h2>
        <p style={{ fontSize: '1rem', color: '#ccc' }}>
          Discover and connect with skilled professionals near you to get your work done efficiently.
        </p>
      </div>

      {/* LEFT TEXT SECTION */}
      <div style={{ maxWidth: '700px', zIndex: 10 }}>
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            lineHeight: '1.2',
            overflow: 'hidden',
            display: 'inline-block',
          }}
        >
          <span style={{ color: '#FDE047', fontSize: '3.5rem' }}>✦</span>{' '}
          WORKERS SPOTLIGHT
        </h1>

        <p
          style={{
            marginTop: '0.5rem',
            fontSize: '1.1rem',
            color: '#ddd',
            maxWidth: '600px',
          }}
        >
          Celebrating the hands that build, repair, and sustain our communities every day.
        </p>

        <p
          style={{
            marginTop: '1rem',
            color: blink ? '#FDE047' : '#aaa',
            fontSize: '1.3rem',
            fontWeight: '500',
            minHeight: '2rem',
            transition: 'color 0.5s ease-in-out',
          }}
        >
          {facts[currentFactIndex]}
        </p>

        <p
          style={{
            marginTop: '1rem',
            fontSize: '1rem',
            color: '#bbb',
            maxWidth: '600px',
          }}
        >
          Our platform bridges the gap between skilled workers and those who need their expertise, ensuring fair opportunities and reliable services.
        </p>

        {/* Action Buttons */}
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleContactUs}
            style={{
              padding: '0.8rem 1.2rem',
              backgroundColor: '#27ae60',
              border: 'none',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            Contact Us
          </button>
          <button
            onClick={handleBecomeWorker}
            style={{
              padding: '0.8rem 1.2rem',
              backgroundColor: '#2980b9',
              border: 'none',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            Become a Worker
          </button>
        </div>

        <style>
          {`
            @keyframes slideFromTop {
              0% { transform: translateY(-100%); opacity: 0; }
              50% { transform: translateY(0); opacity: 1; }
              100% { transform: translateY(-100%); opacity: 0; }
            }
          `}
        </style>
      </div>

      {/* RIGHT IMAGE + QUOTE BELOW */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src={workersImage}
          alt="Workers"
          style={{
            maxWidth: '90%',
            maxHeight: '70vh',
            width: 'auto',
            height: 'auto',
            opacity: blink ? 1 : 0.3,
            transition: 'opacity 0.8s ease-in-out',
          }}
        />
        <p
          style={{
            marginTop: '1rem',
            fontSize: '1.2rem',
            fontStyle: 'italic',
            textAlign: 'center',
            maxWidth: '80%',
            color: '#ccc',
          }}
        >
          "No job is too small when done with great skill and dedication."
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
