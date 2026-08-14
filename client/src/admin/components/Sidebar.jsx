import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaCity,
  FaEnvelope,
  FaHome,
  FaLandmark,
  FaMap,
  FaMapMarkerAlt,
  FaSignOutAlt,
} from "react-icons/fa";

import "../styles/admin.css";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("travelbharatAdmin");
    navigate("/admin");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "admin-sidebar-link active"
      : "admin-sidebar-link";

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="admin-brand-logo">TB</div>

        <div>
          <h2>
            Travel<span>Bharat</span>
          </h2>
          <p>Administration</p>
        </div>
      </div>

      <div className="admin-sidebar-section-title">
        Main menu
      </div>

      <nav className="admin-sidebar-navigation">
        <NavLink
          className={linkClass}
          to="/admin/dashboard"
        >
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          className={linkClass}
          to="/admin/states"
        >
          <FaMap />
          <span>States</span>
        </NavLink>

        <NavLink
          className={linkClass}
          to="/admin/cities"
        >
          <FaCity />
          <span>Cities</span>
        </NavLink>

        <NavLink
          className={linkClass}
          to="/admin/categories"
        >
          <FaLandmark />
          <span>Categories</span>
        </NavLink>

        <NavLink
          className={linkClass}
          to="/admin/places"
        >
          <FaMapMarkerAlt />
          <span>Tourist Places</span>
        </NavLink>

        <NavLink
          className={linkClass}
          to="/admin/enquiries"
        >
          <FaEnvelope />
          <span>Enquiries</span>
        </NavLink>
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-profile-mini">
          <div className="admin-profile-avatar">A</div>

          <div>
            <strong>Administrator</strong>
            <span>Content Manager</span>
          </div>
        </div>

        <button
          className="admin-logout-button"
          type="button"
          onClick={logout}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;