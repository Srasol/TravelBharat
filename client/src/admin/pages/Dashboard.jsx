import { useEffect, useState } from "react";
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

      const places = placesResponse.data.places || [];
      const enquiries =
        enquiriesResponse.data.enquiries || [];

      setStats({
        states: statesResponse.data.count || 0,
        cities: citiesResponse.data.count || 0,
        categories: categoriesResponse.data.count || 0,
        places: placesResponse.data.count || 0,
        enquiries: enquiriesResponse.data.count || 0,
      });

      setRecentPlaces(places.slice(0, 4));
      setRecentEnquiries(enquiries.slice(0, 4));
    } catch (requestError) {
      console.error("Dashboard error:", requestError);

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
      title: "Total States",
      value: stats.states,
      icon: <FaMap />,
      link: "/admin/states",
      className: "orange",
    },
    {
      title: "Total Cities",
      value: stats.cities,
      icon: <FaCity />,
      link: "/admin/cities",
      className: "blue",
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: <FaLandmark />,
      link: "/admin/categories",
      className: "green",
    },
    {
      title: "Tourist Places",
      value: stats.places,
      icon: <FaMapMarkerAlt />,
      link: "/admin/places",
      className: "purple",
    },
    {
      title: "Enquiries",
      value: stats.enquiries,
      icon: <FaEnvelope />,
      link: "/admin/enquiries",
      className: "red",
    },
  ];

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="admin-shell">
      <Sidebar />

      <section className="admin-main-content">
        <header className="admin-topbar">
          <div>
            <p>TravelBharat Administration</p>
            <h1>Dashboard</h1>
            <span>
              Manage tourism content and monitor recent
              platform activity.
            </span>
          </div>

          <Link
            className="admin-topbar-button"
            to="/admin/places"
          >
            <FaPlus />
            Add Tourist Place
          </Link>
        </header>

        {error && (
          <div className="admin-alert admin-alert-error">
            {error}
          </div>
        )}

        <section className="admin-statistics-grid">
          {cards.map((card) => (
            <Link
              className="admin-dashboard-card"
              to={card.link}
              key={card.title}
            >
              <div
                className={`admin-dashboard-card-icon ${card.className}`}
              >
                {card.icon}
              </div>

              <div className="admin-dashboard-card-content">
                <span>{card.title}</span>

                <strong>
                  {loading ? "..." : card.value}
                </strong>

                <small>
                  View details
                  <FaArrowRight />
                </small>
              </div>
            </Link>
          ))}
        </section>

        <section className="admin-dashboard-two-column">
          <article className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <p>Latest content</p>
                <h2>Recent Tourist Places</h2>
              </div>

              <Link to="/admin/places">View all</Link>
            </div>

            {loading ? (
              <div className="admin-loading-area">
                <div className="admin-loader"></div>
                <p>Loading places...</p>
              </div>
            ) : recentPlaces.length === 0 ? (
              <div className="admin-empty-area">
                <FaMapMarkerAlt />
                <h3>No places found</h3>
                <p>Add your first tourist destination.</p>
              </div>
            ) : (
              <div className="admin-recent-list">
                {recentPlaces.map((place) => (
                  <div
                    className="admin-recent-place"
                    key={place._id}
                  >
                    <div className="admin-recent-place-image">
                      {place.images?.length > 0 ? (
                        <img
                          src={`http://localhost:5000/${place.images[0]}`}
                          alt={place.name}
                        />
                      ) : (
                        <FaMapMarkerAlt />
                      )}
                    </div>

                    <div className="admin-recent-place-info">
                      <h3>{place.name}</h3>

                      <p>
                        {place.city?.name ||
                          "Unknown city"}
                        ,{" "}
                        {place.state?.name ||
                          "Unknown state"}
                      </p>

                      <span>
                        {place.category?.name ||
                          "Uncategorized"}
                      </span>
                    </div>

                    <Link
                      to={`/places/${place._id}`}
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <p>Visitor communication</p>
                <h2>Recent Enquiries</h2>
              </div>

              <Link to="/admin/enquiries">
                View all
              </Link>
            </div>

            {loading ? (
              <div className="admin-loading-area">
                <div className="admin-loader"></div>
                <p>Loading enquiries...</p>
              </div>
            ) : recentEnquiries.length === 0 ? (
              <div className="admin-empty-area">
                <FaEnvelope />
                <h3>No enquiries found</h3>
                <p>Visitor messages will appear here.</p>
              </div>
            ) : (
              <div className="admin-enquiry-list">
                {recentEnquiries.map((enquiry) => (
                  <div
                    className="admin-enquiry-card"
                    key={enquiry._id}
                  >
                    <div className="admin-enquiry-avatar">
                      {enquiry.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <h3>{enquiry.name}</h3>
                      <p>{enquiry.subject}</p>
                      <span>
                        {formatDate(enquiry.createdAt)}
                      </span>
                    </div>

                    <span
                      className={`admin-enquiry-status ${enquiry.status?.toLowerCase()}`}
                    >
                      {enquiry.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>

        <section className="admin-panel admin-quick-panel">
          <div className="admin-panel-header">
            <div>
              <p>Content management</p>
              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className="admin-quick-grid">
            <Link to="/admin/states">
              <FaPlus />
              <span>Add State</span>
            </Link>

            <Link to="/admin/cities">
              <FaPlus />
              <span>Add City</span>
            </Link>

            <Link to="/admin/categories">
              <FaPlus />
              <span>Add Category</span>
            </Link>

            <Link to="/admin/places">
              <FaPlus />
              <span>Add Tourist Place</span>
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Dashboard;