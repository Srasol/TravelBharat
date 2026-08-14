import { useEffect, useMemo, useState } from "react";
import {
  FaEnvelope,
  FaEye,
  FaSearch,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

import API from "../../services/api";
import Sidebar from "../components/Sidebar";

import "../styles/admin.css";

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/enquiries");

      setEnquiries(response.data.enquiries || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load enquiries."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredEnquiries = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return enquiries.filter((enquiry) => {
      const matchesSearch =
        !keyword ||
        enquiry.name?.toLowerCase().includes(keyword) ||
        enquiry.email?.toLowerCase().includes(keyword) ||
        enquiry.subject?.toLowerCase().includes(keyword);

      const matchesStatus =
        !statusFilter ||
        enquiry.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [enquiries, search, statusFilter]);

  const updateStatus = async (enquiry, newStatus) => {
    try {
      setUpdating(enquiry._id);
      setMessage("");
      setError("");

      const response = await API.put(
        `/enquiries/${enquiry._id}/status`,
        {
          status: newStatus,
        }
      );

      setEnquiries((previous) =>
        previous.map((item) =>
          item._id === enquiry._id
            ? {
                ...item,
                status: response.data.enquiry.status,
              }
            : item
        )
      );

      if (selectedEnquiry?._id === enquiry._id) {
        setSelectedEnquiry((previous) => ({
          ...previous,
          status: response.data.enquiry.status,
        }));
      }

      setMessage("Enquiry status updated successfully.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update enquiry status."
      );
    } finally {
      setUpdating("");
    }
  };

  const deleteEnquiry = async (enquiry) => {
    const confirmed = window.confirm(
      `Delete enquiry from ${enquiry.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await API.delete(
        `/enquiries/${enquiry._id}`
      );

      setEnquiries((previous) =>
        previous.filter(
          (item) => item._id !== enquiry._id
        )
      );

      if (selectedEnquiry?._id === enquiry._id) {
        setSelectedEnquiry(null);
      }

      setMessage(
        response.data.message ||
          "Enquiry deleted successfully."
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to delete enquiry."
      );
    }
  };

  const openEnquiry = async (enquiry) => {
    setSelectedEnquiry(enquiry);

    if (enquiry.status === "New") {
      await updateStatus(enquiry, "Read");
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="admin-management-page">
      <Sidebar />

      <section className="admin-management-content">
        <header className="admin-page-header">
          <div>
            <span>Visitor Communication</span>

            <h1>Enquiries</h1>

            <p>
              View and manage messages submitted through the
              TravelBharat contact page.
            </p>
          </div>
        </header>

        {message && (
          <div className="admin-success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-error-message">
            {error}
          </div>
        )}

        <section className="admin-table-panel">
          <div className="admin-enquiry-toolbar">
            <div className="admin-search-box">
              <FaSearch />

              <input
                type="search"
                placeholder="Search name, email or subject..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Read">Read</option>
              <option value="Resolved">
                Resolved
              </option>
            </select>

            <span className="admin-result-count">
              {filteredEnquiries.length} enquir
              {filteredEnquiries.length === 1
                ? "y"
                : "ies"}
            </span>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              <div className="admin-spinner"></div>
              <p>Loading enquiries...</p>
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="admin-empty-state">
              <FaEnvelope size={34} />
              <h3>No enquiries found</h3>
              <p>
                Messages submitted from the Contact page
                will appear here.
              </p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Visitor</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEnquiries.map((enquiry) => (
                    <tr key={enquiry._id}>
                      <td>
                        <strong>{enquiry.name}</strong>
                      </td>

                      <td>{enquiry.email}</td>

                      <td>
                        <p className="admin-description-cell">
                          {enquiry.subject}
                        </p>
                      </td>

                      <td>
                        {formatDate(enquiry.createdAt)}
                      </td>

                      <td>
                        <select
                          className={`admin-enquiry-status-select status-${enquiry.status?.toLowerCase()}`}
                          value={enquiry.status}
                          disabled={
                            updating === enquiry._id
                          }
                          onChange={(event) =>
                            updateStatus(
                              enquiry,
                              event.target.value
                            )
                          }
                        >
                          <option value="New">
                            New
                          </option>

                          <option value="Read">
                            Read
                          </option>

                          <option value="Resolved">
                            Resolved
                          </option>
                        </select>
                      </td>

                      <td>
                        <div className="admin-table-actions">
                          <button
                            className="admin-view-button"
                            type="button"
                            title="View enquiry"
                            onClick={() =>
                              openEnquiry(enquiry)
                            }
                          >
                            <FaEye />
                          </button>

                          <button
                            className="admin-delete-button"
                            type="button"
                            title="Delete enquiry"
                            onClick={() =>
                              deleteEnquiry(enquiry)
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

      {selectedEnquiry && (
        <div className="admin-modal-backdrop">
          <section className="admin-form-modal admin-enquiry-modal">
            <header className="admin-modal-header">
              <div>
                <span>Visitor Message</span>
                <h2>{selectedEnquiry.subject}</h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedEnquiry(null)
                }
                aria-label="Close enquiry"
              >
                <FaTimes />
              </button>
            </header>

            <div className="admin-enquiry-info-grid">
              <div>
                <span>Name</span>
                <strong>
                  {selectedEnquiry.name}
                </strong>
              </div>

              <div>
                <span>Email</span>
                <strong>
                  {selectedEnquiry.email}
                </strong>
              </div>

              <div>
                <span>Date</span>
                <strong>
                  {formatDate(
                    selectedEnquiry.createdAt
                  )}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {selectedEnquiry.status}
                </strong>
              </div>
            </div>

            <article className="admin-enquiry-message-box">
              <span>Message</span>

              <p>
                {selectedEnquiry.message}
              </p>
            </article>

            <div className="admin-form-actions">
              <button
                className="admin-secondary-button"
                type="button"
                onClick={() =>
                  setSelectedEnquiry(null)
                }
              >
                Close
              </button>

              {selectedEnquiry.status !==
                "Resolved" && (
                <button
                  className="admin-primary-button"
                  type="button"
                  disabled={
                    updating ===
                    selectedEnquiry._id
                  }
                  onClick={() =>
                    updateStatus(
                      selectedEnquiry,
                      "Resolved"
                    )
                  }
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Enquiries;