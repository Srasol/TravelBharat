import "../../styles/why.css";
import {
  FaMapMarkedAlt,
  FaCamera,
  FaGlobeAsia,
  FaRoute,
} from "react-icons/fa";

function WhyTravelBharat() {
  const features = [
    {
      icon: <FaMapMarkedAlt />,
      title: "All States",
      text: "Explore every Indian state and Union Territory.",
    },
    {
      icon: <FaCamera />,
      title: "Beautiful Gallery",
      text: "High-quality images of every destination.",
    },
    {
      icon: <FaGlobeAsia />,
      title: "Verified Information",
      text: "Accurate tourism information collected from trusted sources.",
    },
    {
      icon: <FaRoute />,
      title: "Easy Navigation",
      text: "Find places quickly with smart browsing and search.",
    },
  ];

  return (
    <section className="why-section">
      <div className="container">

        <div className="section-title">
          <h2>Why TravelBharat?</h2>
          <p>Your complete guide to exploring India.</p>
        </div>

        <div className="row">

          {features.map((item, index) => (
            <div className="col-lg-3 col-md-6 mb-4" key={index}>
              <div className="why-card">

                <div className="why-icon">
                  {item.icon}
                </div>

                <h4>{item.title}</h4>

                <p>{item.text}</p>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default WhyTravelBharat;