import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const [workers, setWorkers] = useState([]);
  const [currentWorker, setCurrentWorker] = useState(null);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/workers');
        const data = await res.json();
        setWorkers(data);
        if (data.length > 0) {
          setCurrentWorker(data[Math.floor(Math.random() * data.length)]);
        }
      } catch (err) {
        console.error('Failed to fetch workers:', err);
      }
    };
    fetchWorkers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (workers.length > 0) {
        setCurrentWorker(workers[Math.floor(Math.random() * workers.length)]);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [workers]);

  return (
    <div
      style={{
        width: '99.455vw', // Ensure full viewport width
        marginLeft: 'calc(-50vw + 50%)', // Remove parent container side gaps
        background: 'linear-gradient(to bottom, #0d001c, #000)',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding:'0rem',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1300px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0rem',
          flexWrap: 'wrap',
        }}
      >
        {/* LEFT TEXT SECTION */}
        <div style={{ maxWidth: '900px', zIndex: 10 }}>
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
      fontSize: '1.1rem',
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
        0% {
          transform: translateY(-100%);
          opacity: 0;
        }
        50% {
          transform: translateY(0);
          opacity: 1;
        }
        100% {
          transform: translateY(-100%);
          opacity: 0;
        }
      }

      @keyframes moveText {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
    `}
  </style>
</div>


        {/* RIGHT ANIMATION & WORKER CARD */}
        <div style={{ position: 'relative', width: '350px', height: '350px' }}>
          {/* ROTATING BUBBLE */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'radial-gradient(circle at center, #8b5cf6, #4c1d95)',
              opacity: 0.7,
              filter: 'blur(100px)',
            }}
          />

          {/* WORKER CARD */}
          {currentWorker && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-8deg)',
                width: '300px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '1rem',
                padding: '1.5rem',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                zIndex: 10,
              }}
            >
              {currentWorker.photo ? (
                <img
                  src={`http://localhost:5000/uploads/${currentWorker.photo}`}
                  alt={currentWorker.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '1rem',
                    border: '2px solid #fff'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#eee',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#555'
                  }}
                >
                  No Photo
                </div>
              )}
              <h3 style={{ margin: '0.5rem 0' }}>{currentWorker.name}</h3>
              <p><strong>Skill:</strong> {currentWorker.workSpecification || 'N/A'}</p>
              <p><strong>Location:</strong> {currentWorker.location || 'N/A'}</p>
              <p style={{ color: currentWorker.available ? '#2e7d32' : '#c62828' }}>
                {currentWorker.available ? 'Available' : 'Booked'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
