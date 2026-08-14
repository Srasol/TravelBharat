import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "./components/Layout/AppLayout";

import Home from "./pages/Home";
import States from "./pages/States";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import StateDetails from "./pages/StateDetails";
import PlaceDetails from "./pages/PlaceDetails";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import AdminStates from "./admin/pages/States";
import AdminCities from "./admin/pages/Cities";
import AdminCategories from "./admin/pages/Categories";
import AdminTouristPlaces from "./admin/pages/TouristPlaces";
import ProtectedAdminRoute from "./admin/components/ProtectedAdminRoute";
import PublicAdminRoute from "./admin/components/PublicAdminRoute";
import AdminEnquiries from "./admin/pages/Enquiries";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/states" element={<States />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/states/:id" element={<StateDetails />} />
          <Route path="/places/:id" element={<PlaceDetails />} />
          <Route path="/search" element={<Search />} />

          <Route
  path="/admin"
  element={
    <PublicAdminRoute>
      <AdminLogin />
    </PublicAdminRoute>
  }
/>
          <Route element={<ProtectedAdminRoute />}></Route>
          <Route
            path="/admin/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/admin/states"
            element={<AdminStates />}
          />
          <Route
            path="/admin/cities"
            element={<AdminCities />}
          />
          <Route
            path="/admin/categories"
            element={<AdminCategories />}
          />
          <Route
            path="/admin/places"
            element={<AdminTouristPlaces />}
          />
          <Route
  path="/admin/enquiries"
  element={<AdminEnquiries />}
/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;