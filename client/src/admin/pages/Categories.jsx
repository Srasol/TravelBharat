import { useEffect, useMemo, useState } from "react";

import {
  FaEdit,
  FaHiking,
  FaLandmark,
  FaMountain,
  FaPlaceOfWorship,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
  FaTree,
  FaUmbrellaBeach,
  FaWater,
  FaCity,
  FaCamera,
  FaLeaf,
  FaMonument,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../services/adminCategoryService";

import "../styles/admin.css";

/* =========================================================
   EMPTY FORM
========================================================= */

const emptyForm = {
  name: "",
  icon: "",
};

/* =========================================================
   AVAILABLE ICONS
========================================================= */

const iconOptions = [
  {
    name: "FaLandmark",
    label: "Heritage / Landmark",
    icon: <FaLandmark />,
  },
  {
    name: "FaTree",
    label: "Nature",
    icon: <FaTree />,
  },
  {
    name: "FaMountain",
    label: "Hill Station / Mountain",
    icon: <FaMountain />,
  },
  {
    name: "FaUmbrellaBeach",
    label: "Beach",
    icon: <FaUmbrellaBeach />,
  },
  {
    name: "FaPlaceOfWorship",
    label: "Religious",
    icon: <FaPlaceOfWorship />,
  },
  {
    name: "FaHiking",
    label: "Adventure",
    icon: <FaHiking />,
  },
  {
    name: "FaWater",
    label: "Waterfalls / Lakes",
    icon: <FaWater />,
  },
  {
    name: "FaCity",
    label: "City Tourism",
    icon: <FaCity />,
  },
  {
    name: "FaCamera",
    label: "Photography",
    icon: <FaCamera />,
  },
  {
    name: "FaLeaf",
    label: "Eco Tourism",
    icon: <FaLeaf />,
  },
  {
    name: "FaMonument",
    label: "Monument",
    icon: <FaMonument />,
  },
];

/* =========================================================
   ICON HELPER
========================================================= */

const getCategoryIcon = (iconName) => {
  const selectedIcon = iconOptions.find(
    (item) => item.name === iconName
  );

  return selectedIcon?.icon || <FaLandmark />;
};

/* =========================================================
   COMPONENT
========================================================= */

function Categories() {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState(emptyForm);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  /* ======================================================
     LOAD CATEGORIES
  ====================================================== */

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories();

      setCategories(
        data.categories || []
      );
    } catch (requestError) {
      console.error(
        "Load categories error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     FILTER CATEGORIES
  ====================================================== */

  const filteredCategories = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return categories;
    }

    return categories.filter((category) => {
      return (
        category.name
          ?.toLowerCase()
          .includes(keyword) ||
        category.icon
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [categories, search]);

  /* ======================================================
     HANDLE CHANGE
  ====================================================== */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

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
    setEditingCategory(null);

    setFormData(emptyForm);

    setMessage("");

    setError("");

    setShowForm(true);
  };

  /* ======================================================
     OPEN EDIT FORM
  ====================================================== */

  const openEditForm = (
    category
  ) => {
    setEditingCategory(category);

    setFormData({
      name:
        category.name || "",

      icon:
        category.icon || "",
    });

    setMessage("");

    setError("");

    setShowForm(true);
  };

  /* ======================================================
     CLOSE FORM
  ====================================================== */

  const closeForm = () => {
    setShowForm(false);

    setEditingCategory(null);

    setFormData(emptyForm);

    setError("");
  };

  /* ======================================================
     SAVE CATEGORY
  ====================================================== */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError(
        "Category name is required."
      );

      return;
    }

    const payload = {
      name:
        formData.name.trim(),

      icon:
        formData.icon.trim(),
    };

    try {
      setSaving(true);

      setMessage("");

      setError("");

      if (editingCategory) {
        const data =
          await updateCategory(
            editingCategory._id,
            payload
          );

        setMessage(
          data.message ||
            "Category updated successfully."
        );
      } else {
        const data =
          await createCategory(
            payload
          );

        setMessage(
          data.message ||
            "Category created successfully."
        );
      }

      await loadCategories();

      closeForm();
    } catch (requestError) {
      console.error(
        "Save category error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ======================================================
     DELETE CATEGORY
  ====================================================== */

  const handleDelete = async (
    category
  ) => {
    const confirmed =
      window.confirm(
        `Delete ${category.name}? This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");

      setError("");

      const data =
        await deleteCategory(
          category._id
        );

      setCategories(
        (previous) =>
          previous.filter(
            (item) =>
              item._id !==
              category._id
          )
      );

      setMessage(
        data.message ||
          "Category deleted successfully."
      );
    } catch (requestError) {
      console.error(
        "Delete category error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to delete category."
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
              Content Management
            </span>

            <h1>
              Categories
            </h1>

            <p>
              Organize TravelBharat destinations
              into tourism categories.
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

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="admin-success-message">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}

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
                placeholder="Search category or icon..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </div>

            <span className="admin-result-count">
              {filteredCategories.length}{" "}
              {filteredCategories.length === 1
                ? "category"
                : "categories"}
            </span>

          </div>

          {/* LOADING */}

          {loading ? (
            <div className="admin-empty-state">

              <div className="admin-spinner"></div>

              <p>
                Loading categories...
              </p>

            </div>
          ) : filteredCategories.length ===
            0 ? (
            <div className="admin-empty-state">

              <FaLandmark size={34} />

              <h3>
                No categories found
              </h3>

              <p>
                Add a category or change the search keyword.
              </p>

            </div>
          ) : (
            <div className="admin-table-wrapper">

              <table className="admin-data-table">

                <thead>

                  <tr>

                    <th>
                      Icon
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Icon Name
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredCategories.map(
                    (category) => (
                      <tr
                        key={
                          category._id
                        }
                      >

                        {/* ICON */}

                        <td>

                          <div className="admin-category-icon">
                            {getCategoryIcon(
                              category.icon
                            )}
                          </div>

                        </td>

                        {/* CATEGORY */}

                        <td>

                          <strong>
                            {category.name}
                          </strong>

                        </td>

                        {/* ICON NAME */}

                        <td>

                          <span className="admin-category-badge">
                            {category.icon ||
                              "Default Icon"}
                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="admin-table-actions">

                            <button
                              className="admin-edit-button"
                              type="button"
                              title="Edit category"
                              onClick={() =>
                                openEditForm(
                                  category
                                )
                              }
                            >
                              <FaEdit />
                            </button>

                            <button
                              className="admin-delete-button"
                              type="button"
                              title="Delete category"
                              onClick={() =>
                                handleDelete(
                                  category
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

            {/* HEADER */}

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

              {/* CATEGORY NAME */}

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
                  disabled={saving}
                  required
                />

              </div>

              {/* ICON */}

              <div className="admin-form-field">

                <label htmlFor="category-icon">
                  Category icon
                </label>

                <select
                  id="category-icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  disabled={saving}
                >

                  <option value="">
                    Select an icon
                  </option>

                  {iconOptions.map(
                    (item) => (
                      <option
                        key={item.name}
                        value={item.name}
                      >
                        {item.label} - {item.name}
                      </option>
                    )
                  )}

                </select>

                <small>
                  Choose the icon that best represents
                  this tourism category.
                </small>

              </div>

              {/* ICON PREVIEW */}

              <div
                style={{
                  padding: "18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  border: "1px solid #e5eaf0",
                  borderRadius: "12px",
                  background: "#f8fafc",
                }}
              >

                <div className="admin-category-icon">
                  {getCategoryIcon(
                    formData.icon
                  )}
                </div>

                <div>

                  <strong
                    style={{
                      display: "block",
                      color: "#20344f",
                      marginBottom: "3px",
                    }}
                  >
                    {formData.name ||
                      "Category Preview"}
                  </strong>

                  <span
                    style={{
                      color: "#8491a3",
                      fontSize: "0.65rem",
                    }}
                  >
                    {formData.icon ||
                      "Default: FaLandmark"}
                  </span>

                </div>

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