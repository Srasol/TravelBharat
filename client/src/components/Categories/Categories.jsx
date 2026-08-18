import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaLandmark,
  FaMountain,
  FaTree,
  FaUmbrellaBeach,
  FaWater,
} from "react-icons/fa";

import API from "../../services/api";

import "./categories.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await API.get("/categories");

      setCategories(
        response.data.categories || []
      );
    } catch (error) {
      console.error(
        "Categories error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const categoryVisuals = useMemo(
    () => ({
      heritage: {
        icon: <FaLandmark />,
        image:
          "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=85",
        subtitle: "History • Architecture • Royal India",
      },

      nature: {
        icon: <FaTree />,
        image:
          "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=900&q=85",
        subtitle: "Forests • Hills • Landscapes",
      },

      beach: {
        icon: <FaUmbrellaBeach />,
        image:
          "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=85",
        subtitle: "Sun • Sand • Coastal Escapes",
      },

      beaches: {
        icon: <FaUmbrellaBeach />,
        image:
          "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=85",
        subtitle: "Sun • Sand • Coastal Escapes",
      },

      mountain: {
        icon: <FaMountain />,
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=85",
        subtitle: "Peaks • Valleys • Adventures",
      },

      mountains: {
        icon: <FaMountain />,
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=85",
        subtitle: "Peaks • Valleys • Adventures",
      },

      lake: {
        icon: <FaWater />,
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85",
        subtitle: "Lakes • Rivers • Serenity",
      },
    }),
    []
  );

  const getCategoryVisual = (name = "") => {
    const key = name
      .trim()
      .toLowerCase();

    return (
      categoryVisuals[key] || {
        icon: <FaLandmark />,
        image:
          "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=85",
        subtitle: "Discover Incredible India",
      }
    );
  };

  return (
    <section className="premium-categories-section">

      <div className="premium-categories-watermark">
        EXPERIENCE
      </div>

      <div className="container">

        {/* HEADER */}

        <div className="premium-categories-header">

          <div>
            <span>
              FIND YOUR EXPERIENCE
            </span>

            <h2>
              Travel by feeling,
              <br />
              not just by place.
            </h2>
          </div>

          <div className="premium-categories-intro">

            <p>
              Whether you are drawn to royal heritage,
              peaceful nature, mountain adventures or
              coastal escapes, discover the side of India
              that matches your journey.
            </p>

            <Link to="/search">
              Explore all experiences
              <FaArrowRight />
            </Link>

          </div>

        </div>

        {/* CATEGORIES */}

        {loading ? (
          <div className="premium-categories-loading">

            <div className="premium-categories-spinner"></div>

            <p>
              Loading experiences...
            </p>

          </div>
        ) : categories.length === 0 ? (
          <div className="premium-categories-empty">

            <h3>
              No categories available
            </h3>

            <p>
              Categories added by the admin
              will appear here.
            </p>

          </div>
        ) : (
          <div className="premium-category-grid">

            {categories.map(
              (category, index) => {
                const visual =
                  getCategoryVisual(
                    category.name
                  );

                return (
                  <Link
                    to={`/search?category=${category._id}`}
                    className="premium-category-card"
                    key={category._id}
                  >

                    {/* IMAGE */}

                    <div className="premium-category-image">

                      <img
                        src={visual.image}
                        alt={category.name}
                      />

                      <div className="premium-category-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="premium-category-icon">
                        {visual.icon}
                      </div>

                    </div>

                    {/* CONTENT */}

                    <div className="premium-category-content">

                      <small>
                        {visual.subtitle}
                      </small>

                      <h3>
                        {category.name}
                      </h3>

                      <p>
                        Explore beautiful{" "}
                        {category.name.toLowerCase()}{" "}
                        destinations and unforgettable
                        experiences across India.
                      </p>

                      <div className="premium-category-action">

                        <span>
                          Discover
                        </span>

                        <FaArrowRight />

                      </div>

                    </div>

                  </Link>
                );
              }
            )}

          </div>
        )}

      </div>
    </section>
  );
}

export default Categories;