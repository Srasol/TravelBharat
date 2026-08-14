import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import API from "../../services/api";

function ProtectedAdminRoute() {
  const token = localStorage.getItem("adminToken");

  const [checking, setChecking] = useState(Boolean(token));
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!token) {
        setChecking(false);
        setAuthorized(false);
        return;
      }

      try {
        await API.get("/admin/auth/me");
        setAuthorized(true);
      } catch (error) {
        console.error("Admin verification failed:", error);

        localStorage.removeItem("adminToken");
        localStorage.removeItem("travelbharatAdmin");

        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    };

    verifyAdmin();
  }, [token]);

  if (checking) {
    return (
      <main className="admin-route-loading">
        <div className="admin-spinner"></div>
        <p>Verifying admin session...</p>
      </main>
    );
  }

  if (!authorized) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

export default ProtectedAdminRoute;