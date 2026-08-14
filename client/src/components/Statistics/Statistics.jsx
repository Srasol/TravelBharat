import { useEffect, useState } from "react";
import {
  FaCity,
  FaLandmark,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import API from "../../services/api";
import "./Statistics.css";

function Statistics() {
  const [stats, setStats] = useState({
    states: 0,
    cities: 0,
    categories: 0,
    places: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);

      const [
        statesResponse,
        citiesResponse,
        categoriesResponse,
        placesResponse,
      ] = await Promise.all([
        API.get("/states"),
        API.get("/cities"),
        API.get("/categories"),
        API.get("/places"),
      ]);

      setStats({
        states: statesResponse.data.count || 0,
        cities: citiesResponse.data.count || 0,
        categories: categoriesResponse.data.count || 0,
        places: placesResponse.data.count || 0,
      });
    } catch (error) {
      console.error("Statistics error:", error);
    } finally {
      setLoading(false);
    }
  };

  const statistics = [
    {
      label: "States",
      value: stats.states,
      icon: <FaMapMarkedAlt />,
    },
    {
      label: "Cities",
      value: stats.cities,
      icon: <FaCity />,
    },
    {
      label: "Tourist Places",
      value: stats.places,
      icon: <FaMapMarkerAlt />,
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: <FaLandmark />,
    },
  ];

  return (
    <section className="home-statistics">
      <div className="container">
        <div className="section-title">
          <span>TRAVELBHARAT IN NUMBERS</span>

          <h2>Explore India Through Our Growing Collection</h2>

          <p>
            The numbers below are loaded directly from the
            TravelBharat database.
          </p>
        </div>

        <div className="home-statistics-grid">
          {statistics.map((item) => (
            <article
              className="home-statistics-card"
              key={item.label}
            >
              <div className="home-statistics-icon">
                {item.icon}
              </div>

              <strong>
                {loading ? "..." : item.value}
              </strong>

              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Statistics;