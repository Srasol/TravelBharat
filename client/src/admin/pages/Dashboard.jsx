import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaCity,
  FaEnvelope,
  FaLandmark,
  FaMap,
  FaMapMarkerAlt,
  FaPlus,
} from "react-icons/fa";

import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUrl";

import Sidebar from "../components/Sidebar";

import "../styles/admin.css";

function Dashboard() {
  const [stats, setStats] = useState({
    states: 0,
    cities: 0,
    categories: 0,
    places: 0,
    enquiries: 0,
  });

  const [recentPlaces, setRecentPlaces] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        statesResponse,
        citiesResponse,
        categoriesResponse,
        placesResponse,
        enquiriesResponse,
      ] = await Promise.all([
        API.get("/states"),
        API.get("/cities"),
        API.get("/categories"),
        API.get("/places"),
        API.get("/enquiries"),
      ]);

      const places =
        placesResponse.data.places || [];

      const enquiries =
        enquiriesResponse.data.enquiries || [];

      setStats({
        states:
          statesResponse.data.count || 0,

        cities:
          citiesResponse.data.count || 0,

        categories:
          categoriesResponse.data.count || 0,

        places:
          placesResponse.data.count || 0,

        enquiries:
          enquiriesResponse.data.count || 0,
      });

      setRecentPlaces(
        places.slice(0, 5)
      );

      setRecentEnquiries(
        enquiries.slice(0, 5)
      );
    } catch (requestError) {
      console.error(
        "Dashboard error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to load dashboard information."
      );
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "States",
      value: stats.states,
      icon: <FaMap />,
      link: "/admin/states",
      className: "orange",
      number: "01",
      description: "Manage Indian states",
    },
    {
      title: "Cities",
      value: stats.cities,
      icon: <FaCity />,
      link: "/admin/cities",
      className: "blue",
      number: "02",
      description: "Manage destination cities",
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: <FaLandmark />,
      link: "/admin/categories",
      className: "green",
      number: "03",
      description: "Tourism experiences",
    },
    {
      title: "Tourist Places",
      value: stats.places,
      icon: <FaMapMarkerAlt />,
      link: "/admin/places",
      className: "purple",
      number: "04",
      description: "Published destinations",
    },
    {
      title: "Enquiries",
      value: stats.enquiries,
      icon: <FaEnvelope />,
      link: "/admin/enquiries",
      className: "red",
      number: "05",
      description: "Visitor messages",
    },
  ];

  const totalContent = useMemo(() => {
    return (
      stats.states +
      stats.cities +
      stats.categories +
      stats.places
    );
  }, [stats]);

  const maxStat = useMemo(() => {
    return Math.max(
      stats.states,
      stats.cities,
      stats.categories,
      stats.places,
      1
    );
  }, [stats]);

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status = "") => {
    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  return (
    <main className="admin-shell">

      <Sidebar />

      <section className="admin-main-content">

        {/* =====================================
            TOP HEADER
        ====================================== */}

        <header className="admin-premium-header">

          <div className="admin-premium-header-copy">

            <span>
              TRAVELBHARAT ADMINISTRATION
            </span>

            <h1>
              Dashboard
            </h1>

            <p>
              Manage destinations, monitor visitor
              activity and keep TravelBharat content
              organized from one place.
            </p>

          </div>

          <Link
            className="admin-premium-add-button"
            to="/admin/places"
          >
            <FaPlus />

            <span>
              Add Tourist Place
            </span>
          </Link>

        </header>

        {/* ERROR */}

        {error && (
          <div className="admin-alert admin-alert-error">
            {error}
          </div>
        )}

        {/* =====================================
            OVERVIEW BANNER
        ====================================== */}

        <section className="admin-overview-banner">

          <div className="admin-overview-copy">

            <span>
              PLATFORM OVERVIEW
            </span>

            <h2>
              Manage Incredible India
              <br />
              from one workspace.
            </h2>

            <p>
              TravelBharat currently contains{" "}
              <strong>
                {loading
                  ? "..."
                  : totalContent}
              </strong>{" "}
              managed tourism records across states,
              cities, categories and destinations.
            </p>

          </div>

          <div className="admin-overview-visual">

            <span>
              LIVE CONTENT
            </span>

            <strong>
              {loading
                ? "..."
                : stats.places}
            </strong>

            <p>
              Tourist places available
              on TravelBharat
            </p>

            <Link to="/admin/places">
              Manage destinations

              <FaArrowRight />
            </Link>

          </div>

        </section>

        {/* =====================================
            STATISTICS
        ====================================== */}

        <section className="admin-dashboard-stat-grid">

          {cards.map((card) => (
            <Link
              className="admin-dashboard-stat-card"
              to={card.link}
              key={card.title}
            >

              <div className="admin-dashboard-stat-top">

                <span>
                  {card.number}
                </span>

                <div
                  className={`admin-dashboard-stat-icon ${card.className}`}
                >
                  {card.icon}
                </div>

              </div>

              <strong>
                {loading
                  ? "..."
                  : card.value}
              </strong>

              <h3>
                {card.title}
              </h3>

              <p>
                {card.description}
              </p>

              <div className="admin-dashboard-stat-footer">

                <span>
                  View details
                </span>

                <FaArrowRight />

              </div>

            </Link>
          ))}

        </section>

        {/* =====================================
            CONTENT ACTIVITY
        ====================================== */}

        <section className="admin-dashboard-main-grid">

          {/* RECENT PLACES */}

          <article className="admin-dashboard-panel admin-dashboard-large-panel">

            <div className="admin-dashboard-panel-header">

              <div>
                <span>
                  LATEST CONTENT
                </span>

                <h2>
                  Recent Tourist Places
                </h2>

                <p>
                  Recently added destinations
                  available on TravelBharat.
                </p>
              </div>

              <Link to="/admin/places">
                View all
                <FaArrowRight />
              </Link>

            </div>

            {loading ? (
              <div className="admin-dashboard-loading">

                <div className="admin-loader"></div>

                <p>
                  Loading destinations...
                </p>

              </div>
            ) : recentPlaces.length === 0 ? (
              <div className="admin-dashboard-empty">

                <FaMapMarkerAlt />

                <h3>
                  No destinations found
                </h3>

                <p>
                  Add your first tourist place.
                </p>

              </div>
            ) : (
              <div className="admin-dashboard-place-list">

                {recentPlaces.map(
                  (place, index) => (
                    <div
                      className="admin-dashboard-place-row"
                      key={place._id}
                    >

                      <span className="admin-dashboard-row-number">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <div className="admin-dashboard-place-image">

                        {place.images?.length >
                        0 ? (
                          <img
                            src={getImageUrl(
                              place.images[0]
                            )}
                            alt={place.name}
                          />
                        ) : (
                          <FaMapMarkerAlt />
                        )}

                      </div>

                      <div className="admin-dashboard-place-info">

                        <h3>
                          {place.name}
                        </h3>

                        <p>
                          <FaMapMarkerAlt />

                          {place.city?.name ||
                            "Unknown city"}

                          {place.state?.name
                            ? `, ${place.state.name}`
                            : ""}
                        </p>

                      </div>

                      <span className="admin-dashboard-category">
                        {place.category?.name ||
                          "Uncategorized"}
                      </span>

                      <Link
                        className="admin-dashboard-row-action"
                        to={`/places/${place._id}`}
                      >
                        <FaArrowRight />
                      </Link>

                    </div>
                  )
                )}

              </div>
            )}

          </article>

          {/* ENQUIRIES */}

          <article className="admin-dashboard-panel">

            <div className="admin-dashboard-panel-header">

              <div>
                <span>
                  VISITOR ACTIVITY
                </span>

                <h2>
                  Recent Enquiries
                </h2>

                <p>
                  Latest messages received
                  from TravelBharat visitors.
                </p>
              </div>

              <Link to="/admin/enquiries">
                View all
                <FaArrowRight />
              </Link>

            </div>

            {loading ? (
              <div className="admin-dashboard-loading">

                <div className="admin-loader"></div>

                <p>
                  Loading enquiries...
                </p>

              </div>
            ) : recentEnquiries.length === 0 ? (
              <div className="admin-dashboard-empty">

                <FaEnvelope />

                <h3>
                  No enquiries
                </h3>

                <p>
                  Visitor messages will
                  appear here.
                </p>

              </div>
            ) : (
              <div className="admin-dashboard-enquiry-list">

                {recentEnquiries.map(
                  (enquiry) => (
                    <div
                      className="admin-dashboard-enquiry"
                      key={enquiry._id}
                    >

                      <div className="admin-dashboard-enquiry-avatar">
                        {enquiry.name
                          ?.charAt(0)
                          .toUpperCase() ||
                          "?"}
                      </div>

                      <div className="admin-dashboard-enquiry-info">

                        <h3>
                          {enquiry.name ||
                            "Visitor"}
                        </h3>

                        <p>
                          {enquiry.subject ||
                            "No subject"}
                        </p>

                        <span>
                          {formatDate(
                            enquiry.createdAt
                          )}
                        </span>

                      </div>

                      <span
                        className={`admin-dashboard-enquiry-status ${getStatusClass(
                          enquiry.status ||
                            "Pending"
                        )}`}
                      >
                        {enquiry.status ||
                          "Pending"}
                      </span>

                    </div>
                  )
                )}

              </div>
            )}

          </article>

        </section>

        {/* =====================================
            ANALYTICS + QUICK ACTIONS
        ====================================== */}

        <section className="admin-dashboard-bottom-grid">

          {/* CONTENT DISTRIBUTION */}

          <article className="admin-dashboard-panel">

            <div className="admin-dashboard-panel-header">

              <div>
                <span>
                  CONTENT ANALYTICS
                </span>

                <h2>
                  Platform Distribution
                </h2>

                <p>
                  Compare the amount of content
                  currently stored in each section.
                </p>
              </div>

            </div>

            <div className="admin-dashboard-bars">

              <div className="admin-dashboard-bar-item">

                <div>
                  <span>
                    States
                  </span>

                  <strong>
                    {stats.states}
                  </strong>
                </div>

                <div className="admin-dashboard-bar-track">
                  <span
                    style={{
                      width: `${Math.max(
                        (stats.states /
                          maxStat) *
                          100,
                        stats.states > 0
                          ? 8
                          : 0
                      )}%`,
                    }}
                  ></span>
                </div>

              </div>

              <div className="admin-dashboard-bar-item">

                <div>
                  <span>
                    Cities
                  </span>

                  <strong>
                    {stats.cities}
                  </strong>
                </div>

                <div className="admin-dashboard-bar-track">
                  <span
                    style={{
                      width: `${Math.max(
                        (stats.cities /
                          maxStat) *
                          100,
                        stats.cities > 0
                          ? 8
                          : 0
                      )}%`,
                    }}
                  ></span>
                </div>

              </div>

              <div className="admin-dashboard-bar-item">

                <div>
                  <span>
                    Categories
                  </span>

                  <strong>
                    {stats.categories}
                  </strong>
                </div>

                <div className="admin-dashboard-bar-track">
                  <span
                    style={{
                      width: `${Math.max(
                        (stats.categories /
                          maxStat) *
                          100,
                        stats.categories > 0
                          ? 8
                          : 0
                      )}%`,
                    }}
                  ></span>
                </div>

              </div>

              <div className="admin-dashboard-bar-item">

                <div>
                  <span>
                    Tourist Places
                  </span>

                  <strong>
                    {stats.places}
                  </strong>
                </div>

                <div className="admin-dashboard-bar-track">
                  <span
                    style={{
                      width: `${Math.max(
                        (stats.places /
                          maxStat) *
                          100,
                        stats.places > 0
                          ? 8
                          : 0
                      )}%`,
                    }}
                  ></span>
                </div>

              </div>

            </div>

          </article>

          {/* QUICK ACTIONS */}

          <article className="admin-dashboard-panel">

            <div className="admin-dashboard-panel-header">

              <div>
                <span>
                  CONTENT MANAGEMENT
                </span>

                <h2>
                  Quick Actions
                </h2>

                <p>
                  Jump directly to the most
                  common administration tasks.
                </p>
              </div>

            </div>

            <div className="admin-dashboard-quick-grid">

              <Link to="/admin/states">
                <div>
                  <FaMap />
                </div>

                <span>
                  Manage States
                </span>

                <FaArrowRight />
              </Link>

              <Link to="/admin/cities">
                <div>
                  <FaCity />
                </div>

                <span>
                  Manage Cities
                </span>

                <FaArrowRight />
              </Link>

              <Link to="/admin/categories">
                <div>
                  <FaLandmark />
                </div>

                <span>
                  Manage Categories
                </span>

                <FaArrowRight />
              </Link>

              <Link to="/admin/places">
                <div>
                  <FaMapMarkerAlt />
                </div>

                <span>
                  Tourist Places
                </span>

                <FaArrowRight />
              </Link>

              <Link to="/admin/enquiries">
                <div>
                  <FaEnvelope />
                </div>

                <span>
                  View Enquiries
                </span>

                <FaArrowRight />
              </Link>

            </div>

          </article>

        </section>

      </section>

    </main>
  );
}

export default Dashboard;