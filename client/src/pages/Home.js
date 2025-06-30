import React, { useState, useEffect } from 'react';
import Services from '../components/Services';
import Hero from '../components/herosection'
import Roles from '../components/Roles';
import Choose from '../components/Choose';
import Footer from '../components/Footer';
import WorkersList from '../components/WorkersList';
import video1 from './vedios/bluecolar1.mp4';
import video2 from './vedios/bluecolar2.mp4';
import video3 from './vedios/bluecolar3.mp4';


const videos = [video1, video2, video3]; // Add more if needed

const Home = () => {
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 10000); // Change video every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section with Background Video */}
      <div style={styles.heroSection}>
        <video key={videos[currentVideo]} autoPlay loop muted style={styles.backgroundVideo}>
          <source src={videos[currentVideo]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div style={styles.welcomeContent}>
          <h1>Empowering Blue-Collar Workers Everywhere</h1>
          <p>Connecting skilled workers with meaningful job opportunities—fast, simple, and secure.</p>
        </div>
      </div>

      {/* Services Section */}
      <Services />

      {/* Workers List Section (optional) */}
      <Roles /> 
      <Choose/>
      
      <Footer/> 
    </>
    
  );
};

const styles = {
  heroSection: {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
    color: 'white',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: -1,
    filter: 'brightness(0.5)',
  },
  welcomeContent: {
    position: 'relative',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 2rem',
    textShadow: '2px 2px 4px #000',
  },
};

export default Home;
