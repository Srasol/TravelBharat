import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

function AppLayout({ children }) {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
    </>
  );
}

export default AppLayout;