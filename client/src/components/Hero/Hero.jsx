import { Link } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>

      <div className="hero-content container">
        <span className="hero-tag">
          🇮🇳 Incredible India
        </span>

        <h1>
          Explore India
          <br />
          <span>State by State</span>
        </h1>

        <p>
          Discover beautiful destinations, heritage sites,
          hill stations, beaches, temples and hidden gems
          across every state of India.
        </p>

        <div className="hero-search">
          <FaSearch />

          <input
            type="text"
            placeholder="Search destinations..."
          />

          <Link to="/search">
            Explore
          </Link>
        </div>

        <div className="hero-stats">
          <div>
            <h3>28+</h3>
            <span>States</span>
          </div>

          <div>
            <h3>700+</h3>
            <span>Cities</span>
          </div>

          <div>
            <h3>5000+</h3>
            <span>Places</span>
          </div>

          <div>
            <h3>24/7</h3>
            <span>Travel Guide</span>
          </div>
        </div>

        <div className="hero-location">
          <FaMapMarkerAlt />
          Experience the beauty of Incredible India
        </div>
      </div>
    </section>
  );
}

export default Hero;