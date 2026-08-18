import { Link } from "react-router-dom";
import {
  FaArrowRight,
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
    <footer className="tb-footer">

      {/* =========================================
          TOP CTA
      ========================================== */}

      <div className="container tb-footer-cta-wrap">

        <div className="tb-footer-cta">

          <div>
            <span>
              READY TO DISCOVER INDIA?
            </span>

            <h2>
              Your next journey
              <br />
              starts here.
            </h2>
          </div>

          <div className="tb-footer-cta-right">

            <p>
              Explore destinations, states, culture,
              heritage and unforgettable experiences
              across Incredible India.
            </p>

            <Link to="/search">
              Explore India

              <FaArrowRight />
            </Link>

          </div>

        </div>

      </div>

      {/* =========================================
          MAIN FOOTER
      ========================================== */}

      <div className="container tb-footer-main">

        {/* BRAND */}

        <div className="tb-footer-brand">

          <Link
            to="/"
            onClick={scrollTop}
            className="tb-footer-logo"
          >
            <div className="tb-footer-logo-icon">
              <FaCompass />
            </div>

            <div className="tb-footer-logo-copy">
              <strong>
                Travel<span>Bharat</span>
              </strong>

              <small>
                DISCOVER INDIA
              </small>
            </div>
          </Link>

          <p>
            Discover India's incredible destinations
            state by state — from heritage landmarks
            and royal cities to peaceful landscapes,
            beaches and unforgettable journeys.
          </p>

          <div className="tb-footer-socials">

            <a
              href="#"
              aria-label="Facebook"
              onClick={(event) =>
                event.preventDefault()
              }
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              onClick={(event) =>
                event.preventDefault()
              }
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              onClick={(event) =>
                event.preventDefault()
              }
            >
              <FaLinkedinIn />
            </a>

          </div>

        </div>

        {/* EXPLORE */}

        <div className="tb-footer-column">

          <span className="tb-footer-column-number">
            01
          </span>

          <h3>
            Explore
          </h3>

          <Link
            to="/"
            onClick={scrollTop}
          >
            Home
          </Link>

          <Link
            to="/search"
            onClick={scrollTop}
          >
            Destinations
          </Link>

          <Link
            to="/states"
            onClick={scrollTop}
          >
            Indian States
          </Link>

          <Link
            to="/gallery"
            onClick={scrollTop}
          >
            Gallery
          </Link>

        </div>

        {/* COMPANY */}

        <div className="tb-footer-column">

          <span className="tb-footer-column-number">
            02
          </span>

          <h3>
            TravelBharat
          </h3>

          <Link
            to="/about"
            onClick={scrollTop}
          >
            About Us
          </Link>

          <Link
            to="/contact"
            onClick={scrollTop}
          >
            Contact
          </Link>

          <Link
            to="/admin"
            onClick={scrollTop}
          >
            Admin Login
          </Link>

        </div>

        {/* CONTACT */}

        <div className="tb-footer-column tb-footer-contact">

          <span className="tb-footer-column-number">
            03
          </span>

          <h3>
            Contact
          </h3>

          <div className="tb-footer-contact-item">

            <div>
              <FaMapMarkerAlt />
            </div>

            <p>
              <small>
                Location
              </small>

              <strong>
                India
              </strong>
            </p>

          </div>

          <div className="tb-footer-contact-item">

            <div>
              <FaPhoneAlt />
            </div>

            <p>
              <small>
                Phone
              </small>

              <strong>
                +91 98765 43210
              </strong>
            </p>

          </div>

          <div className="tb-footer-contact-item">

            <div>
              <FaEnvelope />
            </div>

            <p>
              <small>
                Email
              </small>

              <strong>
                support@travelbharat.com
              </strong>
            </p>

          </div>

        </div>

      </div>

      {/* =========================================
          BOTTOM
      ========================================== */}

      <div className="tb-footer-bottom">

        <div className="container">

          <p>
            © 2026 TravelBharat. All Rights Reserved.
          </p>

          <div className="tb-footer-bottom-center">
            <span></span>

            Incredible India

            <span></span>
          </div>

          <p>
            Explore • Discover • Experience
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;