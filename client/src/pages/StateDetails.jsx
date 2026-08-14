import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import API from "../services/api";
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

      const [statesResponse, placesResponse] = await Promise.all([
        API.get("/states"),
        API.get("/places"),
      ]);

      const allStates = statesResponse.data.states || [];
      const allPlaces = placesResponse.data.places || [];

      const selectedState = allStates.find(
        (item) => item._id === id
      );

      if (!selectedState) {
        setError("State not found.");
        return;
      }

      setState(selectedState);

      const statePlaces = allPlaces.filter(
        (place) => place.state?._id === id
      );

      setPlaces(statePlaces);
    } catch (requestError) {
      console.error("State details error:", requestError);

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
      return `http://localhost:5000/${state.image}`;
    }

    if (places[0]?.images?.length > 0) {
      return `http://localhost:5000/${places[0].images[0]}`;
    }

    return "";
  }, [state, places]);

  if (loading) {
    return (
      <main className="state-details-page">
        <div className="state-details-message">
          <div className="state-details-loader"></div>
          <h3>Loading state...</h3>
        </div>
      </main>
    );
  }

  if (error || !state) {
    return (
      <main className="state-details-page">
        <div className="state-details-message">
          <h3>Unable to open state</h3>
          <p>{error || "State not found."}</p>

          <Link to="/states">
            Back to States
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="state-details-page">

      {/* HERO */}

      <section className="state-details-hero">

        {heroImage ? (
          <img
            src={heroImage}
            alt={state.name}
          />
        ) : (
          <div className="state-details-no-image">
            <FaMapMarkerAlt />
          </div>
        )}

        <div className="state-details-overlay"></div>

        <div className="container state-details-hero-content">
          <Link to="/states">
            <FaArrowLeft />
            Back to States
          </Link>

          <span>EXPLORE INDIA</span>

          <h1>{state.name}</h1>

          <p>
            <FaMapMarkerAlt />
            Capital: {state.capital}
          </p>
        </div>
      </section>

      {/* ABOUT */}

      <section className="state-about-section">
        <div className="container">

          <div className="state-about-grid">

            <article className="state-about-card">
              <span>ABOUT THE STATE</span>

              <h2>
                Discover {state.name}
              </h2>

              <p>
                {state.description}
              </p>
            </article>

            <aside className="state-summary-card">
              <div>
                <span>Capital</span>
                <strong>{state.capital}</strong>
              </div>

              <div>
                <span>Tourist Places</span>
                <strong>{places.length}</strong>
              </div>

              <div>
                <span>Explore</span>
                <strong>TravelBharat</strong>
              </div>
            </aside>

          </div>

        </div>
      </section>

      {/* TOURIST PLACES */}

      <section className="state-places-section">
        <div className="container">

          <div className="state-places-header">
            <div>
              <span>TOP DESTINATIONS</span>

              <h2>
                Tourist Places in {state.name}
              </h2>

              <p>
                Explore beautiful destinations across {state.name}.
              </p>
            </div>

            <span className="state-place-count">
              {places.length} place
              {places.length === 1 ? "" : "s"}
            </span>
          </div>

          {places.length === 0 ? (
            <div className="state-no-places">
              <FaMapMarkerAlt />

              <h3>
                No tourist places added yet
              </h3>

              <p>
                Tourist destinations added by the admin
                will appear here.
              </p>
            </div>
          ) : (
            <div className="state-places-grid">

              {places.map((place) => (
                <Link
                  to={`/places/${place._id}`}
                  className="state-place-card"
                  key={place._id}
                >

                  <div className="state-place-image">

                    {place.images?.length > 0 ? (
                      <img
                        src={`http://localhost:5000/${place.images[0]}`}
                        alt={place.name}
                      />
                    ) : (
                      <div className="state-place-no-image">
                        <FaMapMarkerAlt />
                      </div>
                    )}

                    <span>
                      {place.category?.name ||
                        "Destination"}
                    </span>

                  </div>

                  <div className="state-place-content">

                    <h3>{place.name}</h3>

                    <p className="state-place-location">
                      <FaMapMarkerAlt />

                      {place.city?.name ||
                        "Unknown city"}
                    </p>

                    <p className="state-place-description">
                      {place.description}
                    </p>

                    <div className="state-place-meta">
                      <span>
                        <FaCalendarAlt />

                        {place.bestTime ||
                          "Any time"}
                      </span>
                    </div>

                    <div className="state-place-footer">
                      <span>
                        Explore Destination
                      </span>

                      <strong>→</strong>
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