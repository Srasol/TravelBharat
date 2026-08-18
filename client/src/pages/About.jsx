import { Link } from "react-router-dom";
import {
  FaArrowRight,
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
      number: "01",
      icon: <FaMapMarkedAlt />,
      title: "State-Wise Exploration",
      description:
        "Explore tourist destinations across India through organized state-wise and city-wise information.",
    },
    {
      number: "02",
      icon: <FaSearchLocation />,
      title: "Easy Discovery",
      description:
        "Search and filter destinations by state, city and tourism category to quickly find places of interest.",
    },
    {
      number: "03",
      icon: <FaLandmark />,
      title: "Rich Destination Details",
      description:
        "Learn about destination history, best time to visit, entry fees, timings, nearby attractions and more.",
    },
    {
      number: "04",
      icon: <FaShieldAlt />,
      title: "Admin Managed Content",
      description:
        "Tourism information is managed through a secure administration panel for better organization and accuracy.",
    },
  ];

  return (
    <main className="tb-about-page">

      {/* HERO */}

      <section className="tb-about-hero">
        <div className="tb-about-hero-overlay"></div>

        <div className="container tb-about-hero-content">

          <span>
            ABOUT TRAVELBHARAT
          </span>

          <h1>
            Discover India,
            <br />
            one story at a time.
          </h1>

          <p>
            TravelBharat is a modern tourism platform
            designed to make discovering India's
            incredible destinations simple, organized
            and inspiring.
          </p>

        </div>
      </section>

      {/* STORY */}

      <section className="tb-about-story">
        <div className="container">

          <div className="tb-about-story-layout">

            <div className="tb-about-story-heading">
              <span>
                OUR STORY
              </span>

              <h2>
                A digital guide to
                <br />
                Incredible India.
              </h2>
            </div>

            <div className="tb-about-story-content">

              <p>
                India offers extraordinary diversity in
                landscapes, history, architecture, culture,
                religion and traditions. Yet tourism
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

              <Link to="/search">
                Explore India
                <FaArrowRight />
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* BRAND HIGHLIGHT */}

      <section className="tb-about-highlight">
        <div className="container">

          <div className="tb-about-highlight-card">

            <div className="tb-about-highlight-icon">
              <FaGlobeAsia />
            </div>

            <div>
              <span>
                TRAVELBHARAT
              </span>

              <h2>
                Explore India
                <br />
                state by state.
              </h2>

              <p>
                A modern tourism information platform built
                to organize India's destinations into one
                accessible digital travel experience.
              </p>
            </div>

            <div className="tb-about-highlight-tags">
              <span>
                Culture
              </span>

              <span>
                Heritage
              </span>

              <span>
                Nature
              </span>

              <span>
                Discovery
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* PURPOSE */}

      <section className="tb-about-purpose">
        <div className="container">

          <div className="tb-about-section-heading">
            <span>
              OUR PURPOSE
            </span>

            <h2>
              Built to simplify the
              way India is explored.
            </h2>

            <p>
              TravelBharat focuses on structured,
              accessible and useful tourism information.
            </p>
          </div>

          <div className="tb-about-purpose-grid">

            <article>
              <span>
                01
              </span>

              <h3>
                Our Mission
              </h3>

              <p>
                Provide one platform where users can
                discover tourist destinations across
                Indian states and cities.
              </p>
            </article>

            <article>
              <span>
                02
              </span>

              <h3>
                Our Vision
              </h3>

              <p>
                Build a scalable digital tourism
                encyclopedia that promotes India's
                heritage, culture and natural beauty.
              </p>
            </article>

            <article>
              <span>
                03
              </span>

              <h3>
                Our Goal
              </h3>

              <p>
                Make tourism information easier to access
                for travelers, students and researchers.
              </p>
            </article>

          </div>

        </div>
      </section>

      {/* FEATURES */}

      <section className="tb-about-features">
        <div className="container">

          <div className="tb-about-features-layout">

            <div className="tb-about-features-heading">

              <span>
                WHAT WE OFFER
              </span>

              <h2>
                Everything you need
                to discover a place.
              </h2>

              <p>
                Search, explore and understand destinations
                through one carefully structured platform.
              </p>

            </div>

            <div className="tb-about-features-grid">

              {features.map((feature) => (
                <article
                  className="tb-about-feature-card"
                  key={feature.title}
                >

                  <div className="tb-about-feature-top">

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
                    {feature.description}
                  </p>

                </article>
              ))}

            </div>

          </div>

        </div>
      </section>

      {/* RESPONSIBLE TOURISM */}

      <section className="tb-about-tourism">
        <div className="container">

          <div className="tb-about-tourism-card">

            <div className="tb-about-tourism-icon">
              <FaTree />
            </div>

            <div className="tb-about-tourism-copy">

              <span>
                RESPONSIBLE DISCOVERY
              </span>

              <h2>
                Discover more.
                <br />
                Travel with awareness.
              </h2>

              <p>
                TravelBharat encourages travelers to learn
                about India's cultural heritage, natural
                attractions and regional diversity while
                discovering lesser-known destinations.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* FINAL */}

      <section className="tb-about-final">

        <div className="container">

          <FaGlobeAsia />

          <span>
            EXPLORE INCREDIBLE INDIA
          </span>

          <h2>
            Every state has a story.
            <br />
            Start discovering it.
          </h2>

          <p>
            From Munnar's green hills to Jaipur's royal
            heritage, discover India's destinations with
            TravelBharat.
          </p>

          <Link to="/search">
            Start Exploring
            <FaArrowRight />
          </Link>

        </div>

      </section>

    </main>
  );
}

export default About;