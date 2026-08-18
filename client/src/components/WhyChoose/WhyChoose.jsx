import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaMapMarkedAlt,
  FaSearchLocation,
  FaShieldAlt,
} from "react-icons/fa";

import "./WhyChoose.css";

const features = [
  {
    number: "01",
    icon: <FaShieldAlt />,
    title: "Structured Travel Information",
    text: "Destination details are presented in a clean and organized format so travelers can understand everything quickly.",
  },
  {
    number: "02",
    icon: <FaMapMarkedAlt />,
    title: "Explore State by State",
    text: "Discover tourist places across India through states, cities and destination-based exploration.",
  },
  {
    number: "03",
    icon: <FaSearchLocation />,
    title: "Simple Destination Discovery",
    text: "Search destinations easily and narrow results using state, city and category filters.",
  },
  {
    number: "04",
    icon: <FaCheckCircle />,
    title: "Curated & Managed Content",
    text: "Travel information is maintained through the TravelBharat admin platform for a consistent browsing experience.",
  },
];

function WhyChoose() {
  return (
    <section className="tb-why-section">
      <div className="tb-why-watermark">
        WHY US
      </div>

      <div className="container">

        <div className="tb-why-layout">

          {/* LEFT SIDE */}

          <div className="tb-why-intro">
            <span>
              WHY TRAVELBHARAT
            </span>

            <h2>
              Built to make
              <br />
              exploring India easier.
            </h2>

            <p>
              TravelBharat brings destinations, states,
              categories and useful travel information
              together in one simple and beautifully
              organized platform.
            </p>

            <Link to="/about">
              Discover TravelBharat

              <span>
                <FaArrowRight />
              </span>
            </Link>
          </div>

          {/* RIGHT FEATURES */}

          <div className="tb-why-features">

            {features.map((feature) => (
              <article
                className="tb-why-feature"
                key={feature.title}
              >
                <div className="tb-why-feature-top">
                  <span>
                    {feature.number}
                  </span>

                  <div>
                    {feature.icon}
                  </div>
                </div>

                <h3>
                  {feature.title}
                </h3>

                <p>
                  {feature.text}
                </p>
              </article>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}

export default WhyChoose;