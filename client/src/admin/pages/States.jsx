import { useEffect, useMemo, useState } from "react";
import {
  FaEdit,
  FaImage,
  FaMap,
  FaMapMarkerAlt,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";

import {
  createState,
  deleteState,
  getStates,
  updateState,
} from "../../services/adminStateService";

import { getImageUrl } from "../../utils/imageUrl";

import "../styles/admin.css";

const emptyForm = {
  name: "",
  capital: "",
  description: "",
  image: null,
};

function States() {
  const [states, setStates] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingState, setEditingState] = useState(null);

  const [search, setSearch] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ======================================================
     LOAD STATES
  ====================================================== */

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStates();

      setStates(data.states || []);
    } catch (requestError) {
      console.error("States error:", requestError);

      setError(
        requestError.response?.data?.message ||
          "Unable to load states."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     SEARCH
  ====================================================== */

  const filteredStates = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return states;
    }

    return states.filter((state) => {
      return (
        state.name?.toLowerCase().includes(keyword) ||
        state.capital?.toLowerCase().includes(keyword) ||
        state.description?.toLowerCase().includes(keyword)
      );
    });
  }, [states, search]);

  /* ======================================================
     FORM CHANGE
  ====================================================== */

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "image") {
      const selectedFile = files?.[0] || null;

      setFormData((previous) => ({
        ...previous,
        image: selectedFile,
      }));

      if (selectedFile) {
        setImagePreview(
          URL.createObjectURL(selectedFile)
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
     ADD
  ====================================================== */

  const openAddForm = () => {
    setEditingState(null);
    setFormData(emptyForm);
    setImagePreview("");
    setMessage("");
    setError("");
    setShowForm(true);
  };

  /* ======================================================
     EDIT
  ====================================================== */

  const openEditForm = (state) => {
    setEditingState(state);

    setFormData({
      name: state.name || "",
      capital: state.capital || "",
      description: state.description || "",
      image: null,
    });

    setImagePreview(
      state.image
        ? getImageUrl(state.image)
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
    setEditingState(null);
    setFormData(emptyForm);
    setImagePreview("");
    setError("");
  };

  /* ======================================================
     SAVE
  ====================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.capital.trim() ||
      !formData.description.trim()
    ) {
      setError(
        "Name, capital and description are required."
      );

      return;
    }

    const payload = new FormData();

    payload.append(
      "name",
      formData.name.trim()
    );

    payload.append(
      "capital",
      formData.capital.trim()
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
      setError("");
      setMessage("");

      if (editingState) {
        const data = await updateState(
          editingState._id,
          payload
        );

        setMessage(
          data.message ||
            "State updated successfully."
        );
      } else {
        const data = await createState(
          payload
        );

        setMessage(
          data.message ||
            "State created successfully."
        );
      }

      await loadStates();

      closeForm();
    } catch (requestError) {
      console.error(
        "Save state error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to save state."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ======================================================
     DELETE
  ====================================================== */

  const handleDelete = async (state) => {
    const confirmed = window.confirm(
      `Delete ${state.name}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const data = await deleteState(
        state._id
      );

      setStates((previous) =>
        previous.filter(
          (item) =>
            item._id !== state._id
        )
      );

      setMessage(
        data.message ||
          "State deleted successfully."
      );
    } catch (requestError) {
      console.error(
        "Delete state error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to delete state."
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

        {/* ==========================================
            HEADER
        ========================================== */}

        <header className="admin-page-header">

          <div>

            <span>
              Destination Management
            </span>

            <h1>
              States
            </h1>

            <p>
              Manage Indian states, capitals,
              tourism descriptions and images.
            </p>

          </div>

          <button
            className="admin-primary-button"
            type="button"
            onClick={openAddForm}
          >
            <FaPlus />

            Add State
          </button>

        </header>

        {/* ==========================================
            SUMMARY
        ========================================== */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: "12px",
            marginBottom: "20px",
          }}
        >

          <div className="admin-dashboard-stat-card">

            <div className="admin-dashboard-stat-top">

              <span>
                TOTAL
              </span>

              <div className="admin-dashboard-stat-icon orange">
                <FaMap />
              </div>

            </div>

            <strong>
              {loading
                ? "..."
                : states.length}
            </strong>

            <h3>
              States
            </h3>

            <p>
              Total states managed
            </p>

          </div>

          <div className="admin-dashboard-stat-card">

            <div className="admin-dashboard-stat-top">

              <span>
                RESULTS
              </span>

              <div className="admin-dashboard-stat-icon blue">
                <FaSearch />
              </div>

            </div>

            <strong>
              {loading
                ? "..."
                : filteredStates.length}
            </strong>

            <h3>
              Search Results
            </h3>

            <p>
              Currently visible states
            </p>

          </div>

          <div className="admin-dashboard-stat-card">

            <div className="admin-dashboard-stat-top">

              <span>
                CONTENT
              </span>

              <div className="admin-dashboard-stat-icon green">
                <FaImage />
              </div>

            </div>

            <strong>
              {
                states.filter(
                  (state) =>
                    Boolean(state.image)
                ).length
              }
            </strong>

            <h3>
              With Images
            </h3>

            <p>
              States with tourism images
            </p>

          </div>

        </section>

        {/* ==========================================
            MESSAGES
        ========================================== */}

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

        {/* ==========================================
            TABLE
        ========================================== */}

        <section className="admin-table-panel">

          {/* TOOLBAR */}

          <div className="admin-table-toolbar">

            <div className="admin-search-box">

              <FaSearch />

              <input
                type="search"
                placeholder="Search state, capital or description..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >

              <span className="admin-result-count">
                {filteredStates.length}{" "}
                {filteredStates.length === 1
                  ? "state"
                  : "states"}
              </span>

              {search && (
                <button
                  className="admin-secondary-button"
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
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
                Loading states...
              </p>

            </div>
          ) : filteredStates.length === 0 ? (
            <div className="admin-empty-state">

              <FaImage size={34} />

              <h3>
                No states found
              </h3>

              <p>
                Add a state or change
                your search keyword.
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
                      State
                    </th>

                    <th>
                      Capital
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

                  {filteredStates.map(
                    (state) => (
                      <tr key={state._id}>

                        {/* IMAGE */}

                        <td>

                          <div className="admin-state-image">

                            {state.image ? (
                              <img
                                src={getImageUrl(
                                  state.image
                                )}
                                alt={
                                  state.name
                                }
                              />
                            ) : (
                              <FaImage />
                            )}

                          </div>

                        </td>

                        {/* STATE */}

                        <td>

                          <div
                            style={{
                              minWidth:
                                "150px",
                            }}
                          >

                            <strong>
                              {state.name}
                            </strong>

                            <div
                              style={{
                                marginTop:
                                  "4px",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: "5px",
                                color:
                                  "#94a3b8",
                                fontSize:
                                  "0.55rem",
                              }}
                            >
                              <FaMapMarkerAlt
                                style={{
                                  color:
                                    "#f47d22",
                                }}
                              />

                              Indian State
                            </div>

                          </div>

                        </td>

                        {/* CAPITAL */}

                        <td>

                          <span className="admin-category-badge">
                            {state.capital}
                          </span>

                        </td>

                        {/* DESCRIPTION */}

                        <td>

                          <p className="admin-description-cell">
                            {state.description}
                          </p>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="admin-table-actions">

                            <button
                              className="admin-edit-button"
                              type="button"
                              title="Edit state"
                              onClick={() =>
                                openEditForm(
                                  state
                                )
                              }
                            >
                              <FaEdit />
                            </button>

                            <button
                              className="admin-delete-button"
                              type="button"
                              title="Delete state"
                              onClick={() =>
                                handleDelete(
                                  state
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
          ADD / EDIT STATE MODAL
      =================================================== */}

      {showForm && (
        <div className="admin-modal-backdrop">

          <section className="admin-form-modal">

            {/* HEADER */}

            <header className="admin-modal-header">

              <div>

                <span>
                  {editingState
                    ? "Update State"
                    : "Create State"}
                </span>

                <h2>
                  {editingState
                    ? "Edit State"
                    : "Add New State"}
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

              {/* BASIC DETAILS */}

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
                      marginBottom:
                        "3px",
                      color:
                        "#f47d22",
                      fontSize:
                        "0.55rem",
                      fontWeight:
                        850,
                      letterSpacing:
                        "1px",
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
                    State details
                  </strong>
                </div>

                <div className="admin-form-grid">

                  <div className="admin-form-field">

                    <label htmlFor="state-name">
                      State name
                    </label>

                    <input
                      id="state-name"
                      name="name"
                      type="text"
                      placeholder="Example: Kerala"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={saving}
                      required
                    />

                  </div>

                  <div className="admin-form-field">

                    <label htmlFor="state-capital">
                      Capital
                    </label>

                    <input
                      id="state-capital"
                      name="capital"
                      type="text"
                      placeholder="Example: Thiruvananthapuram"
                      value={
                        formData.capital
                      }
                      onChange={
                        handleChange
                      }
                      disabled={saving}
                      required
                    />

                  </div>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="admin-form-field">

                <label htmlFor="state-description">
                  Tourism Description
                </label>

                <textarea
                  id="state-description"
                  name="description"
                  rows="5"
                  placeholder="Write a short tourism description about the state..."
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  disabled={saving}
                  required
                />

              </div>

              {/* IMAGE */}

              <div
                style={{
                  paddingTop:
                    "4px",
                }}
              >

                <div
                  style={{
                    marginBottom:
                      "12px",
                  }}
                >
                  <span
                    style={{
                      display:
                        "block",
                      marginBottom:
                        "3px",
                      color:
                        "#f47d22",
                      fontSize:
                        "0.55rem",
                      fontWeight:
                        850,
                      letterSpacing:
                        "1px",
                    }}
                  >
                    TOURISM IMAGE
                  </span>

                  <strong
                    style={{
                      color:
                        "#10233f",
                      fontSize:
                        "0.9rem",
                    }}
                  >
                    Representative state image
                  </strong>
                </div>

                <div className="admin-form-field">

                  <label htmlFor="state-image">
                    State image
                  </label>

                  <input
                    id="state-image"
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

              </div>

              {/* IMAGE PREVIEW */}

              {imagePreview && (
                <div className="admin-image-preview">

                  <img
                    src={imagePreview}
                    alt="State preview"
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
                    : editingState
                      ? "Update State"
                      : "Save State"}
                </button>

              </div>

            </form>

          </section>

        </div>
      )}

    </main>
  );
}

export default States;