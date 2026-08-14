import { Link } from "react-router-dom";
import {
  FaCompass,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

import "./Footer.css";

function Footer() {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="travel-footer">

      <div className="container travel-footer-main">

        {/* BRAND */}

        <div className="travel-footer-brand">

          <Link
            className="travel-footer-logo"
            to="/"
            onClick={scrollTop}
          >
            <span className="travel-footer-logo-icon">
              <FaCompass />
            </span>

            <span className="travel-footer-logo-text">
              Travel<span>Bharat</span>
            </span>
          </Link>

          <p>
            Discover India's incredible tourist destinations
            state by state. Explore heritage, nature, culture
            and unforgettable places across the country.
          </p>

          <div className="travel-footer-social">
            <a
              href="#"
              aria-label="Facebook"
              onClick={(event) => event.preventDefault()}
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              onClick={(event) => event.preventDefault()}
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              onClick={(event) => event.preventDefault()}
            >
              <FaLinkedinIn />
            </a>
          </div>

        </div>

        {/* EXPLORE */}

        <div className="travel-footer-column">
          <h3>Explore</h3>

          <Link to="/" onClick={scrollTop}>
            Home
          </Link>

          <Link to="/search" onClick={scrollTop}>
            Explore Destinations
          </Link>

          <Link to="/states" onClick={scrollTop}>
            Indian States
          </Link>

          <Link to="/gallery" onClick={scrollTop}>
            Gallery
          </Link>
        </div>

        {/* INFORMATION */}

        <div className="travel-footer-column">
          <h3>Information</h3>

          <Link to="/about" onClick={scrollTop}>
            About TravelBharat
          </Link>

          <Link to="/contact" onClick={scrollTop}>
            Contact Us
          </Link>

          <Link to="/admin" onClick={scrollTop}>
            Admin Login
          </Link>
        </div>

        {/* CONTACT */}

        <div className="travel-footer-column travel-footer-contact">

          <h3>Contact</h3>

          <div>
            <span>
              <FaMapMarkerAlt />
            </span>

            <p>
              <small>Location</small>
              <strong>India</strong>
            </p>
          </div>

          <div>
            <span>
              <FaPhoneAlt />
            </span>

            <p>
              <small>Phone</small>
              <strong>+91 98765 43210</strong>
            </p>
          </div>

          <div>
            <span>
              <FaEnvelope />
            </span>

            <p>
              <small>Email</small>
              <strong>
                support@travelbharat.com
              </strong>
            </p>
          </div>

        </div>

      </div>

      {/* BOTTOM */}

      <div className="travel-footer-bottom">
        <div className="container">

          <p>
            © 2026 TravelBharat. All Rights Reserved.
          </p>

          <span>
            Explore India • Discover Culture • Experience Heritage
          </span>

        </div>
      </div>

    </footer>
  );
}

export default Footer;