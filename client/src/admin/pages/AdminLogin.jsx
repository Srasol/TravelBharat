import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaMapMarkedAlt,
} from "react-icons/fa";

import { loginAdmin } from "../../services/adminAuthService";
import "../styles/adminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await loginAdmin({
        email: formData.email.trim(),
        password: formData.password,
      });

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem(
        "travelbharatAdmin",
        JSON.stringify(data.admin)
      );

      navigate("/admin/dashboard");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-overlay"></div>

      <section className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-login-logo">
            <FaMapMarkedAlt />
          </span>

          <div>
            <h1>
              Travel<span>Bharat</span>
            </h1>
            <p>Tourism Management Portal</p>
          </div>
        </div>

        <div className="admin-login-heading">
          <span>Secure Admin Access</span>
          <h2>Welcome back</h2>
          <p>Sign in to manage TravelBharat content.</p>
        </div>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email address</label>

          <div className="admin-input-group">
            <FaEnvelope />

            <input
              id="admin-email"
              name="email"
              type="email"
              placeholder="admin@travelbharat.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <label htmlFor="admin-password">Password</label>

          <div className="admin-input-group">
            <FaLock />

            <input
              id="admin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter admin password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <button
              className="admin-password-toggle"
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label="Show or hide password"
              disabled={loading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            className="admin-login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in to Dashboard"}
          </button>
        </form>

        <div className="admin-demo-credentials">
          <strong>Admin login</strong>
          <span>admin@travelbharat.com</span>
          <span>admin123</span>
        </div>
      </section>
    </main>
  );
}

export default AdminLogin;