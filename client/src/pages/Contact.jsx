import { useState } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhoneAlt,
  FaQuestionCircle,
  FaShieldAlt,
} from "react-icons/fa";

import API from "../services/api";
import "../styles/contact.css";

const emptyForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function Contact() {
  const [formData, setFormData] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setError("Please complete all fields.");
      return;
    }

    try {
      setSending(true);
      setSuccess("");
      setError("");

      const response = await API.post("/enquiries", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setSuccess(
        response.data.message ||
          "Your enquiry has been sent successfully."
      );

      setFormData(emptyForm);
    } catch (requestError) {
      console.error(
        "Contact enquiry error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to send your enquiry. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="tb-contact-page">

      {/* HERO */}

      <section className="tb-contact-hero">

        <div className="tb-contact-hero-overlay"></div>

        <div className="container tb-contact-hero-content">

          <span>
            CONTACT TRAVELBHARAT
          </span>

          <h1>
            Let’s make your
            <br />
            journey easier.
          </h1>

          <p>
            Have a tourism question, suggestion or correction?
            Reach out to us and help us make TravelBharat
            better for every traveler.
          </p>

        </div>

      </section>

      {/* CONTACT AREA */}

      <section className="tb-contact-section">

        <div className="container">

          <div className="tb-contact-layout">

            {/* LEFT */}

            <aside className="tb-contact-info">

              <span className="tb-contact-eyebrow">
                GET IN TOUCH
              </span>

              <h2>
                We’d love to
                hear from you.
              </h2>

              <p className="tb-contact-description">
                Whether you have a question about a destination,
                want to suggest a new place or noticed information
                that needs updating, you can contact us here.
              </p>

              <div className="tb-contact-list">

                <div className="tb-contact-item">

                  <div>
                    <FaEnvelope />
                  </div>

                  <section>
                    <small>
                      Email
                    </small>

                    <strong>
                      support@travelbharat.com
                    </strong>

                    <p>
                      Tourism questions and suggestions
                    </p>
                  </section>

                </div>

                <div className="tb-contact-item">

                  <div>
                    <FaPhoneAlt />
                  </div>

                  <section>
                    <small>
                      Phone
                    </small>

                    <strong>
                      +91 98765 43210
                    </strong>

                    <p>
                      Contact our support team
                    </p>
                  </section>

                </div>

                <div className="tb-contact-item">

                  <div>
                    <FaMapMarkerAlt />
                  </div>

                  <section>
                    <small>
                      Location
                    </small>

                    <strong>
                      India
                    </strong>

                    <p>
                      Exploring India state by state
                    </p>
                  </section>

                </div>

              </div>

              <div className="tb-contact-help">

                <FaQuestionCircle />

                <div>
                  <strong>
                    Need destination information?
                  </strong>

                  <p>
                    Ask us about places, categories,
                    locations or TravelBharat content.
                  </p>
                </div>

              </div>

            </aside>

            {/* RIGHT */}

            <form
              className="tb-contact-form"
              onSubmit={handleSubmit}
            >

              <div className="tb-contact-form-header">

                <span>
                  SEND AN ENQUIRY
                </span>

                <h2>
                  How can we help?
                </h2>

                <p>
                  Fill in the details below and send your
                  message to the TravelBharat team.
                </p>

              </div>

              {success && (
                <div className="tb-contact-success">
                  {success}
                </div>
              )}

              {error && (
                <div className="tb-contact-error">
                  {error}
                </div>
              )}

              <div className="tb-contact-form-grid">

                <div className="tb-contact-field">

                  <label htmlFor="contact-name">
                    Full Name
                  </label>

                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={sending}
                    required
                  />

                </div>

                <div className="tb-contact-field">

                  <label htmlFor="contact-email">
                    Email Address
                  </label>

                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={sending}
                    required
                  />

                </div>

              </div>

              <div className="tb-contact-field">

                <label htmlFor="contact-subject">
                  Subject
                </label>

                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="What is your enquiry about?"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={sending}
                  required
                />

              </div>

              <div className="tb-contact-field">

                <label htmlFor="contact-message">
                  Message
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  rows="7"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  disabled={sending}
                  required
                />

              </div>

              <button
                className="tb-contact-submit"
                type="submit"
                disabled={sending}
              >
                <FaPaperPlane />

                {sending
                  ? "Sending Enquiry..."
                  : "Send Enquiry"}
              </button>

              <div className="tb-contact-note">
                <FaShieldAlt />

                <span>
                  Your enquiry will be securely submitted
                  to the TravelBharat administration.
                </span>
              </div>

            </form>

          </div>

        </div>

      </section>

      {/* BOTTOM */}

      <section className="tb-contact-bottom">

        <div className="container">

          <span>
            TRAVELBHARAT
          </span>

          <h2>
            Helping you discover
            <br />
            Incredible India.
          </h2>

          <p>
            Explore destinations, discover cultures and
            experience the diversity of India.
          </p>

        </div>

      </section>

    </main>
  );
}

export default Contact;