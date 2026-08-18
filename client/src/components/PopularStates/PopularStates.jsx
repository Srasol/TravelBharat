import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaMapMarkerAlt,
} from "react-icons/fa";

import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUrl";

import "./PopularStates.css";

function PopularStates() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    try {
      const response = await API.get("/states");

      setStates(
        (response.data.states || []).slice(0, 6)
      );
    } catch (error) {
      console.error(
        "Popular states error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="premium-states-section">

      <div className="premium-states-decoration">
        INDIA
      </div>

      <div className="container">

        {/* HEADER */}

        <div className="premium-states-header">

          <div>
            <span>
              EXPLORE BY REGION
            </span>

            <h2>
              Every state has
              <br />
              a story to tell.
            </h2>
          </div>

          <div className="premium-states-header-right">

            <p>
              From misty hills and royal cities to beaches,
              heritage and vibrant culture — discover India
              one state at a time.
            </p>

            <Link to="/states">
              View all states
              <FaArrowRight />
            </Link>

          </div>

        </div>

        {/* CONTENT */}

        {loading ? (
          <div className="premium-states-loading">
            <div className="premium-states-spinner"></div>

            <p>
              Discovering states...
            </p>
          </div>
        ) : states.length === 0 ? (
          <div className="premium-states-empty">
            <h3>
              No states available
            </h3>
          </div>
        ) : (
          <div className="premium-states-grid">

            {states.map((state, index) => (
              <Link
                to={`/states/${state._id}`}
                className={`premium-state-card ${
                  index === 0
                    ? "premium-state-large"
                    : ""
                }`}
                key={state._id}
              >

                {state.image ? (
                  <img
                    src={getImageUrl(
                      state.image
                    )}
                    alt={state.name}
                  />
                ) : (
                  <div className="premium-state-placeholder">
                    No Image Available
                  </div>
                )}

                <div className="premium-state-overlay"></div>

                <span className="premium-state-number">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <div className="premium-state-content">

                  <span className="premium-state-label">
                    DISCOVER STATE
                  </span>

                  <h3>
                    {state.name}
                  </h3>

                  <p className="premium-state-capital">
                    <FaMapMarkerAlt />
                    Capital: {state.capital}
                  </p>

                  <p className="premium-state-description">
                    {state.description}
                  </p>

                  <div className="premium-state-footer">

                    <span>
                      Explore {state.name}
                    </span>

                    <div>
                      <FaArrowRight />
                    </div>

                  </div>

                </div>

              </Link>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}

export default PopularStates;