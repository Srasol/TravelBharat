import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaCity,
  FaEnvelope,
  FaHome,
  FaLandmark,
  FaMap,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";

import "../styles/admin.css";

function Sidebar() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("travelbharatAdmin");

    navigate("/admin");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "admin-sidebar-link active"
      : "admin-sidebar-link";

  const closeMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* ==========================================
          ADMIN TOP HEADER
      ========================================== */}

      <header className="admin-global-header">

        <div className="admin-global-header-left">

          <button
            type="button"
            className="admin-mobile-menu-button"
            onClick={() =>
              setMobileOpen(
                (current) => !current
              )
            }
            aria-label="Open admin menu"
          >
            {mobileOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>

          <div>
            <span>
              TRAVELBHARAT
            </span>

            <strong>
              Administration
            </strong>
          </div>

        </div>

        <div className="admin-global-header-right">

          <div className="admin-global-profile">

            <div className="admin-global-avatar">
              A
            </div>

            <div>
              <strong>
                Administrator
              </strong>

              <span>
                Content Manager
              </span>
            </div>

          </div>

          <button
            type="button"
            className="admin-header-logout"
            onClick={logout}
          >
            <FaSignOutAlt />

            <span>
              Logout
            </span>
          </button>

        </div>

      </header>

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside
        className={
          mobileOpen
            ? "admin-sidebar open"
            : "admin-sidebar"
        }
      >

        {/* BRAND */}

        <div className="admin-sidebar-brand">

          <div className="admin-brand-logo">
            TB
          </div>

          <div>
            <h2>
              Travel<span>Bharat</span>
            </h2>

            <p>
              Admin Workspace
            </p>
          </div>

        </div>

        {/* SECTION */}

        <div className="admin-sidebar-section-title">
          Navigation
        </div>

        {/* LINKS */}

        <nav className="admin-sidebar-navigation">

          <NavLink
            className={linkClass}
            to="/admin/dashboard"
            onClick={closeMenu}
          >
            <FaHome />

            <span>
              Dashboard
            </span>
          </NavLink>

          <NavLink
            className={linkClass}
            to="/admin/states"
            onClick={closeMenu}
          >
            <FaMap />

            <span>
              States
            </span>
          </NavLink>

          <NavLink
            className={linkClass}
            to="/admin/cities"
            onClick={closeMenu}
          >
            <FaCity />

            <span>
              Cities
            </span>
          </NavLink>

          <NavLink
            className={linkClass}
            to="/admin/categories"
            onClick={closeMenu}
          >
            <FaLandmark />

            <span>
              Categories
            </span>
          </NavLink>

          <NavLink
            className={linkClass}
            to="/admin/places"
            onClick={closeMenu}
          >
            <FaMapMarkerAlt />

            <span>
              Tourist Places
            </span>
          </NavLink>

          <NavLink
            className={linkClass}
            to="/admin/enquiries"
            onClick={closeMenu}
          >
            <FaEnvelope />

            <span>
              Enquiries
            </span>
          </NavLink>

        </nav>

        {/* FOOTER */}

        <div className="admin-sidebar-footer">

          <div className="admin-sidebar-help">

            <span>
              TRAVELBHARAT
            </span>

            <strong>
              Tourism Management
            </strong>

            <p>
              Manage your tourism content from one place.
            </p>

          </div>

        </div>

      </aside>

      {/* MOBILE OVERLAY */}

      {mobileOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          onClick={closeMenu}
          aria-label="Close admin menu"
        />
      )}
    </>
  );
}

export default Sidebar;