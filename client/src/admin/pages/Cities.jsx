import { useEffect, useMemo, useState } from "react";
import {
  FaCity,
  FaEdit,
  FaImage,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import API from "../../services/api";

import {
  createCity,
  deleteCity,
  getCities,
  updateCity,
} from "../../services/adminCityService";

import { getImageUrl } from "../../utils/imageUrl";

import "../styles/admin.css";

const emptyForm = {
  state: "",
  name: "",
  description: "",
  image: null,
};

function Cities() {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);

  const [formData, setFormData] = useState(emptyForm);
  const [editingCity, setEditingCity] = useState(null);

  const [search, setSearch] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ======================================================
     LOAD CITIES + STATES
  ====================================================== */

  useEffect(() => {
    loadCitiesPage();
  }, []);

  const loadCitiesPage = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        citiesData,
        statesResponse,
      ] = await Promise.all([
        getCities(),
        API.get("/states"),
      ]);

      setCities(
        citiesData.cities || []
      );

      setStates(
        statesResponse.data.states || []
      );
    } catch (requestError) {
      console.error(
        "Cities load error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to load cities."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     SEARCH
  ====================================================== */

  const filteredCities = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return cities;
    }

    return cities.filter((city) => {
      return (
        city.name
          ?.toLowerCase()
          .includes(keyword) ||
        city.state?.name
          ?.toLowerCase()
          .includes(keyword) ||
        city.description
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [cities, search]);

  /* ======================================================
     HANDLE FORM CHANGE
  ====================================================== */

  const handleChange = (event) => {
    const {
      name,
      value,
      files,
    } = event.target;

    if (name === "image") {
      const selectedFile =
        files?.[0] || null;

      setFormData((previous) => ({
        ...previous,
        image: selectedFile,
      }));

      if (selectedFile) {
        setImagePreview(
          URL.createObjectURL(
            selectedFile
          )
        );
      }

      setError("");

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  /* ======================================================
     OPEN ADD FORM
  ====================================================== */

  const openAddForm = () => {
    setEditingCity(null);

    setFormData(emptyForm);

    setImagePreview("");

    setMessage("");

    setError("");

    setShowForm(true);
  };

  /* ======================================================
     OPEN EDIT FORM
  ====================================================== */

  const openEditForm = (city) => {
    setEditingCity(city);

    setFormData({
      state:
        city.state?._id || "",

      name:
        city.name || "",

      description:
        city.description || "",

      image: null,
    });

    setImagePreview(
      city.image
        ? getImageUrl(
            city.image
          )
        : ""
    );

    setMessage("");

    setError("");

    setShowForm(true);
  };

  /* ======================================================
     CLOSE FORM
  ====================================================== */

  const closeForm = () => {
    setShowForm(false);

    setEditingCity(null);

    setFormData(emptyForm);

    setImagePreview("");

    setError("");
  };

  /* ======================================================
     SAVE CITY
  ====================================================== */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
      !formData.state ||
      !formData.name.trim() ||
      !formData.description.trim()
    ) {
      setError(
        "State, city name and description are required."
      );

      return;
    }

    const payload =
      new FormData();

    payload.append(
      "state",
      formData.state
    );

    payload.append(
      "name",
      formData.name.trim()
    );

    payload.append(
      "description",
      formData.description.trim()
    );

    if (formData.image) {
      payload.append(
        "image",
        formData.image
      );
    }

    try {
      setSaving(true);

      setMessage("");

      setError("");

      if (editingCity) {
        const data =
          await updateCity(
            editingCity._id,
            payload
          );

        setMessage(
          data.message ||
            "City updated successfully."
        );
      } else {
        const data =
          await createCity(
            payload
          );

        setMessage(
          data.message ||
            "City created successfully."
        );
      }

      await loadCitiesPage();

      closeForm();
    } catch (requestError) {
      console.error(
        "Save city error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to save city."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ======================================================
     DELETE CITY
  ====================================================== */

  const handleDelete = async (
    city
  ) => {
    const confirmed =
      window.confirm(
        `Delete ${city.name}? This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");

      setError("");

      const data =
        await deleteCity(
          city._id
        );

      setCities((previous) =>
        previous.filter(
          (item) =>
            item._id !==
            city._id
        )
      );

      setMessage(
        data.message ||
          "City deleted successfully."
      );
    } catch (requestError) {
      console.error(
        "Delete city error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to delete city."
      );
    }
  };

  /* ======================================================
     PAGE
  ====================================================== */

  return (
    <main className="admin-management-page">

      <Sidebar />

      <section className="admin-management-content">

        {/* HEADER */}

        <header className="admin-page-header">

          <div>

            <span>
              Destination Management
            </span>

            <h1>
              Cities
            </h1>

            <p>
              Add and maintain city-wise tourism information.
            </p>

          </div>

          <button
            className="admin-primary-button"
            type="button"
            onClick={openAddForm}
          >
            <FaPlus />

            Add City
          </button>

        </header>

        {/* SUCCESS */}

        {message && (
          <div className="admin-success-message">
            {message}
          </div>
        )}

        {/* ERROR */}

        {error && !showForm && (
          <div className="admin-error-message">
            {error}
          </div>
        )}

        {/* TABLE PANEL */}

        <section className="admin-table-panel">

          {/* TOOLBAR */}

          <div className="admin-table-toolbar">

            <div className="admin-search-box">

              <FaSearch />

              <input
                type="search"
                placeholder="Search city, state or description..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </div>

            <span className="admin-result-count">
              {filteredCities.length}{" "}
              {filteredCities.length === 1
                ? "city"
                : "cities"}
            </span>

          </div>

          {/* LOADING */}

          {loading ? (
            <div className="admin-empty-state">

              <div className="admin-spinner"></div>

              <p>
                Loading cities...
              </p>

            </div>
          ) : filteredCities.length ===
            0 ? (
            <div className="admin-empty-state">

              <FaCity size={34} />

              <h3>
                No cities found
              </h3>

              <p>
                Add a city or change the search keyword.
              </p>

            </div>
          ) : (
            <div className="admin-table-wrapper">

              <table className="admin-data-table">

                <thead>

                  <tr>
                    <th>
                      Image
                    </th>

                    <th>
                      City
                    </th>

                    <th>
                      State
                    </th>

                    <th>
                      Description
                    </th>

                    <th>
                      Actions
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {filteredCities.map(
                    (city) => (
                      <tr key={city._id}>

                        {/* IMAGE */}

                        <td>

                          <div className="admin-state-image">

                            {city.image ? (
                              <img
                                src={getImageUrl(
                                  city.image
                                )}
                                alt={city.name}
                              />
                            ) : (
                              <FaImage />
                            )}

                          </div>

                        </td>

                        {/* CITY */}

                        <td>
                          <strong>
                            {city.name}
                          </strong>
                        </td>

                        {/* STATE */}

                        <td>
                          {city.state?.name ||
                            "Not available"}
                        </td>

                        {/* DESCRIPTION */}

                        <td>

                          <p className="admin-description-cell">
                            {city.description}
                          </p>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="admin-table-actions">

                            <button
                              className="admin-edit-button"
                              type="button"
                              title="Edit city"
                              onClick={() =>
                                openEditForm(
                                  city
                                )
                              }
                            >
                              <FaEdit />
                            </button>

                            <button
                              className="admin-delete-button"
                              type="button"
                              title="Delete city"
                              onClick={() =>
                                handleDelete(
                                  city
                                )
                              }
                            >
                              <FaTrash />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </section>

      {/* ==================================================
          ADD / EDIT MODAL
      =================================================== */}

      {showForm && (
        <div className="admin-modal-backdrop">

          <section className="admin-form-modal">

            {/* MODAL HEADER */}

            <header className="admin-modal-header">

              <div>

                <span>
                  {editingCity
                    ? "Update City"
                    : "Create City"}
                </span>

                <h2>
                  {editingCity
                    ? "Edit City"
                    : "Add New City"}
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

            {/* ERROR */}

            {error && (
              <div className="admin-error-message">
                {error}
              </div>
            )}

            {/* FORM */}

            <form
              className="admin-state-form"
              onSubmit={handleSubmit}
            >

              <div className="admin-form-grid">

                {/* STATE */}

                <div className="admin-form-field">

                  <label htmlFor="city-state">
                    State
                  </label>

                  <select
                    id="city-state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={saving}
                    required
                  >
                    <option value="">
                      Select a state
                    </option>

                    {states.map(
                      (state) => (
                        <option
                          key={state._id}
                          value={state._id}
                        >
                          {state.name}
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* CITY NAME */}

                <div className="admin-form-field">

                  <label htmlFor="city-name">
                    City name
                  </label>

                  <input
                    id="city-name"
                    name="name"
                    type="text"
                    placeholder="Example: Kochi"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={saving}
                    required
                  />

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="admin-form-field">

                <label htmlFor="city-description">
                  Description
                </label>

                <textarea
                  id="city-description"
                  name="description"
                  rows="5"
                  placeholder="Write a short tourism description..."
                  value={formData.description}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />

              </div>

              {/* IMAGE */}

              <div className="admin-form-field">

                <label htmlFor="city-image">
                  City image
                </label>

                <input
                  id="city-image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleChange}
                  disabled={saving}
                />

                <small>
                  Upload a JPG, PNG or WEBP image.
                </small>

              </div>

              {/* IMAGE PREVIEW */}

              {imagePreview && (
                <div className="admin-image-preview">

                  <img
                    src={imagePreview}
                    alt="City preview"
                  />

                </div>
              )}

              {/* ACTIONS */}

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
                    : editingCity
                      ? "Update City"
                      : "Save City"}
                </button>

              </div>

            </form>

          </section>

        </div>
      )}

    </main>
  );
}

export default Cities;