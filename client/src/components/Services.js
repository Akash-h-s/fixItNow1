import React from 'react';

const servicesData = [
  { id: 1, name: 'Plumber', description: 'Expert in fixing leaks, pipes, and water systems.' },
  { id: 2, name: 'Electrician', description: 'Certified to handle electrical wiring and repairs.' },
  { id: 3, name: 'Contractor', description: 'Oversees construction projects from start to finish.' },
  { id: 4, name: 'Painter', description: 'Provides interior and exterior painting services.' },
  { id: 5, name: 'Carpenter', description: 'Specializes in woodwork and furniture making.' },
  { id: 6, name: 'Welder', description: 'Works with metal to build or repair structures.' },
  { id: 7, name: 'Mechanic', description: 'Maintains and repairs vehicles and machinery.' },
  { id: 8, name: 'Mason', description: 'Builds structures with bricks, stones, and cement.' },
];

const Services = () => {
  return (
    <div style={styles.section}>
      <h2 style={styles.title}>Our Services</h2>
      <div style={styles.grid}>
        {servicesData.map((service) => (
          <div key={service.id} style={styles.card}>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  section: {
    backgroundColor: '#1c1c1c', // Same dark color for full section
    color: 'white',
    padding: '50px 20px',
    textAlign: 'center',
    minHeight: '50vh',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '30px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', // 4 cards per row
    gap: '25px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#2a2a2a', // Slightly lighter than background
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #444',
    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.08)',
    transition: 'transform 0.2s',
  },
};

export default Services;
