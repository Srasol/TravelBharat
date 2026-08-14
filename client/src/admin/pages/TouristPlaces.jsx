import { useEffect, useMemo, useState } from "react";
import {
  FaEdit,
  FaImage,
  FaMapMarkerAlt,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import API from "../../services/api";

import {
  createPlace,
  deletePlace,
  getPlaces,
  updatePlace,
} from "../../services/adminPlaceService";

import "../styles/admin.css";

const emptyForm = {
  name: "",
  state: "",
  city: "",
  category: "",
  description: "",
  history: "",
  bestTime: "",
  entryFee: "",
  timings: "",
  googleMap: "",
  nearbyAttractions: "",
  images: [],
};

function TouristPlaces() {
  const [places, setPlaces] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState(emptyForm);
  const [editingPlace, setEditingPlace] = useState(null);

  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        placesData,
        statesResponse,
        citiesResponse,
        categoriesResponse,
      ] = await Promise.all([
        getPlaces(),
        API.get("/states"),
        API.get("/cities"),
        API.get("/categories"),
      ]);

      setPlaces(placesData.places || []);
      setStates(statesResponse.data.states || []);
      setCities(citiesResponse.data.cities || []);
      setCategories(categoriesResponse.data.categories || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load tourist places."
      );
    } finally {
      setLoading(false);
    }
  };

  const availableCities = useMemo(() => {
    if (!formData.state) {
      return cities;
    }

    return cities.filter(
      (city) => city.state?._id === formData.state
    );
  }, [cities, formData.state]);

  const filteredPlaces = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return places.filter((place) => {
      const matchesSearch =
        !keyword ||
        place.name?.toLowerCase().includes(keyword) ||
        place.state?.name?.toLowerCase().includes(keyword) ||
        place.city?.name?.toLowerCase().includes(keyword) ||
        place.category?.name?.toLowerCase().includes(keyword);

      const matchesState =
        !stateFilter || place.state?._id === stateFilter;

      const matchesCategory =
        !categoryFilter ||
        place.category?._id === categoryFilter;

      return (
        matchesSearch &&
        matchesState &&
        matchesCategory
      );
    });
  }, [places, search, stateFilter, categoryFilter]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "images") {
      const selectedFiles = Array.from(files || []);

      setFormData((previousData) => ({
        ...previousData,
        images: selectedFiles,
      }));

      const previews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );

      setImagePreviews(previews);
      return;
    }

    if (name === "state") {
      setFormData((previousData) => ({
        ...previousData,
        state: value,
        city: "",
      }));

      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const openAddForm = () => {
    setEditingPlace(null);
    setFormData(emptyForm);
    setImagePreviews([]);
    setMessage("");
    setError("");
    setShowForm(true);
  };

  const openEditForm = (place) => {
    setEditingPlace(place);

    setFormData({
      name: place.name || "",
      state: place.state?._id || "",
      city: place.city?._id || "",
      category: place.category?._id || "",
      description: place.description || "",
      history: place.history || "",
      bestTime: place.bestTime || "",
      entryFee: place.entryFee || "",
      timings: place.timings || "",
      googleMap: place.googleMap || "",
      nearbyAttractions:
        place.nearbyAttractions?.join(", ") || "",
      images: [],
    });

    setImagePreviews(
      place.images?.map(
        (image) => `http://localhost:5000/${image}`
      ) || []
    );

    setMessage("");
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPlace(null);
    setFormData(emptyForm);
    setImagePreviews([]);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.state ||
      !formData.city ||
      !formData.category ||
      !formData.description.trim()
    ) {
      setError(
        "Name, state, city, category and description are required."
      );
      return;
    }

    const payload = new FormData();

    payload.append("name", formData.name.trim());
    payload.append("state", formData.state);
    payload.append("city", formData.city);
    payload.append("category", formData.category);
    payload.append(
      "description",
      formData.description.trim()
    );
    payload.append("history", formData.history.trim());
    payload.append("bestTime", formData.bestTime.trim());
    payload.append("entryFee", formData.entryFee.trim());
    payload.append("timings", formData.timings.trim());
    payload.append("googleMap", formData.googleMap.trim());
    payload.append(
      "nearbyAttractions",
      formData.nearbyAttractions.trim()
    );

    formData.images.forEach((image) => {
      payload.append("images", image);
    });

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingPlace) {
        const data = await updatePlace(
          editingPlace._id,
          payload
        );

        setMessage(
          data.message ||
            "Tourist place updated successfully."
        );
      } else {
        const data = await createPlace(payload);

        setMessage(
          data.message ||
            "Tourist place created successfully."
        );
      }

      await loadInitialData();
      closeForm();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to save tourist place."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (place) => {
    const confirmed = window.confirm(
      `Delete ${place.name}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const data = await deletePlace(place._id);

      setMessage(
        data.message ||
          "Tourist place deleted successfully."
      );

      setPlaces((previousPlaces) =>
        previousPlaces.filter(
          (item) => item._id !== place._id
        )
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to delete tourist place."
      );
    }
  };

  return (
    <main className="admin-management-page">
      <Sidebar />

      <section className="admin-management-content">
        <header className="admin-page-header">
          <div>
            <span>Content Management</span>

            <h1>Manage Tourist Places</h1>

            <p>
              Add, update and manage tourism destinations.
            </p>
          </div>

          <button
            className="admin-primary-button"
            type="button"
            onClick={openAddForm}
          >
            <FaPlus />
            Add Tourist Place
          </button>
        </header>

        {message && (
          <div className="admin-success-message">
            {message}
          </div>
        )}

        {error && !showForm && (
          <div className="admin-error-message">
            {error}
          </div>
        )}

        <section className="admin-table-panel">
          <div className="admin-place-toolbar">
            <div className="admin-search-box">
              <FaSearch />

              <input
                type="search"
                placeholder="Search places..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <select
              value={stateFilter}
              onChange={(event) =>
                setStateFilter(event.target.value)
              }
            >
              <option value="">All States</option>

              {states.map((state) => (
                <option
                  key={state._id}
                  value={state._id}
                >
                  {state.name}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
            >
              <option value="">All Categories</option>

              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>
              ))}
            </select>

            <span className="admin-result-count">
              {filteredPlaces.length} place
              {filteredPlaces.length === 1 ? "" : "s"}
            </span>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              <div className="admin-spinner"></div>
              <p>Loading tourist places...</p>
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="admin-empty-state">
              <FaMapMarkerAlt size={36} />

              <h3>No tourist places found</h3>

              <p>
                Add a destination or change your filters.
              </p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Place</th>
                    <th>State</th>
                    <th>City</th>
                    <th>Category</th>
                    <th>Best Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPlaces.map((place) => (
                    <tr key={place._id}>
                      <td>
                        <div className="admin-state-image">
                          {place.images?.length > 0 ? (
                            <img
                              src={`http://localhost:5000/${place.images[0]}`}
                              alt={place.name}
                            />
                          ) : (
                            <FaImage />
                          )}
                        </div>
                      </td>

                      <td>
                        <strong>{place.name}</strong>
                      </td>

                      <td>
                        {place.state?.name ||
                          "Not available"}
                      </td>

                      <td>
                        {place.city?.name ||
                          "Not available"}
                      </td>

                      <td>
                        <span className="admin-category-badge">
                          {place.category?.name ||
                            "Not available"}
                        </span>
                      </td>

                      <td>
                        {place.bestTime ||
                          "Not available"}
                      </td>

                      <td>
                        <div className="admin-table-actions">
                          <button
                            className="admin-edit-button"
                            type="button"
                            title="Edit place"
                            onClick={() =>
                              openEditForm(place)
                            }
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="admin-delete-button"
                            type="button"
                            title="Delete place"
                            onClick={() =>
                              handleDelete(place)
                            }
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>

      {showForm && (
        <div className="admin-modal-backdrop">
          <section className="admin-form-modal admin-place-modal">
            <header className="admin-modal-header">
              <div>
                <span>
                  {editingPlace
                    ? "Update Destination"
                    : "New Destination"}
                </span>

                <h2>
                  {editingPlace
                    ? "Edit Tourist Place"
                    : "Add Tourist Place"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close form"
              >
                <FaTimes />
              </button>
            </header>

            {error && (
              <div className="admin-error-message">
                {error}
              </div>
            )}

            <form
              className="admin-state-form"
              onSubmit={handleSubmit}
            >
              <div className="admin-form-grid">
                <div className="admin-form-field">
                  <label htmlFor="place-name">
                    Place name
                  </label>

                  <input
                    id="place-name"
                    name="name"
                    type="text"
                    placeholder="Example: Munnar"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-form-field">
                  <label htmlFor="place-category">
                    Category
                  </label>

                  <select
                    id="place-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category._id}
                        value={category._id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-field">
                  <label htmlFor="place-state">
                    State
                  </label>

                  <select
                    id="place-state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select state
                    </option>

                    {states.map((state) => (
                      <option
                        key={state._id}
                        value={state._id}
                      >
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-field">
                  <label htmlFor="place-city">
                    City
                  </label>

                  <select
                    id="place-city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!formData.state}
                    required
                  >
                    <option value="">
                      {formData.state
                        ? "Select city"
                        : "Select state first"}
                    </option>

                    {availableCities.map((city) => (
                      <option
                        key={city._id}
                        value={city._id}
                      >
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-form-field">
                <label htmlFor="place-description">
                  Description
                </label>

                <textarea
                  id="place-description"
                  name="description"
                  rows="4"
                  placeholder="Write the destination overview..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="place-history">
                  History
                </label>

                <textarea
                  id="place-history"
                  name="history"
                  rows="4"
                  placeholder="Write its historical significance..."
                  value={formData.history}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-field">
                  <label htmlFor="place-best-time">
                    Best time to visit
                  </label>

                  <input
                    id="place-best-time"
                    name="bestTime"
                    type="text"
                    placeholder="September to March"
                    value={formData.bestTime}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-field">
                  <label htmlFor="place-entry-fee">
                    Entry fee
                  </label>

                  <input
                    id="place-entry-fee"
                    name="entryFee"
                    type="text"
                    placeholder="₹50 or Free"
                    value={formData.entryFee}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-field">
                  <label htmlFor="place-timings">
                    Timings
                  </label>

                  <input
                    id="place-timings"
                    name="timings"
                    type="text"
                    placeholder="6:00 AM - 6:00 PM"
                    value={formData.timings}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-field">
                  <label htmlFor="place-map">
                    Google Maps link
                  </label>

                  <input
                    id="place-map"
                    name="googleMap"
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={formData.googleMap}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="admin-form-field">
                <label htmlFor="place-attractions">
                  Nearby attractions
                </label>

                <input
                  id="place-attractions"
                  name="nearbyAttractions"
                  type="text"
                  placeholder="Echo Point, Tea Museum, Mattupetty Dam"
                  value={formData.nearbyAttractions}
                  onChange={handleChange}
                />

                <small>
                  Separate each attraction using a comma.
                </small>
              </div>

              <div className="admin-form-field">
                <label htmlFor="place-images">
                  Tourist place images
                </label>

                <input
                  id="place-images"
                  name="images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleChange}
                />

                <small>
                  Upload up to 10 JPG, PNG or WEBP images.
                </small>
              </div>

              {imagePreviews.length > 0 && (
                <div className="admin-place-preview-grid">
                  {imagePreviews.map(
                    (preview, index) => (
                      <img
                        key={`${preview}-${index}`}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                      />
                    )
                  )}
                </div>
              )}

              <div className="admin-form-actions">
                <button
                  className="admin-secondary-button"
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  className="admin-primary-button"
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingPlace
                      ? "Update Place"
                      : "Save Place"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default TouristPlaces;