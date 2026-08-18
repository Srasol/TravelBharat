import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaImages,
  FaMapMarkerAlt,
} from "react-icons/fa";

import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUrl";

import "./HomeGallery.css";

function HomeGallery() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/places");

      setPlaces(response.data.places || []);
    } catch (requestError) {
      console.error(
        "Home gallery error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to load gallery images."
      );
    } finally {
      setLoading(false);
    }
  };

  const galleryImages = useMemo(() => {
    return places
      .flatMap((place) =>
        (place.images || []).map((image, index) => ({
          id: `${place._id}-${index}`,
          placeId: place._id,
          image,
          name: place.name,
          state: place.state?.name || "",
          city: place.city?.name || "",
          category:
            place.category?.name || "Destination",
        }))
      )
      .slice(0, 6);
  }, [places]);

  return (
    <section className="tb-gallery-section">

      <div className="tb-gallery-watermark">
        MOMENTS
      </div>

      <div className="container">

        {/* HEADER */}

        <div className="tb-gallery-header">

          <div>
            <span>
              VISUAL JOURNEY
            </span>

            <h2>
              India,
              <br />
              through every frame.
            </h2>
          </div>

          <div className="tb-gallery-intro">

            <p>
              Step into beautiful moments from destinations
              across India — from iconic landmarks and royal
              cities to peaceful landscapes and unforgettable
              escapes.
            </p>

            <Link to="/gallery">
              View full gallery
              <FaArrowRight />
            </Link>

          </div>

        </div>

        {/* CONTENT */}

        {loading ? (
          <div className="tb-gallery-message">

            <div className="tb-gallery-spinner"></div>

            <p>
              Loading travel moments...
            </p>

          </div>
        ) : error ? (
          <div className="tb-gallery-message">

            <FaImages />

            <h3>
              Unable to load gallery
            </h3>

            <p>
              {error}
            </p>

          </div>
        ) : galleryImages.length === 0 ? (
          <div className="tb-gallery-message">

            <FaImages />

            <h3>
              No gallery images yet
            </h3>

            <p>
              Upload tourist-place images from the
              TravelBharat admin panel.
            </p>

          </div>
        ) : (
          <div className="tb-gallery-grid">

            {galleryImages.map((item, index) => (
              <Link
                to={`/places/${item.placeId}`}
                className={`tb-gallery-item tb-gallery-item-${
                  index + 1
                }`}
                key={item.id}
              >

                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                />

                <div className="tb-gallery-shade"></div>

                <span className="tb-gallery-index">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <span className="tb-gallery-category">
                  {item.category}
                </span>

                <div className="tb-gallery-content">

                  <p>
                    <FaMapMarkerAlt />

                    {item.city}

                    {item.city && item.state
                      ? ", "
                      : ""}

                    {item.state}
                  </p>

                  <h3>
                    {item.name}
                  </h3>

                  <div>
                    <span>
                      Discover
                    </span>

                    <FaArrowRight />
                  </div>

                </div>

              </Link>
            ))}

          </div>
        )}

        {/* BOTTOM */}

        <div className="tb-gallery-footer">

          <span>
            A COLLECTION OF INCREDIBLE INDIA
          </span>

          <Link to="/gallery">
            Explore all moments
            <FaArrowRight />
          </Link>

        </div>

      </div>
    </section>
  );
}

export default HomeGallery;