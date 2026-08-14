import {
  FaGlobeAsia,
  FaLandmark,
  FaMapMarkedAlt,
  FaSearchLocation,
  FaShieldAlt,
  FaTree,
} from "react-icons/fa";

import "../styles/about.css";

function About() {
  const features = [
    {
      icon: <FaMapMarkedAlt />,
      title: "State-Wise Exploration",
      description:
        "Explore tourist destinations across India through organized state-wise and city-wise information.",
    },
    {
      icon: <FaSearchLocation />,
      title: "Easy Discovery",
      description:
        "Search and filter destinations by state, city and tourism category to quickly find places of interest.",
    },
    {
      icon: <FaLandmark />,
      title: "Rich Destination Details",
      description:
        "Learn about destination history, best time to visit, entry fees, timings, nearby attractions and more.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Admin Managed Content",
      description:
        "Tourism information is managed through a secure administration panel for better organization and accuracy.",
    },
  ];

  return (
    <main className="about-page">

      {/* HERO */}

      <section className="about-hero">
        <div className="container about-hero-content">
          <span>ABOUT TRAVELBHARAT</span>

          <h1>
            Discover India,
            <br />
            One State at a Time
          </h1>

          <p>
            TravelBharat is a centralized tourism information
            platform designed to make discovering India's
            incredible destinations simple, structured and
            enjoyable.
          </p>
        </div>
      </section>

      {/* INTRODUCTION */}

      <section className="about-introduction">
        <div className="container">
          <div className="about-intro-grid">

            <article className="about-intro-content">
              <span>OUR STORY</span>

              <h2>
                Your Digital Guide to Incredible India
              </h2>

              <p>
                India offers extraordinary diversity in
                landscapes, history, architecture, culture,
                religion and traditions. However, tourism
                information is often scattered across many
                different websites and sources.
              </p>

              <p>
                TravelBharat brings this information together
                into one organized platform where travelers,
                students and researchers can explore tourist
                destinations state by state and city by city.
              </p>

              <p>
                From peaceful hill stations and beautiful
                beaches to historic monuments and religious
                destinations, TravelBharat helps visitors
                discover the diversity of India through an
                easy-to-use digital experience.
              </p>
            </article>

            <aside className="about-highlight-card">
              <div className="about-highlight-icon">
                <FaGlobeAsia />
              </div>

              <span>TRAVELBHARAT</span>

              <h3>
                Explore India State by State
              </h3>

              <p>
                A modern tourism information platform built
                to organize India's destinations into one
                accessible digital travel encyclopedia.
              </p>

              <div className="about-highlight-line"></div>

              <small>
                Incredible India • Culture • Heritage • Nature
              </small>
            </aside>

          </div>
        </div>
      </section>

      {/* MISSION */}

      <section className="about-mission">
        <div className="container">
          <div className="about-section-heading">
            <span>OUR PURPOSE</span>

            <h2>
              Making Indian Tourism Easier to Explore
            </h2>

            <p>
              TravelBharat focuses on providing structured,
              accessible and informative tourism content.
            </p>
          </div>

          <div className="about-mission-grid">

            <article className="about-mission-card">
              <span>01</span>

              <h3>Our Mission</h3>

              <p>
                Provide a single platform where users can
                easily discover tourist destinations across
                Indian states and cities.
              </p>
            </article>

            <article className="about-mission-card">
              <span>02</span>

              <h3>Our Vision</h3>

              <p>
                Build a scalable digital tourism encyclopedia
                that promotes India's heritage, culture,
                nature and lesser-known destinations.
              </p>
            </article>

            <article className="about-mission-card">
              <span>03</span>

              <h3>Our Goal</h3>

              <p>
                Simplify tourism information so travelers,
                students and researchers can discover India
                without searching across multiple websites.
              </p>
            </article>

          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section className="about-features">
        <div className="container">

          <div className="about-section-heading">
            <span>WHAT WE OFFER</span>

            <h2>
              Everything You Need to Discover a Destination
            </h2>
          </div>

          <div className="about-features-grid">
            {features.map((feature) => (
              <article
                className="about-feature-card"
                key={feature.title}
              >
                <div className="about-feature-icon">
                  {feature.icon}
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* RESPONSIBLE TOURISM */}

      <section className="about-tourism">
        <div className="container">
          <div className="about-tourism-card">

            <div className="about-tourism-icon">
              <FaTree />
            </div>

            <div>
              <span>RESPONSIBLE DISCOVERY</span>

              <h2>
                Promoting Awareness of India's Tourism
              </h2>

              <p>
                TravelBharat encourages travelers to learn
                about India's cultural heritage, natural
                attractions and regional diversity while
                promoting awareness of lesser-known
                destinations across the country.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}

      <section className="about-final">
        <div className="container">
          <FaGlobeAsia />

          <span>EXPLORE INCREDIBLE INDIA</span>

          <h2>
            Every State Has a Story.
            <br />
            Start Discovering It.
          </h2>

          <p>
            From Munnar's green hills to Jaipur's royal
            heritage, discover India's destinations with
            TravelBharat.
          </p>
        </div>
      </section>

    </main>
  );
}

export default About;