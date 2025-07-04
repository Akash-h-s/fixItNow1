import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LocationSearch from '../components/LocationSearch';

const Signup = () => {
  const [formData, setFormData] = useState({
    role: 'user',
    email: '',
    password: '',
    name: '',
    workSpecification: '',
    experience: '',
    location: '',
    phoneNumber: '',
    photo: null,
    qrCode: null,
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleLocationSelect = (loc) => {
    setFormData((prev) => ({ ...prev, location: loc }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');

    // Email validation: must contain '@gmail.com'
    if (!formData.email.includes('@gmail.com')) {
      setMessage('Email must be a valid Gmail address ending with @gmail.com');
      return;
    }

    // Password validation: at least 8 characters
    if (formData.password.length < 8) {
      setMessage('Password must be at least 8 characters long');
      return;
    }

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if ((key === 'photo' || key === 'qrCode') && formData.role !== 'worker') return;
        if (val) form.append(key, val);
      });

      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        login(data.user);
        navigate('/');
      } else {
        setMessage(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error connecting to server');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Signup</h2>
      <form onSubmit={handleSignup} style={styles.form} encType="multipart/form-data">
        <select name="role" value={formData.role} onChange={handleChange} style={styles.input}>
          <option value="user">User</option>
          <option value="worker">Worker</option>
        </select>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="phoneNumber"
          type="tel"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <LocationSearch onSelect={handleLocationSelect} />

        {formData.role === 'worker' && (
          <>
            <input
              name="workSpecification"
              placeholder="Work Specialization"
              value={formData.workSpecification}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              name="experience"
              placeholder="Experience (e.g. 3 years)"
              value={formData.experience}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <label style={styles.label}>Upload Profile Photo:</label>
            <input
              name="photo"
              type="file"
              accept="image/*"
              onChange={handleChange}
              required
              style={styles.input}
            />

            <label style={styles.label}>Upload QR Code (for payment):</label>
            <input
              name="qrCode"
              type="file"
              accept="image/*"
              onChange={handleChange}
              required
              style={styles.input}
            />
          </>
        )}

        <button type="submit" style={styles.button}>Sign Up</button>
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '2rem auto',
    padding: '2rem',
    boxShadow: '0 0 10px #ccc',
    borderRadius: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '0.7rem',
    marginBottom: '1rem',
    fontSize: '1rem',
  },
  label: {
    fontWeight: '600',
    marginBottom: '0.3rem',
  },
  button: {
    padding: '0.7rem',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Signup;
