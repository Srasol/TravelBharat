import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaLandmark,
  FaMapMarkerAlt,
  FaTicketAlt,
} from "react-icons/fa";

import API from "../services/api";
import { getImageUrl } from "../utils/imageUrl";

import "../styles/placeDetails.css";

function PlaceDetails() {
  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [relatedPlaces, setRelatedPlaces] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPlace();
  }, [id]);

  const loadPlace = async () => {
    try {
      setLoading(true);
      setError("");

      const placeResponse =
        await API.get(`/places/${id}`);

      const placeData =
        placeResponse.data.place ||
        placeResponse.data;

      setPlace(placeData);

      if (placeData.images?.length > 0) {
        setSelectedImage(
          placeData.images[0]
        );
      } else {
        setSelectedImage("");
      }

      const allPlacesResponse =
        await API.get("/places");

      const allPlaces =
        allPlacesResponse.data.places || [];

      let related = allPlaces
        .filter(
          (item) =>
            item._id !== placeData._id
        )
        .filter(
          (item) =>
            item.state?._id ===
              placeData.state?._id ||
            item.category?._id ===
              placeData.category?._id
        )
        .slice(0, 3);

      if (related.length < 3) {
        const relatedIds =
          related.map(
            (item) => item._id
          );

        const additionalPlaces =
          allPlaces
            .filter(
              (item) =>
                item._id !==
                  placeData._id &&
                !relatedIds.includes(
                  item._id
                )
            )
            .slice(
              0,
              3 - related.length
            );

        related = [
          ...related,
          ...additionalPlaces,
        ];
      }

      setRelatedPlaces(related);
    } catch (requestError) {
      console.error(
        "Place details error:",
        requestError
      );

      setError(
        requestError.response?.data
          ?.message ||
          "Unable to load tourist place."
      );
    } finally {
      setLoading(false);
    }
  };

  const mapUrl = useMemo(() => {
    if (!place?.googleMap) {
      return "";
    }

    const markdownMatch =
      place.googleMap.match(
        /\((https?:\/\/[^)]+)\)/
      );

    if (markdownMatch?.[1]) {
      return markdownMatch[1];
    }

    return place.googleMap
      .replace(/\[|\]/g, "")
      .trim();
  }, [place]);

  if (loading) {
    return (
      <main className="tb-place-page">

        <div className="tb-place-message">

          <div className="tb-place-loader"></div>

          <h3>
            Loading destination...
          </h3>

          <p>
            Preparing your TravelBharat experience.
          </p>

        </div>

      </main>
    );
  }

  if (error || !place) {
    return (
      <main className="tb-place-page">

        <div className="tb-place-message">

          <h3>
            Unable to open destination
          </h3>

          <p>
            {error ||
              "Tourist place not found."}
          </p>

          <Link to="/search">
            <FaArrowLeft />
            Back to Explore
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="tb-place-page">

      {/* HERO */}

      <section className="tb-place-hero">

        {selectedImage ? (
          <img
            src={getImageUrl(
              selectedImage
            )}
            alt={place.name}
          />
        ) : (
          <div className="tb-place-no-image">
            <FaMapMarkerAlt />
          </div>
        )}

        <div className="tb-place-hero-overlay"></div>

        <div className="container tb-place-hero-content">

          <div className="tb-place-hero-main">

            <Link
              to="/search"
              className="tb-place-back"
            >
              <FaArrowLeft />
              Back to Explore
            </Link>

            <span className="tb-place-category">
              {place.category?.name ||
                "Destination"}
            </span>

            <h1>
              {place.name}
            </h1>

            <p>
              <FaMapMarkerAlt />

              {place.city?.name ||
                "Unknown city"}

              {place.state?.name
                ? `, ${place.state.name}`
                : ""}
            </p>

          </div>

          <aside className="tb-place-hero-info">

            <span>
              TRAVEL SNAPSHOT
            </span>

            <div>
              <small>
                Best Time
              </small>

              <strong>
                {place.bestTime ||
                  "Any time"}
              </strong>
            </div>

            <div>
              <small>
                Entry Fee
              </small>

              <strong>
                {place.entryFee ||
                  "Not available"}
              </strong>
            </div>

            <div>
              <small>
                Timings
              </small>

              <strong>
                {place.timings ||
                  "Not available"}
              </strong>
            </div>

          </aside>

        </div>

      </section>

      {/* GALLERY THUMBNAILS */}

      {place.images?.length > 1 && (
        <section className="tb-place-thumbnails-section">

          <div className="container">

            <div className="tb-place-thumbnails">

              {place.images.map(
                (image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={
                      selectedImage === image
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setSelectedImage(
                        image
                      )
                    }
                  >

                    <img
                      src={getImageUrl(
                        image
                      )}
                      alt={`${place.name} ${
                        index + 1
                      }`}
                    />

                    <span>
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                  </button>
                )
              )}

            </div>

          </div>

        </section>
      )}

      {/* MAIN */}

      <section className="tb-place-content">

        <div className="container">

          <div className="tb-place-layout">

            {/* LEFT */}

            <article className="tb-place-story">

              <span>
                DESTINATION STORY
              </span>

              <h2>
                About {place.name}
              </h2>

              <p>
                {place.description}
              </p>

              {place.history && (
                <div className="tb-place-story-section">

                  <span>
                    HISTORY & SIGNIFICANCE
                  </span>

                  <h3>
                    The story behind
                    {` ${place.name}`}
                  </h3>

                  <p>
                    {place.history}
                  </p>

                </div>
              )}

              {place.nearbyAttractions
                ?.length > 0 && (
                <div className="tb-place-story-section">

                  <span>
                    NEARBY ATTRACTIONS
                  </span>

                  <h3>
                    Explore more nearby
                  </h3>

                  <div className="tb-place-nearby">

                    {place.nearbyAttractions.map(
                      (
                        attraction,
                        index
                      ) => (
                        <div
                          key={`${attraction}-${index}`}
                        >
                          <FaMapMarkerAlt />

                          <span>
                            {attraction}
                          </span>
                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

            </article>

            {/* RIGHT */}

            <aside className="tb-place-travel-card">

              <span>
                PLAN YOUR VISIT
              </span>

              <h2>
                Travel Information
              </h2>

              <div className="tb-place-info-list">

                <div className="tb-place-info-item">

                  <div>
                    <FaCalendarAlt />
                  </div>

                  <section>
                    <span>
                      Best Time
                    </span>

                    <strong>
                      {place.bestTime ||
                        "Not available"}
                    </strong>
                  </section>

                </div>

                <div className="tb-place-info-item">

                  <div>
                    <FaTicketAlt />
                  </div>

                  <section>
                    <span>
                      Entry Fee
                    </span>

                    <strong>
                      {place.entryFee ||
                        "Not available"}
                    </strong>
                  </section>

                </div>

                <div className="tb-place-info-item">

                  <div>
                    <FaClock />
                  </div>

                  <section>
                    <span>
                      Timings
                    </span>

                    <strong>
                      {place.timings ||
                        "Not available"}
                    </strong>
                  </section>

                </div>

                <div className="tb-place-info-item">

                  <div>
                    <FaLandmark />
                  </div>

                  <section>
                    <span>
                      Category
                    </span>

                    <strong>
                      {place.category?.name ||
                        "Not available"}
                    </strong>
                  </section>

                </div>

                <div className="tb-place-info-item">

                  <div>
                    <FaMapMarkerAlt />
                  </div>

                  <section>
                    <span>
                      Location
                    </span>

                    <strong>
                      {place.city?.name ||
                        "Unknown city"}

                      {place.state?.name
                        ? `, ${place.state.name}`
                        : ""}
                    </strong>
                  </section>

                </div>

              </div>

              {mapUrl && (
                <a
                  className="tb-place-map-button"
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaMapMarkerAlt />

                  View on Google Maps

                  <FaArrowRight />
                </a>
              )}

            </aside>

          </div>

        </div>

      </section>

      {/* RELATED */}

      {relatedPlaces.length > 0 && (
        <section className="tb-related-section">

          <div className="container">

            <div className="tb-related-header">

              <div>
                <span>
                  KEEP EXPLORING
                </span>

                <h2>
                  Related Destinations
                </h2>

                <p>
                  Discover more incredible
                  places across India.
                </p>
              </div>

              <Link to="/search">
                Explore All
                <FaArrowRight />
              </Link>

            </div>

            <div className="tb-related-grid">

              {relatedPlaces.map(
                (item, index) => (
                  <Link
                    to={`/places/${item._id}`}
                    className="tb-related-card"
                    key={item._id}
                  >

                    <div className="tb-related-image">

                      {item.images?.length > 0 ? (
                        <img
                          src={getImageUrl(
                            item.images[0]
                          )}
                          alt={item.name}
                        />
                      ) : (
                        <div className="tb-related-no-image">
                          <FaMapMarkerAlt />
                        </div>
                      )}

                      <div className="tb-related-shade"></div>

                      <span className="tb-related-number">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span className="tb-related-category">
                        {item.category?.name ||
                          "Destination"}
                      </span>

                      <div className="tb-related-image-content">

                        <p>
                          <FaMapMarkerAlt />

                          {item.city?.name ||
                            "Unknown city"}

                          {item.state?.name
                            ? `, ${item.state.name}`
                            : ""}
                        </p>

                        <h3>
                          {item.name}
                        </h3>

                      </div>

                    </div>

                    <div className="tb-related-footer">

                      <span>
                        Explore Destination
                      </span>

                      <div>
                        <FaArrowRight />
                      </div>

                    </div>

                  </Link>
                )
              )}

            </div>

          </div>

        </section>
      )}

    </main>
  );
}

export default PlaceDetails;