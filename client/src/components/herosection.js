import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % facts.length);
    }, 5000); // change fact every 5 seconds

    const blinkInterval = setInterval(() => {
      setBlink(prev => !prev);
    }, 1000); // blink effect every 1 second

    return () => {
      clearInterval(factInterval);
      clearInterval(blinkInterval);
    };
  }, [facts.length]);

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
        {/* Worker Spotlight */}
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
          WORKERS SPOTLIGHT
        </h1>

        {/* Interesting Fact */}
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
