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
      console.error("Contact enquiry error:", requestError);

      setError(
        requestError.response?.data?.message ||
          "Unable to send your enquiry. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="contact-page">

      {/* HERO */}

      <section className="contact-hero">
        <div className="container contact-hero-content">
          <span>CONTACT TRAVELBHARAT</span>

          <h1>
            We're Here to
            <br />
            Help You Explore
          </h1>

          <p>
            Have a tourism question, suggestion or correction?
            Send us a message and help us make TravelBharat
            better for every traveler.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}

      <section className="contact-section">
        <div className="container">

          <div className="contact-layout">

            {/* LEFT SIDE */}

            <aside className="contact-info-panel">

              <span className="contact-small-title">
                GET IN TOUCH
              </span>

              <h2>
                We'd Love to Hear From You
              </h2>

              <p className="contact-info-description">
                Whether you have a question about a destination,
                want to suggest a new place, or noticed information
                that needs updating, feel free to contact us.
              </p>

              <div className="contact-info-list">

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <FaEnvelope />
                  </div>

                  <div>
                    <small>Email</small>
                    <strong>
                      support@travelbharat.com
                    </strong>
                    <p>
                      Send us your tourism questions
                    </p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <FaPhoneAlt />
                  </div>

                  <div>
                    <small>Phone</small>
                    <strong>
                      +91 98765 43210
                    </strong>
                    <p>
                      Contact our support team
                    </p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <small>Location</small>
                    <strong>India</strong>
                    <p>
                      Exploring India state by state
                    </p>
                  </div>
                </div>

              </div>

              <div className="contact-help-box">
                <FaQuestionCircle />

                <div>
                  <strong>
                    Destination Information
                  </strong>

                  <p>
                    Ask us about tourist places, categories,
                    locations or information available on
                    TravelBharat.
                  </p>
                </div>
              </div>

            </aside>

            {/* RIGHT SIDE */}

            <form
              className="contact-form-card"
              onSubmit={handleSubmit}
            >

              <div className="contact-form-heading">
                <span>SEND AN ENQUIRY</span>

                <h2>How Can We Help?</h2>

                <p>
                  Fill in the form below and send your
                  message to the TravelBharat team.
                </p>
              </div>

              {success && (
                <div className="contact-success-message">
                  {success}
                </div>
              )}

              {error && (
                <div className="contact-error-message">
                  {error}
                </div>
              )}

              <div className="contact-form-grid">

                <div className="contact-field">
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

                <div className="contact-field">
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

              <div className="contact-field">
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

              <div className="contact-field">
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
                className="contact-submit-button"
                type="submit"
                disabled={sending}
              >
                <FaPaperPlane />

                {sending
                  ? "Sending Enquiry..."
                  : "Send Enquiry"}
              </button>

              <div className="contact-form-note">
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

      {/* BOTTOM SECTION */}

      <section className="contact-bottom-section">
        <div className="container">
          <span>TRAVELBHARAT</span>

          <h2>
            Helping You Discover
            <br />
            Incredible India
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