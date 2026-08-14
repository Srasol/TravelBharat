import {
  FaCheckCircle,
  FaMapMarkedAlt,
  FaSearchLocation,
  FaShieldAlt,
} from "react-icons/fa";

import "./WhyChoose.css";

const features = [
  {
    icon: <FaShieldAlt />,
    title: "Structured Information",
    text: "Find destination details in a clear and organized format.",
  },
  {
    icon: <FaMapMarkedAlt />,
    title: "State-wise Exploration",
    text: "Explore tourist places across India by state and city.",
  },
  {
    icon: <FaSearchLocation />,
    title: "Easy Search",
    text: "Quickly find places using search and category filters.",
  },
  {
    icon: <FaCheckCircle />,
    title: "Admin Managed Content",
    text: "Tourism information is managed through a dedicated admin panel.",
  },
];

function WhyChoose() {
  return (
    <section className="why-choose">
      <div className="container">
        <div className="section-title">
          <span>WHY TRAVELBHARAT</span>

          <h2>A Simpler Way to Explore India</h2>

          <p>
            TravelBharat brings state-wise tourism information together
            in one easy-to-use platform.
          </p>
        </div>

        <div className="why-choose-grid">
          {features.map((feature) => (
            <article
              className="why-choose-card"
              key={feature.title}
            >
              <div className="why-choose-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;