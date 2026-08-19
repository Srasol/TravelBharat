import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
} from "react-router-dom";

import {
  FaArrowRight,
  FaBars,
  FaCompass,
  FaSearch,
  FaTimes,
  FaUserShield,
} from "react-icons/fa";

import "../../styles/navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const location = useLocation();

  /* =========================================
     NAVBAR SCROLL EFFECT
  ========================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* =========================================
     CLOSE MENU AFTER ROUTE CHANGE
  ========================================= */

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  /* =========================================
     PREVENT PAGE SCROLL WHEN MENU IS OPEN
  ========================================= */

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* =========================================
     CLOSE MENU
  ========================================= */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* =========================================
     NAV LINK CLASS
  ========================================= */

  const navLinkClass = ({
    isActive,
  }) =>
    isActive
      ? "luxury-nav-link active"
      : "luxury-nav-link";

  return (
    <>
      {/* =====================================
          HEADER
      ====================================== */}

      <header
        className={
          scrolled
            ? "luxury-header luxury-header-scrolled"
            : "luxury-header"
        }
      >
        <nav className="luxury-navbar container">

          {/* =================================
              BRAND
          ================================== */}

          <Link
            className="luxury-brand"
            to="/"
            onClick={closeMenu}
          >
            <div className="luxury-brand-mark">
              <FaCompass />
            </div>

            <div className="luxury-brand-copy">
              <strong>
                Travel<span>Bharat</span>
              </strong>

              <small>
                DISCOVER INDIA
              </small>
            </div>
          </Link>

          {/* =================================
              NAVIGATION PANEL
          ================================== */}

          <div
            className={
              menuOpen
                ? "luxury-nav-panel open"
                : "luxury-nav-panel"
            }
          >
            {/* NAV LINKS */}

            <div className="luxury-nav-links">

              <NavLink
                className={navLinkClass}
                to="/"
                onClick={closeMenu}
              >
                <span>01</span>
                Home
              </NavLink>

              <NavLink
                className={navLinkClass}
                to="/search"
                onClick={closeMenu}
              >
                <span>02</span>
                Explore
              </NavLink>

              <NavLink
                className={navLinkClass}
                to="/states"
                onClick={closeMenu}
              >
                <span>03</span>
                States
              </NavLink>

              <NavLink
                className={navLinkClass}
                to="/gallery"
                onClick={closeMenu}
              >
                <span>04</span>
                Gallery
              </NavLink>

              <NavLink
                className={navLinkClass}
                to="/about"
                onClick={closeMenu}
              >
                <span>05</span>
                About
              </NavLink>

              <NavLink
                className={navLinkClass}
                to="/contact"
                onClick={closeMenu}
              >
                <span>06</span>
                Contact
              </NavLink>

            </div>

            {/* =================================
                ACTION BUTTONS
            ================================== */}

            <div className="luxury-nav-actions">

              <Link
                className="luxury-search-action"
                to="/search"
                onClick={closeMenu}
                aria-label="Search destinations"
              >
                <FaSearch />
              </Link>

              <Link
                className="luxury-explore-action"
                to="/search"
                onClick={closeMenu}
              >
                Explore India

                <FaArrowRight />
              </Link>

              <Link
                className="luxury-admin-action"
                to="/admin"
                onClick={closeMenu}
                aria-label="Admin"
              >
                <FaUserShield />
              </Link>

            </div>
          </div>

          {/* =================================
              MOBILE MENU BUTTON
          ================================== */}

          <button
            type="button"
            className="luxury-menu-toggle"
            onClick={() =>
              setMenuOpen(
                (current) => !current
              )
            }
            aria-label={
              menuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>

        </nav>
      </header>

      {/* =====================================
          MOBILE DARK OVERLAY
      ====================================== */}

      {menuOpen && (
        <button
          type="button"
          className="luxury-nav-overlay"
          onClick={closeMenu}
          aria-label="Close navigation"
        />
      )}
    </>
  );
}

export default Navbar;