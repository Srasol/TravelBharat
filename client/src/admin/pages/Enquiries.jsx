import { useEffect, useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaEnvelope,
  FaEye,
  FaSearch,
  FaTimes,
  FaTrash,
  FaUser,
} from "react-icons/fa";

import API from "../../services/api";
import Sidebar from "../components/Sidebar";

import "../styles/admin.css";

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] =
    useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* ======================================================
     LOAD ENQUIRIES
  ====================================================== */

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await API.get("/enquiries");

      setEnquiries(
        response.data.enquiries || []
      );
    } catch (requestError) {
      console.error(
        "Load enquiries error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to load enquiries."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     FILTER ENQUIRIES
  ====================================================== */

  const filteredEnquiries =
    useMemo(() => {
      const keyword = search
        .trim()
        .toLowerCase();

      return enquiries.filter(
        (enquiry) => {
          const matchesSearch =
            !keyword ||
            enquiry.name
              ?.toLowerCase()
              .includes(keyword) ||
            enquiry.email
              ?.toLowerCase()
              .includes(keyword) ||
            enquiry.subject
              ?.toLowerCase()
              .includes(keyword);

          const matchesStatus =
            !statusFilter ||
            enquiry.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      enquiries,
      search,
      statusFilter,
    ]);

  /* ======================================================
     COUNTS
  ====================================================== */

  const newCount = useMemo(() => {
    return enquiries.filter(
      (item) => item.status === "New"
    ).length;
  }, [enquiries]);

  const readCount = useMemo(() => {
    return enquiries.filter(
      (item) => item.status === "Read"
    ).length;
  }, [enquiries]);

  const resolvedCount = useMemo(() => {
    return enquiries.filter(
      (item) =>
        item.status === "Resolved"
    ).length;
  }, [enquiries]);

  /* ======================================================
     UPDATE STATUS
  ====================================================== */

  const updateStatus = async (
    enquiry,
    newStatus
  ) => {
    try {
      setUpdating(enquiry._id);

      setMessage("");
      setError("");

      const response =
        await API.put(
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
                status:
                  response.data
                    .enquiry.status,
              }
            : item
        )
      );

      if (
        selectedEnquiry?._id ===
        enquiry._id
      ) {
        setSelectedEnquiry(
          (previous) => ({
            ...previous,
            status:
              response.data
                .enquiry.status,
          })
        );
      }

      setMessage(
        "Enquiry status updated successfully."
      );
    } catch (requestError) {
      console.error(
        "Update enquiry error:",
        requestError
      );

      setError(
        requestError.response?.data
          ?.message ||
          "Unable to update enquiry status."
      );
    } finally {
      setUpdating("");
    }
  };

  /* ======================================================
     DELETE
  ====================================================== */

  const deleteEnquiry = async (
    enquiry
  ) => {
    const confirmed =
      window.confirm(
        `Delete enquiry from ${enquiry.name}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response =
        await API.delete(
          `/enquiries/${enquiry._id}`
        );

      setEnquiries((previous) =>
        previous.filter(
          (item) =>
            item._id !==
            enquiry._id
        )
      );

      if (
        selectedEnquiry?._id ===
        enquiry._id
      ) {
        setSelectedEnquiry(null);
      }

      setMessage(
        response.data.message ||
          "Enquiry deleted successfully."
      );
    } catch (requestError) {
      console.error(
        "Delete enquiry error:",
        requestError
      );

      setError(
        requestError.response?.data
          ?.message ||
          "Unable to delete enquiry."
      );
    }
  };

  /* ======================================================
     OPEN ENQUIRY
  ====================================================== */

  const openEnquiry = async (
    enquiry
  ) => {
    setSelectedEnquiry(enquiry);

    if (enquiry.status === "New") {
      await updateStatus(
        enquiry,
        "Read"
      );
    }
  };

  /* ======================================================
     DATE
  ====================================================== */

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* ======================================================
     CLEAR FILTERS
  ====================================================== */

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
  };

  return (
    <main className="admin-management-page">

      <Sidebar />

      <section className="admin-management-content">

        {/* HEADER */}

        <header className="admin-page-header">

          <div>

            <span>
              Visitor Communication
            </span>

            <h1>
              Enquiries
            </h1>

            <p>
              View and manage messages
              submitted through the
              TravelBharat contact page.
            </p>

          </div>

        </header>

        {/* SUMMARY */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",
            gap: "12px",
            marginBottom: "20px",
          }}
        >

          <div className="admin-dashboard-stat-card">
            <div className="admin-dashboard-stat-top">
              <span>
                TOTAL
              </span>

              <div className="admin-dashboard-stat-icon blue">
                <FaEnvelope />
              </div>
            </div>

            <strong>
              {enquiries.length}
            </strong>

            <h3>
              All Enquiries
            </h3>

            <p>
              Total visitor messages
            </p>
          </div>

          <div className="admin-dashboard-stat-card">
            <div className="admin-dashboard-stat-top">
              <span>
                NEW
              </span>

              <div className="admin-dashboard-stat-icon orange">
                <FaEnvelope />
              </div>
            </div>

            <strong>
              {newCount}
            </strong>

            <h3>
              New
            </h3>

            <p>
              Waiting to be reviewed
            </p>
          </div>

          <div className="admin-dashboard-stat-card">
            <div className="admin-dashboard-stat-top">
              <span>
                READ
              </span>

              <div className="admin-dashboard-stat-icon purple">
                <FaEye />
              </div>
            </div>

            <strong>
              {readCount}
            </strong>

            <h3>
              Read
            </h3>

            <p>
              Already opened
            </p>
          </div>

          <div className="admin-dashboard-stat-card">
            <div className="admin-dashboard-stat-top">
              <span>
                DONE
              </span>

              <div className="admin-dashboard-stat-icon green">
                <FaCheckCircle />
              </div>
            </div>

            <strong>
              {resolvedCount}
            </strong>

            <h3>
              Resolved
            </h3>

            <p>
              Completed enquiries
            </p>
          </div>

        </section>

        {/* SUCCESS */}

        {message && (
          <div className="admin-success-message">
            {message}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="admin-error-message">
            {error}
          </div>
        )}

        {/* TABLE */}

        <section className="admin-table-panel">

          <div className="admin-enquiry-toolbar">

            <div className="admin-search-box">

              <FaSearch />

              <input
                type="search"
                placeholder="Search name, email or subject..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >
              <option value="">
                All Statuses
              </option>

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

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "flex-end",
                gap: "8px",
              }}
            >
              <span className="admin-result-count">
                {filteredEnquiries.length}{" "}
                {filteredEnquiries.length ===
                1
                  ? "enquiry"
                  : "enquiries"}
              </span>

              {(search ||
                statusFilter) && (
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

          {loading ? (
            <div className="admin-empty-state">

              <div className="admin-spinner"></div>

              <p>
                Loading enquiries...
              </p>

            </div>
          ) : filteredEnquiries.length ===
            0 ? (
            <div className="admin-empty-state">

              <FaEnvelope size={34} />

              <h3>
                No enquiries found
              </h3>

              <p>
                Messages submitted from
                the Contact page will
                appear here.
              </p>

            </div>
          ) : (
            <div className="admin-table-wrapper">

              <table className="admin-data-table">

                <thead>
                  <tr>
                    <th>
                      Visitor
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Subject
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {filteredEnquiries.map(
                    (enquiry) => (
                      <tr
                        key={
                          enquiry._id
                        }
                      >

                        {/* VISITOR */}

                        <td>

                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "9px",
                              minWidth:
                                "140px",
                            }}
                          >

                            <div className="admin-enquiry-avatar">
                              {enquiry.name
                                ?.charAt(0)
                                .toUpperCase() ||
                                "?"}
                            </div>

                            <div>

                              <strong>
                                {enquiry.name}
                              </strong>

                              <div
                                style={{
                                  marginTop:
                                    "3px",
                                  color:
                                    "#94a3b8",
                                  fontSize:
                                    "0.52rem",
                                }}
                              >
                                Visitor
                              </div>

                            </div>

                          </div>

                        </td>

                        {/* EMAIL */}

                        <td>
                          {enquiry.email}
                        </td>

                        {/* SUBJECT */}

                        <td>

                          <p className="admin-description-cell">
                            {enquiry.subject}
                          </p>

                        </td>

                        {/* DATE */}

                        <td>
                          {formatDate(
                            enquiry.createdAt
                          )}
                        </td>

                        {/* STATUS */}

                        <td>

                          <select
                            className={`admin-enquiry-status-select status-${enquiry.status?.toLowerCase()}`}
                            value={
                              enquiry.status
                            }
                            disabled={
                              updating ===
                              enquiry._id
                            }
                            onChange={(
                              event
                            ) =>
                              updateStatus(
                                enquiry,
                                event
                                  .target
                                  .value
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

                        {/* ACTIONS */}

                        <td>

                          <div className="admin-table-actions">

                            <button
                              className="admin-view-button"
                              type="button"
                              title="View enquiry"
                              onClick={() =>
                                openEnquiry(
                                  enquiry
                                )
                              }
                            >
                              <FaEye />
                            </button>

                            <button
                              className="admin-delete-button"
                              type="button"
                              title="Delete enquiry"
                              onClick={() =>
                                deleteEnquiry(
                                  enquiry
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
          ENQUIRY DETAILS MODAL
      =================================================== */}

      {selectedEnquiry && (
        <div className="admin-modal-backdrop">

          <section className="admin-form-modal admin-enquiry-modal">

            <header className="admin-modal-header">

              <div>

                <span>
                  Visitor Message
                </span>

                <h2>
                  {
                    selectedEnquiry.subject
                  }
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedEnquiry(
                    null
                  )
                }
                aria-label="Close enquiry"
              >
                <FaTimes />
              </button>

            </header>

            {/* VISITOR CARD */}

            <div
              style={{
                padding: "15px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                border:
                  "1px solid #e8edf3",
                borderRadius: "11px",
                background: "#f8fafc",
              }}
            >

              <div
                className="admin-enquiry-avatar"
                style={{
                  width: "42px",
                  height: "42px",
                }}
              >
                {selectedEnquiry.name
                  ?.charAt(0)
                  .toUpperCase() ||
                  <FaUser />}
              </div>

              <div>

                <strong
                  style={{
                    display: "block",
                    color: "#263950",
                    fontSize: "0.8rem",
                  }}
                >
                  {selectedEnquiry.name}
                </strong>

                <span
                  style={{
                    display: "block",
                    marginTop: "2px",
                    color: "#8491a3",
                    fontSize: "0.6rem",
                  }}
                >
                  {selectedEnquiry.email}
                </span>

              </div>

            </div>

            {/* INFO */}

            <div className="admin-enquiry-info-grid">

              <div>
                <span>
                  Name
                </span>

                <strong>
                  {selectedEnquiry.name}
                </strong>
              </div>

              <div>
                <span>
                  Email
                </span>

                <strong>
                  {selectedEnquiry.email}
                </strong>
              </div>

              <div>
                <span>
                  Date
                </span>

                <strong>
                  {formatDate(
                    selectedEnquiry.createdAt
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  {selectedEnquiry.status}
                </strong>
              </div>

            </div>

            {/* MESSAGE */}

            <article className="admin-enquiry-message-box">

              <span>
                Message
              </span>

              <p>
                {selectedEnquiry.message}
              </p>

            </article>

            {/* ACTIONS */}

            <div
              className="admin-form-actions"
              style={{
                marginTop: "18px",
              }}
            >

              <button
                className="admin-secondary-button"
                type="button"
                onClick={() =>
                  setSelectedEnquiry(
                    null
                  )
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
                  <FaCheckCircle />

                  {updating ===
                  selectedEnquiry._id
                    ? "Updating..."
                    : "Mark Resolved"}
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