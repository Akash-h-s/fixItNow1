import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <>
      <footer className="custom-footer">
        <div className="footer-container">
          {/* Brand */}
          <div>
            <h2 className="brand">🌿FixItNow</h2>
            <p className="desc">
              Connecting skilled workers with those in need—quickly, reliably, and locally.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="heading">Services</h3>
            <ul>
              <li><a href="#">Plumbing</a></li>
              <li><a href="#">Electrical</a></li>
              <li><a href="#">Cleaning</a></li>
              <li><a href="#">Carpentry</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="heading">Quick Links</h3>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Hire Now</a></li>
              <li><a href="#">Terms & Privacy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="heading">Contact Us</h3>
            <p>Email: support@fixitnow.com</p>
            <p>Phone: +91 6362434523</p>
            <div className="social">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          &copy; 2025 🌿FixItNow. All rights reserved.
        </div>
      </footer>

      {/* CSS styles */}
      <style jsx="true">{`
        .custom-footer {
          background-color: #111827;
          color: #d1d5db;
          padding: 2.5rem 1rem;
        }

        .footer-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: auto;
        }

        .brand {
          font-size: 1.5rem;
          font-weight: bold;
          color: #3b82f6;
        }

        .desc {
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .heading {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #fff;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        li {
          margin-bottom: 0.5rem;
        }

        a {
          text-decoration: none;
          color: #d1d5db;
        }

        a:hover {
          color: #3b82f6;
        }

        .social {
          display: flex;
          gap: 1rem;
          font-size: 1.25rem;
          margin-top: 1rem;
        }

        .footer-bottom {
          text-align: center;
          font-size: 0.875rem;
          color: #9ca3af;
          margin-top: 2rem;
        }
      `}</style>
    </>
  );
};

export default Footer;
