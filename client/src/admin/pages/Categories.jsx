import { useEffect, useMemo, useState } from "react";
import {
  FaEdit,
  FaLandmark,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../services/adminCategoryService";

import "../styles/admin.css";

const emptyForm = {
  name: "",
  icon: "",
};

function Categories() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingCategory, setEditingCategory] = useState(null);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories();
      setCategories(data.categories || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return categories;
    }

    return categories.filter((category) => {
      return (
        category.name?.toLowerCase().includes(keyword) ||
        category.icon?.toLowerCase().includes(keyword)
      );
    });
  }, [categories, search]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const openAddForm = () => {
    setEditingCategory(null);
    setFormData(emptyForm);
    setMessage("");
    setError("");
    setShowForm(true);
  };

  const openEditForm = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name || "",
      icon: category.icon || "",
    });

    setMessage("");
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData(emptyForm);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Category name is required.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      icon: formData.icon.trim(),
    };

    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (editingCategory) {
        const data = await updateCategory(
          editingCategory._id,
          payload
        );

        setMessage(
          data.message || "Category updated successfully."
        );
      } else {
        const data = await createCategory(payload);

        setMessage(
          data.message || "Category created successfully."
        );
      }

      await loadCategories();
      closeForm();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Delete ${category.name}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const data = await deleteCategory(category._id);

      setCategories((previous) =>
        previous.filter(
          (item) => item._id !== category._id
        )
      );

      setMessage(
        data.message || "Category deleted successfully."
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to delete category."
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
            <h1>Categories</h1>
            <p>
              Organize destinations into tourism categories.
            </p>
          </div>

          <button
            className="admin-primary-button"
            type="button"
            onClick={openAddForm}
          >
            <FaPlus />
            Add Category
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
                placeholder="Search category or icon..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <span className="admin-result-count">
              {filteredCategories.length} categor
              {filteredCategories.length === 1
                ? "y"
                : "ies"}
            </span>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              <div className="admin-spinner"></div>
              <p>Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="admin-empty-state">
              <FaLandmark size={34} />
              <h3>No categories found</h3>
              <p>
                Add a category or change the search keyword.
              </p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Icon</th>
                    <th>Category</th>
                    <th>Icon Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category._id}>
                      <td>
                        <div className="admin-category-icon">
                          <FaLandmark />
                        </div>
                      </td>

                      <td>
                        <strong>{category.name}</strong>
                      </td>

                      <td>
                        {category.icon || "Not available"}
                      </td>

                      <td>
                        <div className="admin-table-actions">
                          <button
                            className="admin-edit-button"
                            type="button"
                            title="Edit category"
                            onClick={() =>
                              openEditForm(category)
                            }
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="admin-delete-button"
                            type="button"
                            title="Delete category"
                            onClick={() =>
                              handleDelete(category)
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
          <section className="admin-form-modal">
            <header className="admin-modal-header">
              <div>
                <span>
                  {editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </span>

                <h2>
                  {editingCategory
                    ? "Edit Category"
                    : "Add New Category"}
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
              <div className="admin-form-field">
                <label htmlFor="category-name">
                  Category name
                </label>

                <input
                  id="category-name"
                  name="name"
                  type="text"
                  placeholder="Example: Heritage"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="category-icon">
                  Icon name
                </label>

                <input
                  id="category-icon"
                  name="icon"
                  type="text"
                  placeholder="Example: FaLandmark"
                  value={formData.icon}
                  onChange={handleChange}
                />

                <small>
                  Examples: FaLandmark, FaTree, FaMountain,
                  FaUmbrellaBeach
                </small>
              </div>

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
                    : editingCategory
                      ? "Update Category"
                      : "Save Category"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default Categories;