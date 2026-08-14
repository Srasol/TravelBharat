import { useEffect, useMemo, useState } from "react";
import {
  FaEdit,
  FaImage,
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
      setError(
        requestError.response?.data?.message ||
          "Unable to load states."
      );
    } finally {
      setLoading(false);
    }
  };

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

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "image") {
      const selectedFile = files?.[0] || null;

      setFormData((previous) => ({
        ...previous,
        image: selectedFile,
      }));

      if (selectedFile) {
        setImagePreview(URL.createObjectURL(selectedFile));
      }

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const openAddForm = () => {
    setEditingState(null);
    setFormData(emptyForm);
    setImagePreview("");
    setMessage("");
    setError("");
    setShowForm(true);
  };

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
        ? `http://localhost:5000/${state.image}`
        : ""
    );

    setMessage("");
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingState(null);
    setFormData(emptyForm);
    setImagePreview("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.capital.trim() ||
      !formData.description.trim()
    ) {
      setError("Name, capital and description are required.");
      return;
    }

    const payload = new FormData();

    payload.append("name", formData.name.trim());
    payload.append("capital", formData.capital.trim());
    payload.append(
      "description",
      formData.description.trim()
    );

    if (formData.image) {
      payload.append("image", formData.image);
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
          data.message || "State updated successfully."
        );
      } else {
        const data = await createState(payload);

        setMessage(
          data.message || "State created successfully."
        );
      }

      await loadStates();
      closeForm();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to save state."
      );
    } finally {
      setSaving(false);
    }
  };

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

      const data = await deleteState(state._id);

      setStates((previous) =>
        previous.filter((item) => item._id !== state._id)
      );

      setMessage(
        data.message || "State deleted successfully."
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to delete state."
      );
    }
  };

  return (
    <main className="admin-management-page">
      <Sidebar />

      <section className="admin-management-content">
        <header className="admin-page-header">
          <div>
            <span>Destination Management</span>
            <h1>States</h1>
            <p>
              Add and maintain state-wise tourism information.
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
          <div className="admin-table-toolbar">
            <div className="admin-search-box">
              <FaSearch />

              <input
                type="search"
                placeholder="Search state, capital or description..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <span className="admin-result-count">
              {filteredStates.length} state
              {filteredStates.length === 1 ? "" : "s"}
            </span>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              <div className="admin-spinner"></div>
              <p>Loading states...</p>
            </div>
          ) : filteredStates.length === 0 ? (
            <div className="admin-empty-state">
              <FaImage size={34} />
              <h3>No states found</h3>
              <p>Add a state or change the search keyword.</p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>State</th>
                    <th>Capital</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStates.map((state) => (
                    <tr key={state._id}>
                      <td>
                        <div className="admin-state-image">
                          {state.image ? (
                            <img
                              src={`http://localhost:5000/${state.image}`}
                              alt={state.name}
                            />
                          ) : (
                            <FaImage />
                          )}
                        </div>
                      </td>

                      <td>
                        <strong>{state.name}</strong>
                      </td>

                      <td>{state.capital}</td>

                      <td>
                        <p className="admin-description-cell">
                          {state.description}
                        </p>
                      </td>

                      <td>
                        <div className="admin-table-actions">
                          <button
                            className="admin-edit-button"
                            type="button"
                            title="Edit state"
                            onClick={() => openEditForm(state)}
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="admin-delete-button"
                            type="button"
                            title="Delete state"
                            onClick={() => handleDelete(state)}
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
          <section className="admin-form-modal">
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
                    value={formData.capital}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-field">
                <label htmlFor="state-description">
                  Description
                </label>

                <textarea
                  id="state-description"
                  name="description"
                  rows="5"
                  placeholder="Write a short tourism description..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
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
                />

                <small>
                  Upload a JPG, PNG or WEBP image.
                </small>
              </div>

              {imagePreview && (
                <div className="admin-image-preview">
                  <img
                    src={imagePreview}
                    alt="State preview"
                  />
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