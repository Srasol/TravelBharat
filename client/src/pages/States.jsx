import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCompass,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa";

import { getStates } from "../services/stateService";
import { getImageUrl } from "../utils/imageUrl";

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
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return states;
    }

    return states.filter((state) => {
      return (
        state.name
          ?.toLowerCase()
          .includes(keyword) ||
        state.capital
          ?.toLowerCase()
          .includes(keyword) ||
        state.description
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [states, search]);

  return (
    <main className="tb-states-page">

      {/* HERO */}

      <section className="tb-states-hero">

        <div className="tb-states-hero-overlay"></div>

        <div className="container tb-states-hero-content">

          <div className="tb-states-hero-copy">

            <span className="tb-states-badge">
              <FaCompass />
              DISCOVER INDIA
            </span>

            <h1>
              Every state.
              <br />

              <span>
                A different India.
              </span>
            </h1>

            <p>
              Travel through royal kingdoms, tropical
              landscapes, historic cities, mountain
              escapes and unforgettable cultures across
              India's incredible states.
            </p>

          </div>

          <div className="tb-states-hero-info">

            <span>
              EXPLORE
            </span>

            <strong>
              {loading ? "..." : states.length}
            </strong>

            <p>
              Indian states ready
              to be discovered.
            </p>

          </div>

        </div>

      </section>

      {/* MAIN CONTENT */}

      <section className="tb-states-content">

        <div className="container">

          {/* SEARCH PANEL */}

          <div className="tb-states-search-panel">

            <div className="tb-states-search-copy">

              <span>
                FIND YOUR JOURNEY
              </span>

              <h2>
                Explore India,
                state by state.
              </h2>

            </div>

            <div className="tb-states-search-area">

              <div className="tb-states-search-box">

                <FaSearch />

                <input
                  type="search"
                  placeholder="Search state, capital or destination..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />

              </div>

              <span className="tb-states-results-count">
                {filteredStates.length}{" "}
                result
                {filteredStates.length === 1
                  ? ""
                  : "s"}
              </span>

            </div>

          </div>

          {/* LOADING */}

          {loading ? (
            <div className="tb-states-message">

              <div className="tb-states-loader"></div>

              <h3>
                Discovering India...
              </h3>

              <p>
                Loading states and travel experiences.
              </p>

            </div>
          ) : error ? (
            <div className="tb-states-message">

              <h3>
                Unable to load states
              </h3>

              <p>
                {error}
              </p>

            </div>
          ) : filteredStates.length === 0 ? (
            <div className="tb-states-message">

              <FaMapMarkerAlt />

              <h3>
                No states found
              </h3>

              <p>
                Try another state,
                capital or keyword.
              </p>

            </div>
          ) : (
            <div className="tb-states-grid">

              {filteredStates.map(
                (state, index) => (
                  <Link
                    to={`/states/${state._id}`}
                    className={`tb-state-card ${
                      index === 0
                        ? "tb-state-card-featured"
                        : ""
                    }`}
                    key={state._id}
                  >

                    {/* IMAGE */}

                    {state.image ? (
                      <img
                        src={getImageUrl(
                          state.image
                        )}
                        alt={state.name}
                      />
                    ) : (
                      <div className="tb-state-placeholder">
                        <FaMapMarkerAlt />
                      </div>
                    )}

                    <div className="tb-state-shade"></div>

                    {/* NUMBER */}

                    <span className="tb-state-number">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    {/* TOP LABEL */}

                    <div className="tb-state-top">

                      <span>
                        EXPLORE STATE
                      </span>

                      <div>
                        <FaArrowRight />
                      </div>

                    </div>

                    {/* CONTENT */}

                    <div className="tb-state-info">

                      <p>
                        <FaMapMarkerAlt />

                        Capital:{" "}
                        {state.capital}
                      </p>

                      <h2>
                        {state.name}
                      </h2>

                      <span className="tb-state-description">
                        {state.description ||
                          `Discover beautiful destinations and experiences across ${state.name}.`}
                      </span>

                      <div className="tb-state-bottom">

                        <span>
                          Discover{" "}
                          {state.name}
                        </span>

                        <FaArrowRight />

                      </div>

                    </div>

                  </Link>
                )
              )}

            </div>
          )}

        </div>

      </section>

    </main>
  );
}

export default States;