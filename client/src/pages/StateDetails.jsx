import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaCompass,
  FaMapMarkerAlt,
} from "react-icons/fa";

import API from "../services/api";
import { getImageUrl } from "../utils/imageUrl";

import "../styles/stateDetails.css";

function StateDetails() {
  const { id } = useParams();

  const [state, setState] = useState(null);
  const [places, setPlaces] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStateDetails();
  }, [id]);

  const loadStateDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const [statesResponse, placesResponse] =
        await Promise.all([
          API.get("/states"),
          API.get("/places"),
        ]);

      const allStates =
        statesResponse.data.states || [];

      const allPlaces =
        placesResponse.data.places || [];

      const selectedState =
        allStates.find(
          (item) => item._id === id
        );

      if (!selectedState) {
        setError("State not found.");
        return;
      }

      setState(selectedState);

      const statePlaces =
        allPlaces.filter(
          (place) =>
            place.state?._id === id
        );

      setPlaces(statePlaces);
    } catch (requestError) {
      console.error(
        "State details error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to load state details."
      );
    } finally {
      setLoading(false);
    }
  };

  const heroImage = useMemo(() => {
    if (state?.image) {
      return getImageUrl(state.image);
    }

    if (
      places[0]?.images?.length > 0
    ) {
      return getImageUrl(
        places[0].images[0]
      );
    }

    return "";
  }, [state, places]);

  if (loading) {
    return (
      <main className="tb-state-details-page">
        <div className="tb-state-details-message">

          <div className="tb-state-details-loader"></div>

          <h3>
            Loading state...
          </h3>

          <p>
            Preparing your TravelBharat journey.
          </p>

        </div>
      </main>
    );
  }

  if (error || !state) {
    return (
      <main className="tb-state-details-page">
        <div className="tb-state-details-message">

          <h3>
            Unable to open state
          </h3>

          <p>
            {error || "State not found."}
          </p>

          <Link to="/states">
            <FaArrowLeft />
            Back to States
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="tb-state-details-page">

      {/* HERO */}

      <section className="tb-state-details-hero">

        {heroImage ? (
          <img
            src={heroImage}
            alt={state.name}
          />
        ) : (
          <div className="tb-state-details-no-image">
            <FaMapMarkerAlt />
          </div>
        )}

        <div className="tb-state-details-overlay"></div>

        <div className="container tb-state-details-hero-content">

          <div className="tb-state-details-main">

            <Link
              to="/states"
              className="tb-state-back"
            >
              <FaArrowLeft />
              Back to States
            </Link>

            <span className="tb-state-kicker">
              <FaCompass />
              EXPLORE INDIA
            </span>

            <h1>
              {state.name}
            </h1>

            <p>
              <FaMapMarkerAlt />
              Capital: {state.capital}
            </p>

          </div>

          <aside className="tb-state-hero-card">

            <span>
              STATE OVERVIEW
            </span>

            <strong>
              {places.length}
            </strong>

            <p>
              Tourist destination
              {places.length === 1 ? "" : "s"}
              {" "}available to explore.
            </p>

            <div>
              <small>
                Capital
              </small>

              <b>
                {state.capital}
              </b>
            </div>

          </aside>

        </div>

      </section>

      {/* ABOUT */}

      <section className="tb-state-about-section">

        <div className="container">

          <div className="tb-state-about-layout">

            <div className="tb-state-about-copy">

              <span>
                ABOUT THE STATE
              </span>

              <h2>
                Discover
                <br />
                {state.name}
              </h2>

            </div>

            <article className="tb-state-about-card">

              <p>
                {state.description ||
                  `Explore the culture, heritage and beautiful destinations across ${state.name}.`}
              </p>

              <div className="tb-state-about-meta">

                <div>
                  <small>
                    Capital
                  </small>

                  <strong>
                    {state.capital}
                  </strong>
                </div>

                <div>
                  <small>
                    Tourist Places
                  </small>

                  <strong>
                    {places.length}
                  </strong>
                </div>

                <div>
                  <small>
                    Travel With
                  </small>

                  <strong>
                    TravelBharat
                  </strong>
                </div>

              </div>

            </article>

          </div>

        </div>

      </section>

      {/* DESTINATIONS */}

      <section className="tb-state-places-section">

        <div className="container">

          <div className="tb-state-places-header">

            <div>
              <span>
                TOP DESTINATIONS
              </span>

              <h2>
                Explore places in{" "}
                {state.name}
              </h2>

              <p>
                Discover unforgettable places,
                local experiences and travel
                stories across {state.name}.
              </p>
            </div>

            <span className="tb-state-place-count">
              {places.length} place
              {places.length === 1
                ? ""
                : "s"}
            </span>

          </div>

          {places.length === 0 ? (
            <div className="tb-state-no-places">

              <FaMapMarkerAlt />

              <h3>
                No tourist places added yet
              </h3>

              <p>
                Tourist destinations added by the
                admin will appear here.
              </p>

            </div>
          ) : (
            <div className="tb-state-places-grid">

              {places.map((place, index) => (
                <Link
                  to={`/places/${place._id}`}
                  className={`tb-state-place-card ${
                    index === 0
                      ? "tb-state-place-featured"
                      : ""
                  }`}
                  key={place._id}
                >

                  <div className="tb-state-place-image">

                    {place.images?.length > 0 ? (
                      <img
                        src={getImageUrl(
                          place.images[0]
                        )}
                        alt={place.name}
                      />
                    ) : (
                      <div className="tb-state-place-no-image">
                        <FaMapMarkerAlt />
                      </div>
                    )}

                    <div className="tb-state-place-shade"></div>

                    <span className="tb-state-place-category">
                      {place.category?.name ||
                        "Destination"}
                    </span>

                    <span className="tb-state-place-number">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <div className="tb-state-place-image-content">

                      <p>
                        <FaMapMarkerAlt />

                        {place.city?.name ||
                          "Unknown city"}
                      </p>

                      <h3>
                        {place.name}
                      </h3>

                    </div>

                  </div>

                  <div className="tb-state-place-content">

                    <p className="tb-state-place-description">
                      {place.description ||
                        "Discover this beautiful destination with TravelBharat."}
                    </p>

                    <div className="tb-state-place-meta">

                      <span>
                        <FaCalendarAlt />

                        {place.bestTime ||
                          "Any time"}
                      </span>

                    </div>

                    <div className="tb-state-place-footer">

                      <span>
                        Explore Destination
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

export default StateDetails;