import { useEffect, useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaEdit,
  FaImage,
  FaMapMarkerAlt,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

import { getImageUrl } from "../../utils/imageUrl";
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

  /* ======================================================
     LOAD DATA
  ====================================================== */

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
      console.error(
        "Tourist places load error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to load tourist places."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     AVAILABLE CITIES
  ====================================================== */

  const availableCities = useMemo(() => {
    if (!formData.state) {
      return cities;
    }

    return cities.filter(
      (city) =>
        city.state?._id ===
        formData.state
    );
  }, [cities, formData.state]);

  /* ======================================================
     FILTERED PLACES
  ====================================================== */

  const filteredPlaces = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    return places.filter((place) => {
      const matchesSearch =
        !keyword ||
        place.name
          ?.toLowerCase()
          .includes(keyword) ||
        place.state?.name
          ?.toLowerCase()
          .includes(keyword) ||
        place.city?.name
          ?.toLowerCase()
          .includes(keyword) ||
        place.category?.name
          ?.toLowerCase()
          .includes(keyword);

      const matchesState =
        !stateFilter ||
        place.state?._id ===
          stateFilter;

      const matchesCategory =
        !categoryFilter ||
        place.category?._id ===
          categoryFilter;

      return (
        matchesSearch &&
        matchesState &&
        matchesCategory
      );
    });
  }, [
    places,
    search,
    stateFilter,
    categoryFilter,
  ]);

  /* ======================================================
     FORM CHANGE
  ====================================================== */

  const handleChange = (event) => {
    const {
      name,
      value,
      files,
    } = event.target;

    if (name === "images") {
      const selectedFiles =
        Array.from(
          files || []
        ).slice(0, 10);

      setFormData(
        (previousData) => ({
          ...previousData,
          images: selectedFiles,
        })
      );

      const previews =
        selectedFiles.map(
          (file) =>
            URL.createObjectURL(
              file
            )
        );

      setImagePreviews(previews);

      setError("");

      return;
    }

    if (name === "state") {
      setFormData(
        (previousData) => ({
          ...previousData,
          state: value,
          city: "",
        })
      );

      setError("");

      return;
    }

    setFormData(
      (previousData) => ({
        ...previousData,
        [name]: value,
      })
    );

    setError("");
  };

  /* ======================================================
     OPEN ADD FORM
  ====================================================== */

  const openAddForm = () => {
    setEditingPlace(null);

    setFormData(emptyForm);

    setImagePreviews([]);

    setMessage("");

    setError("");

    setShowForm(true);
  };

  /* ======================================================
     OPEN EDIT FORM
  ====================================================== */

  const openEditForm = (place) => {
    setEditingPlace(place);

    setFormData({
      name:
        place.name || "",

      state:
        place.state?._id || "",

      city:
        place.city?._id || "",

      category:
        place.category?._id || "",

      description:
        place.description || "",

      history:
        place.history || "",

      bestTime:
        place.bestTime || "",

      entryFee:
        place.entryFee || "",

      timings:
        place.timings || "",

      googleMap:
        place.googleMap || "",

      nearbyAttractions:
        place.nearbyAttractions?.join(
          ", "
        ) || "",

      images: [],
    });

    setImagePreviews(
      place.images?.map(
        (image) =>
          getImageUrl(image)
      ) || []
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

    setEditingPlace(null);

    setFormData(emptyForm);

    setImagePreviews([]);

    setError("");
  };

  /* ======================================================
     SAVE PLACE
  ====================================================== */

  const handleSubmit = async (
    event
  ) => {
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

    const payload =
      new FormData();

    payload.append(
      "name",
      formData.name.trim()
    );

    payload.append(
      "state",
      formData.state
    );

    payload.append(
      "city",
      formData.city
    );

    payload.append(
      "category",
      formData.category
    );

    payload.append(
      "description",
      formData.description.trim()
    );

    payload.append(
      "history",
      formData.history.trim()
    );

    payload.append(
      "bestTime",
      formData.bestTime.trim()
    );

    payload.append(
      "entryFee",
      formData.entryFee.trim()
    );

    payload.append(
      "timings",
      formData.timings.trim()
    );

    payload.append(
      "googleMap",
      formData.googleMap.trim()
    );

    payload.append(
      "nearbyAttractions",
      formData.nearbyAttractions.trim()
    );

    formData.images.forEach(
      (image) => {
        payload.append(
          "images",
          image
        );
      }
    );

    try {
      setSaving(true);

      setError("");

      setMessage("");

      if (editingPlace) {
        const data =
          await updatePlace(
            editingPlace._id,
            payload
          );

        setMessage(
          data.message ||
            "Tourist place updated successfully."
        );
      } else {
        const data =
          await createPlace(
            payload
          );

        setMessage(
          data.message ||
            "Tourist place created successfully."
        );
      }

      await loadInitialData();

      closeForm();
    } catch (requestError) {
      console.error(
        "Save tourist place error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to save tourist place."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ======================================================
     DELETE PLACE
  ====================================================== */

  const handleDelete = async (
    place
  ) => {
    const confirmed =
      window.confirm(
        `Delete ${place.name}? This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      setMessage("");

      const data =
        await deletePlace(
          place._id
        );

      setMessage(
        data.message ||
          "Tourist place deleted successfully."
      );

      setPlaces(
        (previousPlaces) =>
          previousPlaces.filter(
            (item) =>
              item._id !==
              place._id
          )
      );
    } catch (requestError) {
      console.error(
        "Delete tourist place error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to delete tourist place."
      );
    }
  };

  /* ======================================================
     CLEAR FILTERS
  ====================================================== */

  const clearFilters = () => {
    setSearch("");
    setStateFilter("");
    setCategoryFilter("");
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
              Content Management
            </span>

            <h1>
              Tourist Places
            </h1>

            <p>
              Add, update and manage TravelBharat tourism destinations.
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

          {/* FILTERS */}

          <div className="admin-place-toolbar">

            <div className="admin-search-box">

              <FaSearch />

              <input
                type="search"
                placeholder="Search place, city, state or category..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </div>

            <select
              value={stateFilter}
              onChange={(event) =>
                setStateFilter(
                  event.target.value
                )
              }
            >
              <option value="">
                All States
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

            <select
              value={
                categoryFilter
              }
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
            >
              <option value="">
                All Categories
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={
                      category._id
                    }
                    value={
                      category._id
                    }
                  >
                    {category.name}
                  </option>
                )
              )}

            </select>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifyContent:
                  "flex-end",
              }}
            >

              <span className="admin-result-count">
                {filteredPlaces.length}{" "}
                {filteredPlaces.length ===
                1
                  ? "place"
                  : "places"}
              </span>

              {(search ||
                stateFilter ||
                categoryFilter) && (
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={clearFilters}
                >
                  Clear
                </button>
              )}

            </div>

          </div>

          {/* LOADING */}

          {loading ? (
            <div className="admin-empty-state">

              <div className="admin-spinner"></div>

              <p>
                Loading tourist places...
              </p>

            </div>
          ) : filteredPlaces.length ===
            0 ? (
            <div className="admin-empty-state">

              <FaMapMarkerAlt size={36} />

              <h3>
                No tourist places found
              </h3>

              <p>
                Add a destination or change your filters.
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
                      Place
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Best Time
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredPlaces.map(
                    (place) => (
                      <tr
                        key={
                          place._id
                        }
                      >

                        {/* IMAGE */}

                        <td>

                          <div className="admin-state-image">

                            {place.images?.length >
                            0 ? (
                              <img
                                src={getImageUrl(
                                  place.images[0]
                                )}
                                alt={
                                  place.name
                                }
                              />
                            ) : (
                              <FaImage />
                            )}

                          </div>

                        </td>

                        {/* PLACE */}

                        <td>

                          <div
                            style={{
                              minWidth:
                                "150px",
                            }}
                          >

                            <strong>
                              {place.name}
                            </strong>

                            <div
                              style={{
                                marginTop:
                                  "4px",
                                color:
                                  "#94a3b8",
                                fontSize:
                                  "0.58rem",
                              }}
                            >
                              Destination
                            </div>

                          </div>

                        </td>

                        {/* LOCATION */}

                        <td>

                          <div
                            style={{
                              minWidth:
                                "160px",
                            }}
                          >

                            <div
                              style={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: "5px",
                                color:
                                  "#405168",
                                fontWeight:
                                  700,
                              }}
                            >
                              <FaMapMarkerAlt
                                style={{
                                  color:
                                    "#f47d22",
                                }}
                              />

                              {place.city
                                ?.name ||
                                "Unknown city"}
                            </div>

                            <div
                              style={{
                                marginTop:
                                  "4px",
                                color:
                                  "#94a3b8",
                                fontSize:
                                  "0.58rem",
                              }}
                            >
                              {place.state
                                ?.name ||
                                "Unknown state"}
                            </div>

                          </div>

                        </td>

                        {/* CATEGORY */}

                        <td>

                          <span className="admin-category-badge">
                            {place.category
                              ?.name ||
                              "Not available"}
                          </span>

                        </td>

                        {/* BEST TIME */}

                        <td>

                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "6px",
                              minWidth:
                                "130px",
                            }}
                          >

                            <FaCalendarAlt
                              style={{
                                color:
                                  "#f47d22",
                              }}
                            />

                            <span>
                              {place.bestTime ||
                                "Not available"}
                            </span>

                          </div>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="admin-table-actions">

                            <button
                              className="admin-edit-button"
                              type="button"
                              title="Edit place"
                              onClick={() =>
                                openEditForm(
                                  place
                                )
                              }
                            >
                              <FaEdit />
                            </button>

                            <button
                              className="admin-delete-button"
                              type="button"
                              title="Delete place"
                              onClick={() =>
                                handleDelete(
                                  place
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
          ADD / EDIT PLACE MODAL
      =================================================== */}

      {showForm && (
        <div className="admin-modal-backdrop">

          <section className="admin-form-modal admin-place-modal">

            {/* HEADER */}

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

              {/* SECTION 1 */}

              <div
                style={{
                  paddingBottom:
                    "16px",
                  borderBottom:
                    "1px solid #edf1f5",
                }}
              >

                <div
                  style={{
                    marginBottom:
                      "14px",
                  }}
                >

                  <span
                    style={{
                      display:
                        "block",
                      color:
                        "#f47d22",
                      fontSize:
                        "0.56rem",
                      fontWeight:
                        850,
                      letterSpacing:
                        "1px",
                      marginBottom:
                        "3px",
                    }}
                  >
                    BASIC INFORMATION
                  </span>

                  <strong
                    style={{
                      color:
                        "#10233f",
                      fontSize:
                        "0.9rem",
                    }}
                  >
                    Destination details
                  </strong>

                </div>

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
                      disabled={saving}
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
                      value={
                        formData.category
                      }
                      onChange={handleChange}
                      disabled={saving}
                      required
                    >

                      <option value="">
                        Select category
                      </option>

                      {categories.map(
                        (category) => (
                          <option
                            key={
                              category._id
                            }
                            value={
                              category._id
                            }
                          >
                            {category.name}
                          </option>
                        )
                      )}

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
                      value={
                        formData.state
                      }
                      onChange={handleChange}
                      disabled={saving}
                      required
                    >

                      <option value="">
                        Select state
                      </option>

                      {states.map(
                        (state) => (
                          <option
                            key={
                              state._id
                            }
                            value={
                              state._id
                            }
                          >
                            {state.name}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <div className="admin-form-field">

                    <label htmlFor="place-city">
                      City
                    </label>

                    <select
                      id="place-city"
                      name="city"
                      value={
                        formData.city
                      }
                      onChange={handleChange}
                      disabled={
                        saving ||
                        !formData.state
                      }
                      required
                    >

                      <option value="">
                        {formData.state
                          ? "Select city"
                          : "Select state first"}
                      </option>

                      {availableCities.map(
                        (city) => (
                          <option
                            key={
                              city._id
                            }
                            value={
                              city._id
                            }
                          >
                            {city.name}
                          </option>
                        )
                      )}

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
                    value={
                      formData.description
                    }
                    onChange={handleChange}
                    disabled={saving}
                    required
                  />

                </div>

              </div>

              {/* SECTION 2 */}

              <div
                style={{
                  paddingBottom:
                    "16px",
                  borderBottom:
                    "1px solid #edf1f5",
                }}
              >

                <div
                  style={{
                    marginBottom:
                      "14px",
                  }}
                >

                  <span
                    style={{
                      display:
                        "block",
                      color:
                        "#f47d22",
                      fontSize:
                        "0.56rem",
                      fontWeight:
                        850,
                      letterSpacing:
                        "1px",
                      marginBottom:
                        "3px",
                    }}
                  >
                    TRAVEL INFORMATION
                  </span>

                  <strong
                    style={{
                      color:
                        "#10233f",
                      fontSize:
                        "0.9rem",
                    }}
                  >
                    Visitor details
                  </strong>

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
                      value={
                        formData.bestTime
                      }
                      onChange={handleChange}
                      disabled={saving}
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
                      value={
                        formData.entryFee
                      }
                      onChange={handleChange}
                      disabled={saving}
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
                      value={
                        formData.timings
                      }
                      onChange={handleChange}
                      disabled={saving}
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
                      value={
                        formData.googleMap
                      }
                      onChange={handleChange}
                      disabled={saving}
                    />

                  </div>

                </div>

              </div>

              {/* SECTION 3 */}

              <div
                style={{
                  paddingBottom:
                    "16px",
                  borderBottom:
                    "1px solid #edf1f5",
                }}
              >

                <div
                  style={{
                    marginBottom:
                      "14px",
                  }}
                >

                  <span
                    style={{
                      display:
                        "block",
                      color:
                        "#f47d22",
                      fontSize:
                        "0.56rem",
                      fontWeight:
                        850,
                      letterSpacing:
                        "1px",
                      marginBottom:
                        "3px",
                    }}
                  >
                    DESTINATION STORY
                  </span>

                  <strong
                    style={{
                      color:
                        "#10233f",
                      fontSize:
                        "0.9rem",
                    }}
                  >
                    History and nearby attractions
                  </strong>

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
                    value={
                      formData.history
                    }
                    onChange={handleChange}
                    disabled={saving}
                  />

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
                    value={
                      formData.nearbyAttractions
                    }
                    onChange={handleChange}
                    disabled={saving}
                  />

                  <small>
                    Separate each attraction using a comma.
                  </small>

                </div>

              </div>

              {/* SECTION 4 IMAGES */}

              <div>

                <div
                  style={{
                    marginBottom:
                      "14px",
                  }}
                >

                  <span
                    style={{
                      display:
                        "block",
                      color:
                        "#f47d22",
                      fontSize:
                        "0.56rem",
                      fontWeight:
                        850,
                      letterSpacing:
                        "1px",
                      marginBottom:
                        "3px",
                    }}
                  >
                    DESTINATION GALLERY
                  </span>

                  <strong
                    style={{
                      color:
                        "#10233f",
                      fontSize:
                        "0.9rem",
                    }}
                  >
                    Tourist place images
                  </strong>

                </div>

                <div className="admin-form-field">

                  <label htmlFor="place-images">
                    Upload images
                  </label>

                  <input
                    id="place-images"
                    name="images"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleChange}
                    disabled={saving}
                  />

                  <small>
                    Upload up to 10 JPG, PNG or WEBP images.
                  </small>

                </div>

                {imagePreviews.length >
                  0 && (
                  <div className="admin-place-preview-grid">

                    {imagePreviews.map(
                      (
                        preview,
                        index
                      ) => (
                        <img
                          key={`${preview}-${index}`}
                          src={
                            preview
                          }
                          alt={`Preview ${
                            index + 1
                          }`}
                        />
                      )
                    )}

                  </div>
                )}

              </div>

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