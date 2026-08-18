import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaCity,
  FaLandmark,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

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
      number: "01",
      label: "States",
      description: "Indian states ready to explore",
      value: stats.states,
      icon: <FaMapMarkedAlt />,
    },
    {
      number: "02",
      label: "Cities",
      description: "Cities filled with experiences",
      value: stats.cities,
      icon: <FaCity />,
    },
    {
      number: "03",
      label: "Destinations",
      description: "Handpicked tourist attractions",
      value: stats.places,
      icon: <FaMapMarkerAlt />,
    },
    {
      number: "04",
      label: "Experiences",
      description: "Different ways to discover India",
      value: stats.categories,
      icon: <FaLandmark />,
    },
  ];

  return (
    <section className="tb-stats-section">
      <div className="container">

        <div className="tb-stats-panel">

          {/* DECORATION */}

          <div className="tb-stats-glow"></div>

          <div className="tb-stats-watermark">
            INDIA
          </div>

          {/* LEFT SIDE */}

          <div className="tb-stats-intro">

            <span className="tb-stats-eyebrow">
              TRAVELBHARAT IN NUMBERS
            </span>

            <h2>
              One country.
              <br />
              <span>Endless journeys.</span>
            </h2>

            <p>
              From historic cities and royal landmarks
              to peaceful landscapes and unforgettable
              destinations, TravelBharat brings India's
              travel experiences together in one place.
            </p>

            <Link
              to="/search"
              className="tb-stats-explore"
            >
              Start exploring

              <span>
                <FaArrowRight />
              </span>
            </Link>

          </div>

          {/* RIGHT SIDE */}

          <div className="tb-stats-numbers">

            {statistics.map((item) => (
              <article
                className="tb-stat-item"
                key={item.label}
              >

                <div className="tb-stat-top">

                  <span className="tb-stat-index">
                    {item.number}
                  </span>

                  <div className="tb-stat-icon">
                    {item.icon}
                  </div>

                </div>

                <div className="tb-stat-value">
                  {loading ? (
                    <span className="tb-stat-loading">
                      ...
                    </span>
                  ) : (
                    <>
                      {item.value}
                      <sup>+</sup>
                    </>
                  )}
                </div>

                <h3>
                  {item.label}
                </h3>

                <p>
                  {item.description}
                </p>

              </article>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}

export default Statistics;