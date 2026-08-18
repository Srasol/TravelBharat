import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaFilter,
  FaMapMarkerAlt,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

import API from "../services/api";
import { getImageUrl } from "../utils/imageUrl";

import "../styles/search.css";

function Search() {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  const [places, setPlaces] = useState([]);

  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPlaces();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, state, city, category]);

  const loadFilters = async () => {
    try {
      setFilterLoading(true);

      const [
        statesResponse,
        citiesResponse,
        categoriesResponse,
      ] = await Promise.all([
        API.get("/states"),
        API.get("/cities"),
        API.get("/categories"),
      ]);

      setStates(
        statesResponse.data.states || []
      );

      setCities(
        citiesResponse.data.cities || []
      );

      setCategories(
        categoriesResponse.data.categories || []
      );
    } catch (requestError) {
      console.error(
        "Search filters error:",
        requestError
      );
    } finally {
      setFilterLoading(false);
    }
  };

  const loadPlaces = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (state) {
        params.state = state;
      }

      if (city) {
        params.city = city;
      }

      if (category) {
        params.category = category;
      }

      const response = await API.get(
        "/places",
        {
          params,
        }
      );

      setPlaces(
        response.data.places || []
      );
    } catch (requestError) {
      console.error(
        "Search places error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to load destinations."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredCities = state
    ? cities.filter((item) => {
        const cityStateId =
          typeof item.state === "object"
            ? item.state?._id
            : item.state;

        return cityStateId === state;
      })
    : cities;

  const handleStateChange = (event) => {
    setState(event.target.value);
    setCity("");
  };

  const clearFilters = () => {
    setSearch("");
    setState("");
    setCity("");
    setCategory("");
  };

  const hasFilters =
    search || state || city || category;

  return (
    <main className="explore-page">

      {/* =====================================
          HERO
      ====================================== */}

      <section className="explore-hero">
        <div className="container">

          <span>
            EXPLORE INDIA
          </span>

          <h1>
            Find Your Next
            <br />
            Destination
          </h1>

          <p>
            Search and discover incredible
            tourist destinations across India
            by state, city and category.
          </p>

        </div>
      </section>

      {/* =====================================
          SEARCH AREA
      ====================================== */}

      <section className="explore-content">
        <div className="container">

          <div className="explore-filter-card">

            <div className="explore-filter-heading">

              <div>
                <FaFilter />

                <div>
                  <span>
                    DESTINATION FINDER
                  </span>

                  <h2>
                    Explore Places
                  </h2>
                </div>
              </div>

              {hasFilters && (
                <button
                  type="button"
                  className="clear-filter-button"
                  onClick={clearFilters}
                >
                  <FaTimes />
                  Clear Filters
                </button>
              )}

            </div>

            <div className="explore-filters">

              {/* SEARCH */}

              <div className="explore-search-input">

                <FaSearch />

                <input
                  type="search"
                  placeholder="Search destination..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />

              </div>

              {/* STATE */}

              <select
                value={state}
                onChange={handleStateChange}
                disabled={filterLoading}
              >
                <option value="">
                  All States
                </option>

                {states.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>

              {/* CITY */}

              <select
                value={city}
                onChange={(event) =>
                  setCity(
                    event.target.value
                  )
                }
                disabled={filterLoading}
              >
                <option value="">
                  All Cities
                </option>

                {filteredCities.map(
                  (item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                    </option>
                  )
                )}
              </select>

              {/* CATEGORY */}

              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                disabled={filterLoading}
              >
                <option value="">
                  All Categories
                </option>

                {categories.map(
                  (item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                    </option>
                  )
                )}
              </select>

            </div>
          </div>

          {/* =====================================
              RESULTS HEADER
          ====================================== */}

          <div className="explore-results-header">

            <div>
              <span>
                DISCOVER
              </span>

              <h2>
                Tourist Destinations
              </h2>
            </div>

            <p>
              {loading
                ? "Searching..."
                : `${places.length} destination${
                    places.length === 1
                      ? ""
                      : "s"
                  } found`}
            </p>

          </div>

          {/* =====================================
              RESULTS
          ====================================== */}

          {loading ? (
            <div className="explore-message">

              <div className="explore-loader"></div>

              <h3>
                Finding destinations...
              </h3>

              <p>
                Searching TravelBharat for
                beautiful places.
              </p>

            </div>
          ) : error ? (
            <div className="explore-message">

              <h3>
                Unable to load destinations
              </h3>

              <p>
                {error}
              </p>

            </div>
          ) : places.length === 0 ? (
            <div className="explore-message">

              <FaMapMarkerAlt />

              <h3>
                No destinations found
              </h3>

              <p>
                Try changing your search or
                clearing some filters.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              )}

            </div>
          ) : (
            <div className="explore-grid">

              {places.map((place) => (
                <Link
                  to={`/places/${place._id}`}
                  className="explore-card"
                  key={place._id}
                >

                  {/* IMAGE */}

                  <div className="explore-card-image">

                    {place.images?.length > 0 ? (
                      <img
                        src={getImageUrl(
                          place.images[0]
                        )}
                        alt={place.name}
                      />
                    ) : (
                      <div className="explore-no-image">
                        <FaMapMarkerAlt />
                      </div>
                    )}

                    <span className="explore-category">
                      {place.category?.name ||
                        "Destination"}
                    </span>

                  </div>

                  {/* CONTENT */}

                  <div className="explore-card-content">

                    <h3>
                      {place.name}
                    </h3>

                    <p className="explore-location">

                      <FaMapMarkerAlt />

                      {place.city?.name ||
                        "Unknown city"}

                      {place.state?.name
                        ? `, ${place.state.name}`
                        : ""}

                    </p>

                    <p className="explore-description">
                      {place.description ||
                        "Discover this beautiful destination with TravelBharat."}
                    </p>

                    <div className="explore-card-info">

                      <div>

                        <FaCalendarAlt />

                        <span>
                          <small>
                            Best Time
                          </small>

                          <strong>
                            {place.bestTime ||
                              "Any time"}
                          </strong>
                        </span>

                      </div>

                    </div>

                    <div className="explore-card-footer">

                      <span>
                        View Destination
                      </span>

                      <strong>
                        →
                      </strong>

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

export default Search;