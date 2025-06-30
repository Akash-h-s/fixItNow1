import React, { useState, useEffect } from 'react';
import workersImage from '../utils/photo1.webp'; // adjust path as per your project

const HeroSection = () => {
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(prev => !prev);
    }, 5000); // blink every 10 seconds

    return () => clearInterval(interval);
  }, []);

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
        justifyContent: 'flex-start', // shifted to start
        paddingLeft: '3%', // added left padding to shift content right
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
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
      <div style={{ maxWidth: '650px', zIndex: 10, marginLeft: '3rem' }}>
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            lineHeight: '1.2',
            overflow: 'hidden',
            display: 'inline-block',
            animation: 'slideFromTop 5s ease-in-out infinite',
          }}
        >
          <span style={{ color: '#FDE047', fontSize: '3.5rem' }}>✦</span>{' '}
          WORKER SPOTLIGHT
        </h1>

        <p
          style={{
            marginTop: '1rem',
            color: '#aaa',
            fontSize: '1.5rem',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            animation: 'moveText 10s linear infinite',
          }}
        >
          Your trusted platform to find and book skilled workers instantly.
        </p>

        <style>
          {`
            @keyframes slideFromTop {
              0% { transform: translateY(-100%); opacity: 0; }
              50% { transform: translateY(0); opacity: 1; }
              100% { transform: translateY(-100%); opacity: 0; }
            }

            @keyframes moveText {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
          `}
        </style>
      </div>

      {/* RIGHT IMAGE */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img
          src={workersImage}
          alt="Workers"
          style={{
            maxWidth: '90%',
            maxHeight: '90vh',
            width: 'auto',
            height: 'auto',
            opacity: blink ? 1 : 0.3,
            transition: 'opacity 1s ease-in-out',
          }}
        />
      </div>
    </div>
  );
};

export default HeroSection;
