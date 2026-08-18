import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCompass,
  FaMapMarkerAlt,
  FaSearch,
  FaStar,
} from "react-icons/fa";

import "./Hero.css";

function Hero() {
  return (
    <section className="hero-premium">

      {/* BACKGROUND OVERLAYS */}

      <div className="hero-premium-overlay"></div>
      <div className="hero-premium-glow hero-glow-orange"></div>
      <div className="hero-premium-glow hero-glow-teal"></div>

      {/* MAIN CONTENT */}

      <div className="container hero-premium-content">

        <div className="hero-premium-copy">

          {/* TOP BADGE */}

          <div className="hero-premium-badge">
            <span className="hero-premium-badge-dot"></span>

            INCREDIBLE INDIA

            <strong>
              • TRAVELBHARAT
            </strong>
          </div>

          {/* HEADING */}

          <h1>
            Discover India.
            <span>
              Feel Every Journey.
            </span>
          </h1>

          {/* DESCRIPTION */}

          <p className="hero-premium-description">
            Explore India's most beautiful destinations,
            timeless heritage, royal cities, misty mountains,
            beaches and unforgettable experiences — all in
            one place.
          </p>

          {/* ACTIONS */}

          <div className="hero-premium-actions">

            <Link
              to="/search"
              className="hero-premium-primary"
            >
              <FaCompass />

              Explore India

              <FaArrowRight />
            </Link>

            <Link
              to="/states"
              className="hero-premium-secondary"
            >
              <FaMapMarkerAlt />

              Explore States
            </Link>

          </div>

          {/* SEARCH */}

          <div className="hero-premium-search">

            <div className="hero-search-icon">
              <FaSearch />
            </div>

            <div className="hero-search-content">

              <small>
                FIND YOUR NEXT DESTINATION
              </small>

              <input
                type="text"
                placeholder="Search places, cities or states..."
              />

            </div>

            <Link to="/search">
              Search
              <FaArrowRight />
            </Link>

          </div>

          {/* STATS */}

          <div className="hero-premium-bottom">

            <div className="hero-premium-stats">

              <div>
                <strong>28+</strong>
                <span>States</span>
              </div>

              <div>
                <strong>700+</strong>
                <span>Cities</span>
              </div>

              <div>
                <strong>5000+</strong>
                <span>Destinations</span>
              </div>

            </div>

            <div className="hero-premium-trust">

              <div className="hero-rating-stars">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>

              <div>
                <strong>
                  Explore Incredible India
                </strong>

                <span>
                  Curated destinations & experiences
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* FLOATING EXPERIENCE CARD */}

        <div className="hero-experience-card">

          <div className="hero-experience-line"></div>

          <span>
            FEATURED EXPERIENCE
          </span>

          <h3>
            A journey through timeless India
          </h3>

          <p>
            Heritage, culture, nature and unforgettable
            stories waiting to be discovered.
          </p>

          <Link to="/gallery">
            Discover Stories
            <FaArrowRight />
          </Link>

        </div>

      </div>

      {/* BOTTOM LOCATION */}

      <div className="hero-premium-location">

        <FaMapMarkerAlt />

        <div>
          <small>
            FEATURED LANDMARK
          </small>

          <strong>
            Taj Mahal, Agra
          </strong>
        </div>

      </div>

      {/* SCROLL INDICATOR */}

      <div className="hero-premium-scroll">

        <span></span>

        Scroll to explore

      </div>

    </section>
  );
}

export default Hero;