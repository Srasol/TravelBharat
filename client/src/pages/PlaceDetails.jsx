import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaLandmark,
  FaMapMarkerAlt,
  FaTicketAlt,
} from "react-icons/fa";

import API from "../services/api";
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

      const placeResponse = await API.get(`/places/${id}`);

      const placeData =
        placeResponse.data.place ||
        placeResponse.data;

      setPlace(placeData);

      if (placeData.images?.length > 0) {
        setSelectedImage(placeData.images[0]);
      } else {
        setSelectedImage("");
      }

      const allPlacesResponse = await API.get("/places");

      const allPlaces =
        allPlacesResponse.data.places || [];

      let related = allPlaces
        .filter(
          (item) => item._id !== placeData._id
        )
        .filter(
          (item) =>
            item.state?._id === placeData.state?._id ||
            item.category?._id ===
              placeData.category?._id
        )
        .slice(0, 3);

      /*
        If fewer than 3 related places are found,
        fill remaining slots with other destinations.
      */
      if (related.length < 3) {
        const relatedIds = related.map(
          (item) => item._id
        );

        const additionalPlaces = allPlaces
          .filter(
            (item) =>
              item._id !== placeData._id &&
              !relatedIds.includes(item._id)
          )
          .slice(0, 3 - related.length);

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
        requestError.response?.data?.message ||
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
      <main className="place-details-page">
        <div className="place-details-loading">
          Loading destination...
        </div>
      </main>
    );
  }

  if (error || !place) {
    return (
      <main className="place-details-page">
        <div className="place-details-loading">
          {error || "Tourist place not found."}
        </div>
      </main>
    );
  }

  return (
    <main className="place-details-page">

      {/* =====================================
          HERO
      ====================================== */}

      <section className="place-details-hero">

        {selectedImage ? (
          <img
            src={`http://localhost:5000/${selectedImage}`}
            alt={place.name}
          />
        ) : (
          <div className="place-details-no-image">
            No Image Available
          </div>
        )}

        <div className="place-details-hero-overlay"></div>

        <div className="container place-details-hero-content">

          <Link to="/search">
            <FaArrowLeft />
            Back to Explore
          </Link>

          <span>
            {place.category?.name ||
              "Destination"}
          </span>

          <h1>{place.name}</h1>

          <p>
            <FaMapMarkerAlt />

            {place.city?.name ||
              "Unknown city"}

            {place.state?.name
              ? `, ${place.state.name}`
              : ""}
          </p>

        </div>
      </section>

      {/* =====================================
          MAIN INFORMATION
      ====================================== */}

      <section className="place-details-content">
        <div className="container">

          {/* Image thumbnails */}

          {place.images?.length > 1 && (
            <div className="place-thumbnail-row">

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
                      setSelectedImage(image)
                    }
                  >
                    <img
                      src={`http://localhost:5000/${image}`}
                      alt={`${place.name} ${index + 1}`}
                    />
                  </button>
                )
              )}

            </div>
          )}

          <div className="place-details-grid">

            {/* LEFT CONTENT */}

            <article className="place-main-card">

              <span>Overview</span>

              <h2>
                About {place.name}
              </h2>

              <p>
                {place.description}
              </p>

              {place.history && (
                <>
                  <h3>
                    History & Significance
                  </h3>

                  <p>
                    {place.history}
                  </p>
                </>
              )}

              {place.nearbyAttractions
                ?.length > 0 && (
                <>
                  <h3>
                    Nearby Attractions
                  </h3>

                  <div className="nearby-attractions">

                    {place.nearbyAttractions.map(
                      (
                        attraction,
                        index
                      ) => (
                        <span
                          key={`${attraction}-${index}`}
                        >
                          <FaMapMarkerAlt />

                          {attraction}
                        </span>
                      )
                    )}

                  </div>
                </>
              )}

            </article>

            {/* RIGHT INFORMATION */}

            <aside className="place-info-card">

              <h2>
                Travel Information
              </h2>

              <div className="place-info-item">
                <FaCalendarAlt />

                <div>
                  <span>
                    Best Time
                  </span>

                  <strong>
                    {place.bestTime ||
                      "Not available"}
                  </strong>
                </div>
              </div>

              <div className="place-info-item">
                <FaTicketAlt />

                <div>
                  <span>
                    Entry Fee
                  </span>

                  <strong>
                    {place.entryFee ||
                      "Not available"}
                  </strong>
                </div>
              </div>

              <div className="place-info-item">
                <FaClock />

                <div>
                  <span>
                    Timings
                  </span>

                  <strong>
                    {place.timings ||
                      "Not available"}
                  </strong>
                </div>
              </div>

              <div className="place-info-item">
                <FaLandmark />

                <div>
                  <span>
                    Category
                  </span>

                  <strong>
                    {place.category?.name ||
                      "Not available"}
                  </strong>
                </div>
              </div>

              <div className="place-info-item">
                <FaMapMarkerAlt />

                <div>
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
                </div>
              </div>

              {mapUrl && (
                <a
                  className="place-map-button"
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaMapMarkerAlt />

                  View on Google Maps
                </a>
              )}

            </aside>

          </div>
        </div>
      </section>

      {/* =====================================
          RELATED DESTINATIONS
      ====================================== */}

      {relatedPlaces.length > 0 && (
        <section className="related-destinations">
          <div className="container">

            <div className="related-destinations-header">

              <div>
                <span>
                  KEEP EXPLORING
                </span>

                <h2>
                  Related Destinations
                </h2>

                <p>
                  Discover more beautiful places
                  across India.
                </p>
              </div>

              <Link to="/search">
                Explore All
              </Link>

            </div>

            <div className="related-destinations-grid">

              {relatedPlaces.map(
                (item) => (
                  <Link
                    to={`/places/${item._id}`}
                    className="related-destination-card"
                    key={item._id}
                  >

                    <div className="related-destination-image">

                      {item.images?.length >
                      0 ? (
                        <img
                          src={`http://localhost:5000/${item.images[0]}`}
                          alt={item.name}
                        />
                      ) : (
                        <div className="related-no-image">
                          <FaMapMarkerAlt />
                        </div>
                      )}

                      <span>
                        {item.category?.name ||
                          "Destination"}
                      </span>

                    </div>

                    <div className="related-destination-content">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        <FaMapMarkerAlt />

                        {item.city?.name ||
                          "Unknown city"}

                        {item.state?.name
                          ? `, ${item.state.name}`
                          : ""}
                      </p>

                      <div>
                        Explore Destination
                        <span>→</span>
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