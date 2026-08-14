import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FaBars,
  FaCompass,
  FaSearch,
  FaTimes,
  FaUserShield,
} from "react-icons/fa";

import "../../styles/navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "travel-nav-link active"
      : "travel-nav-link";

  return (
    <>
      <header
        className={
          scrolled
            ? "travel-header travel-header-scrolled"
            : "travel-header"
        }
      >
        <nav className="travel-navbar container">

          {/* LOGO */}

          <Link
            className="travel-brand"
            to="/"
            onClick={closeMenu}
          >
            <span className="travel-brand-icon">
              <FaCompass />
            </span>

            <span className="travel-brand-text">
              Travel<span>Bharat</span>
            </span>
          </Link>

          {/* MOBILE BUTTON */}

          <button
            className="travel-menu-toggle"
            type="button"
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* NAVIGATION */}

          <div
            className={
              menuOpen
                ? "travel-nav-content open"
                : "travel-nav-content"
            }
          >
            <div className="travel-nav-links">

              <NavLink
                className={navLinkClass}
                to="/"
                onClick={closeMenu}
              >
                Home
              </NavLink>

              <NavLink
                className={navLinkClass}
                to="/search"
                onClick={closeMenu}
              >
                Explore
              </NavLink>

              <NavLink
                className={navLinkClass}
                to="/states"
                onClick={closeMenu}
              >
                States
              </NavLink>

              <NavLink
                className={navLinkClass}
                to="/gallery"
                onClick={closeMenu}
              >
                Gallery
              </NavLink>

              <NavLink
                className={navLinkClass}
                to="/about"
                onClick={closeMenu}
              >
                About
              </NavLink>

              <NavLink
                className={navLinkClass}
                to="/contact"
                onClick={closeMenu}
              >
                Contact
              </NavLink>

            </div>

            {/* ACTION BUTTONS */}

            <div className="travel-nav-actions">

              <Link
                className="travel-search-button"
                to="/search"
                onClick={closeMenu}
                aria-label="Search destinations"
              >
                <FaSearch />
              </Link>

              <Link
                className="travel-explore-button"
                to="/search"
                onClick={closeMenu}
              >
                <FaCompass />
                Explore India
              </Link>

              <Link
                className="travel-admin-button"
                to="/admin"
                onClick={closeMenu}
              >
                <FaUserShield />
                Admin
              </Link>

            </div>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <button
          type="button"
          className="travel-mobile-overlay"
          onClick={closeMenu}
          aria-label="Close navigation menu"
        />
      )}
    </>
  );
}

export default Navbar;