import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaTicketAlt,
  FaStar,
  FaSearch,
} from "react-icons/fa";

import API from "../../services/api";
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
      const response = await API.get("/places");
     const allPlaces = response.data.places || [];

setPlaces(allPlaces.slice(0, 6));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const list = [
      "All",
      ...new Set(
        places.map((place) => place.category?.name).filter(Boolean)
      ),
    ];

    return list;
  }, [places]);

  const filteredPlaces = places.filter((place) => {
    const searchMatch =
      place.name.toLowerCase().includes(search.toLowerCase()) ||
      place.state?.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const categoryMatch =
      category === "All" ||
      place.category?.name === category;

    return searchMatch && categoryMatch;
  });

  return (
    <section className="featured">

      <div className="container">

        <div className="section-title">
          <span>FEATURED DESTINATIONS</span>

          <h2>Explore India's Most Beautiful Places</h2>

          <p>
            Discover destinations managed directly from the
            TravelBharat Admin Panel.
          </p>
        </div>

        <div className="featured-toolbar">

          <div className="featured-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search tourist places..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="featured-filters">

            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item
                    ? "active"
                    : ""
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}

          </div>

        </div>

        {loading ? (
          <h3>Loading...</h3>
        ) : (
          <div className="featured-grid">

            {filteredPlaces.map((place) => (
              <div
                className="featured-card"
                key={place._id}
              >

                {place.images?.length > 0 ? (
  <img
    src={`http://localhost:5000/${place.images[0]}`}
    alt={place.name}
  />
) : (
  <div className="featured-no-image">
    No Image Available
  </div>
)}

                <div className="featured-content">

                  <div className="featured-rating">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>

                  <h3>{place.name}</h3>

                  <p>
                    <FaMapMarkerAlt />
                    {place.state?.name}
                  </p>

                  <p>
                    <FaCalendarAlt />
                    {place.bestTime || "Any Time"}
                  </p>

                  <p>
                    <FaClock />
                    {place.timings || "Not Available"}
                  </p>

                  <p>
                    <FaTicketAlt />
                    {place.entryFee || "Free"}
                  </p>

                  <Link
                    to={`/places/${place._id}`}
                  >
                    Explore →
                  </Link>

                </div>

              </div>
            ))}

          </div>
        )}

        <div className="featured-view-all">
          <Link to="/search">
            View All Tourist Places →
          </Link>
        </div>

      </div>

    </section>
  );
}

export default FeaturedDestinations;