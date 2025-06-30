import React, { useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

const jobRoles = [
  {
    title: 'Plumber',
    openings: 240,
    icon: 'https://cdn-icons-png.flaticon.com/512/2965/3125480.png',
  },
  {
    title: 'Electrician',
    openings: 180,
    icon: 'https://cdn-icons-png.flaticon.com/512/2250/2250204.png',
  },
  {
    title: 'Carpenter',
    openings: 150,
    icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965563.png',
  },
  {
    title: 'Painter',
    openings: 132,
    icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965569.png',
  },
  {
    title: 'Driver',
    openings: 225,
    icon: 'https://cdn-icons-png.flaticon.com/512/1995/1995501.png',
  },
  {
    title: 'Cleaner',
    openings: 98,
    icon: 'https://cdn-icons-png.flaticon.com/512/1519/1519883.png',
  },
  {
    title: 'Welder',
    openings: 110,
    icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965566.png',
  },
  {
    title: 'Security Guard',
    openings: 145,
    icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965582.png',
  },
  // Repeating for scroll effect
  {
    title: 'Plumber',
    openings: 240,
    icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965567.png',
  },
  {
    title: 'Electrician',
    openings: 180,
    icon: 'https://cdn-icons-png.flaticon.com/512/2250/2250204.png',
  },
  {
    title: 'Carpenter',
    openings: 150,
    icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965563.png',
  },
];


const TrendingRoles = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    let animationId;
    let scrollSpeed = 1;

    const animateScroll = () => {
      container.scrollLeft += scrollSpeed;
      // Loop back
      if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        container.scrollLeft = 0;
      }
      animationId = requestAnimationFrame(animateScroll);
    };

    animateScroll();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const styles = {
  container: {
    padding: '2rem 1rem',
    color: 'white',
    backgroundColor: '#1c1c1c',
  },
  heading: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2rem',
    color: 'white',
  },
  scrollWrapper: {
    display: 'flex',
    overflowX: 'auto',
    gap: '1rem',
    paddingBottom: '1rem',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  roleCard: {
    minWidth: '220px',
    flexShrink: 0,
    backgroundColor: '#2f2f2f',  // Light black/dark gray background
    borderRadius: '12px',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',  // Shadow from Our Services page
    transition: 'box-shadow 0.3s ease',
    color: 'white',  // Make all text inside white by default
  },
  icon: {
    width: '40px',
    height: '40px',
    marginRight: '0.75rem',
  },
  roleDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  icon: {
  width: '40px',
  height: '40px',
  marginRight: '0.75rem',
  filter: 'brightness(0) invert(1)', // this turns colored PNG into white-ish icon
},

  title: {
    fontWeight: 600,
    fontSize: '1rem',
    color: 'white',  // Explicit white text
  },
  openings: {
    fontSize: '0.875rem',
    color: '#ccc',  // Lighter gray text for openings
  },
};

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Trending Job Roles on 🌿FixItNow</h2>
      <div style={styles.scrollWrapper} ref={scrollRef}>
        {jobRoles.map((role, index) => (
          <div
            key={index}
            style={styles.roleCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = styles.roleCard.boxShadow;
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={role.icon} alt={role.title} style={styles.icon} />
              <div style={styles.roleDetails}>
                <span style={styles.title}>{role.title}</span>
                <span style={styles.openings}>{role.openings} openings</span>
              </div>
            </div>
            <ChevronRight size={20} color="#999" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingRoles;
