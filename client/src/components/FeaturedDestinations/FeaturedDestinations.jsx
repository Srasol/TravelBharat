import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaStar,
} from "react-icons/fa";

import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUrl";

import "./FeaturedDestinations.css";

function FeaturedDestinations() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    try {
      setLoading(true);

      const response = await API.get("/places");

      const allPlaces =
        response.data.places || [];

      setPlaces(allPlaces.slice(0, 6));
    } catch (error) {
      console.error(
        "Featured destinations error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        places
          .map(
            (place) =>
              place.category?.name
          )
          .filter(Boolean)
      ),
    ];
  }, [places]);

  const filteredPlaces = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return places.filter((place) => {
      const searchMatch =
        !keyword ||
        place.name
          ?.toLowerCase()
          .includes(keyword) ||
        place.state?.name
          ?.toLowerCase()
          .includes(keyword) ||
        place.city?.name
          ?.toLowerCase()
          .includes(keyword);

      const categoryMatch =
        category === "All" ||
        place.category?.name === category;

      return (
        searchMatch &&
        categoryMatch
      );
    });
  }, [places, search, category]);

  const featuredPlace =
    filteredPlaces[0] || null;

  const smallerPlaces =
    filteredPlaces.slice(1, 5);

  return (
    <section className="premium-destinations">

      <div className="container">

        {/* TOP HEADER */}

        <div className="premium-destinations-header">

          <div className="premium-destinations-title">

            <span>
              CURATED JOURNEYS
            </span>

            <h2>
              Places that make
              <br />
              India unforgettable.
            </h2>

          </div>

          <div className="premium-destinations-description">

            <p>
              Discover iconic landmarks, peaceful hill
              stations, royal heritage and unforgettable
              destinations selected from across India.
            </p>

            <Link to="/search">
              Explore all destinations
              <FaArrowRight />
            </Link>

          </div>

        </div>

        {/* FILTER BAR */}

        <div className="premium-destination-toolbar">

          <div className="premium-destination-search">
            <FaSearch />

            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />
          </div>

          <div className="premium-destination-filters">

            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  category === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCategory(item)
                }
              >
                {item}
              </button>
            ))}

          </div>

        </div>

        {/* CONTENT */}

        {loading ? (
          <div className="premium-destination-loading">

            <div className="premium-destination-spinner"></div>

            <p>
              Discovering destinations...
            </p>

          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="premium-destination-empty">

            <h3>
              No destinations found
            </h3>

            <p>
              Try another destination or category.
            </p>

          </div>
        ) : (
          <div className="premium-destination-layout">

            {/* MAIN FEATURE */}

            {featuredPlace && (
              <Link
                to={`/places/${featuredPlace._id}`}
                className="premium-main-destination"
              >

                {featuredPlace.images?.length > 0 ? (
                  <img
                    src={getImageUrl(
                      featuredPlace.images[0]
                    )}
                    alt={featuredPlace.name}
                  />
                ) : (
                  <div className="premium-destination-no-image">
                    No Image Available
                  </div>
                )}

                <div className="premium-main-overlay"></div>

                <div className="premium-main-top">

                  <span>
                    {featuredPlace.category?.name ||
                      "Destination"}
                  </span>

                  <div>
                    <FaStar />
                    Featured
                  </div>

                </div>

                <div className="premium-main-content">

                  <p>
                    <FaMapMarkerAlt />

                    {featuredPlace.city?.name ||
                      "Explore"}

                    {featuredPlace.state?.name
                      ? `, ${featuredPlace.state.name}`
                      : ""}
                  </p>

                  <h3>
                    {featuredPlace.name}
                  </h3>

                  <div className="premium-main-meta">

                    <span>
                      <FaCalendarAlt />

                      {featuredPlace.bestTime ||
                        "Any Time"}
                    </span>

                    <strong>
                      Discover
                      <FaArrowRight />
                    </strong>

                  </div>

                </div>

              </Link>
            )}

            {/* SMALL DESTINATIONS */}

            <div className="premium-small-grid">

              {smallerPlaces.map(
                (place, index) => (
                  <Link
                    to={`/places/${place._id}`}
                    className="premium-small-card"
                    key={place._id}
                  >

                    {place.images?.length > 0 ? (
                      <img
                        src={getImageUrl(
                          place.images[0]
                        )}
                        alt={place.name}
                      />
                    ) : (
                      <div className="premium-destination-no-image">
                        No Image
                      </div>
                    )}

                    <div className="premium-small-overlay"></div>

                    <span className="premium-small-number">
                      0{index + 2}
                    </span>

                    <span className="premium-small-category">
                      {place.category?.name ||
                        "Destination"}
                    </span>

                    <div className="premium-small-content">

                      <p>
                        <FaMapMarkerAlt />

                        {place.state?.name ||
                          "India"}
                      </p>

                      <h3>
                        {place.name}
                      </h3>

                      <div>
                        <span>
                          Explore
                        </span>

                        <FaArrowRight />
                      </div>

                    </div>

                  </Link>
                )
              )}

            </div>

          </div>
        )}

        {/* BOTTOM CTA */}

        <div className="premium-destinations-footer">

          <span>
            MORE PLACES ARE WAITING TO BE DISCOVERED
          </span>

          <Link to="/search">
            View all destinations

            <FaArrowRight />
          </Link>

        </div>

      </div>

    </section>
  );
}

export default FeaturedDestinations;