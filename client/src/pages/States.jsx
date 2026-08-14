import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa";

import { getStates } from "../services/stateService";
import "../styles/states.css";

function States() {
  const [states, setStates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStates();

      setStates(data.states || []);
    } catch (requestError) {
      console.error("States error:", requestError);

      setError(
        requestError.response?.data?.message ||
          "Unable to load states."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredStates = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return states;
    }

    return states.filter((state) => {
      return (
        state.name?.toLowerCase().includes(keyword) ||
        state.capital?.toLowerCase().includes(keyword) ||
        state.description?.toLowerCase().includes(keyword)
      );
    });
  }, [states, search]);

  return (
    <main className="states-page">

      {/* ===============================
          HERO
      =============================== */}

      <section className="states-hero">
        <div className="container">
          <span>DISCOVER INDIA</span>

          <h1>
            Explore India
            <br />
            State by State
          </h1>

          <p>
            Discover beautiful destinations, rich heritage,
            local culture and unforgettable experiences
            across India's incredible states.
          </p>
        </div>
      </section>

      {/* ===============================
          STATES
      =============================== */}

      <section className="states-section">
        <div className="container">

          {/* Heading */}

          <div className="states-section-header">
            <div>
              <span>EXPLORE DESTINATIONS</span>

              <h2>Indian States</h2>

              <p>
                Choose a state and discover the tourist
                destinations waiting for you.
              </p>
            </div>

            <div className="states-count">
              <strong>{states.length}</strong>

              <span>
                State{states.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          {/* Search */}

          <div className="states-search-wrapper">
            <div className="states-search">
              <FaSearch />

              <input
                type="search"
                placeholder="Search state or capital..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <span>
              Showing {filteredStates.length} result
              {filteredStates.length === 1 ? "" : "s"}
            </span>
          </div>

          {/* Loading */}

          {loading ? (
            <div className="states-message">
              <div className="states-loader"></div>

              <h3>Loading states...</h3>

              <p>
                Discovering incredible destinations for you.
              </p>
            </div>
          ) : error ? (
            <div className="states-message">
              <h3>Unable to load states</h3>
              <p>{error}</p>
            </div>
          ) : filteredStates.length === 0 ? (
            <div className="states-message">
              <FaMapMarkerAlt />

              <h3>No states found</h3>

              <p>
                Try searching with a different state or
                capital name.
              </p>
            </div>
          ) : (
            <div className="states-grid">

              {filteredStates.map((state) => (
                <Link
                  to={`/states/${state._id}`}
                  className="state-card"
                  key={state._id}
                >

                  {/* Image */}

                  <div className="state-card-image">

                    {state.image ? (
                      <img
                        src={`http://localhost:5000/${state.image}`}
                        alt={state.name}
                      />
                    ) : (
                      <div className="state-no-image">
                        <FaMapMarkerAlt />
                      </div>
                    )}

                    <div className="state-image-overlay"></div>

                    <div className="state-card-title">
                      <span>Explore</span>

                      <h2>{state.name}</h2>

                      <p>
                        <FaMapMarkerAlt />
                        Capital: {state.capital}
                      </p>
                    </div>

                  </div>

                  {/* Information */}

                  <div className="state-card-content">

                    <p>
                      {state.description ||
                        `Explore beautiful destinations and experiences across ${state.name}.`}
                    </p>

                    <div className="state-card-footer">
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
    </main>
  );
}

export default States;