import "../../styles/topDestinations.css";
import { FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

const destinations = [
  {
    id: 1,
    name: "Taj Mahal",
    location: "Agra, Uttar Pradesh",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900",
  },
  {
    id: 2,
    name: "Mysore Palace",
    location: "Mysore, Karnataka",
    image:
      "https://images.unsplash.com/photo-1599661046827-dacde6976548?w=900",
  },
  {
    id: 3,
    name: "Golden Temple",
    location: "Amritsar, Punjab",
    image:
      "https://images.unsplash.com/photo-1583396618422-2df2c3d0bcd0?w=900",
  },
];

function TopDestinations() {
  return (
    <section className="destination-section">
      <div className="container">

        <div className="section-title">
          <h2>Top Destinations</h2>
          <p>Discover India's most iconic places.</p>
        </div>

        <div className="row">

          {destinations.map((place) => (
            <div className="col-lg-4 mb-4" key={place.id}>

              <div className="destination-card">

                <img src={place.image} alt={place.name} />

                <div className="destination-content">

                  <h3>{place.name}</h3>

                  <p>
                    <FaMapMarkerAlt />
                    {place.location}
                  </p>

                  <button>
                    View Details
                    <FaArrowRight />
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default TopDestinations;