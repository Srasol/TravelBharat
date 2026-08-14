import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaImages,
} from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation,
  Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import API from "../../services/api";
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
      console.error("Home gallery error:", requestError);

      setError(
        requestError.response?.data?.message ||
          "Unable to load gallery images."
      );
    } finally {
      setLoading(false);
    }
  };

  const galleryImages = useMemo(() => {
    return places.flatMap((place) =>
      (place.images || []).map((image, index) => ({
        id: `${place._id}-${index}`,
        image,
        name: place.name,
        state: place.state?.name || "",
        city: place.city?.name || "",
        category: place.category?.name || "",
      }))
    );
  }, [places]);

  return (
    <section className="home-gallery">
      <div className="container">
        <div className="home-gallery-header">
          <div>
            <span>TRAVEL MOMENTS</span>

            <h2>Explore Our Gallery</h2>

            <p>
              Discover beautiful destinations across India
              through images uploaded from the TravelBharat
              admin panel.
            </p>
          </div>

          <Link to="/gallery">
            View Full Gallery
            <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="home-gallery-empty">
            <p>Loading gallery...</p>
          </div>
        ) : error ? (
          <div className="home-gallery-empty">
            <p>{error}</p>
          </div>
        ) : galleryImages.length === 0 ? (
          <div className="home-gallery-empty">
            <FaImages size={34} />

            <h3>No gallery images yet</h3>

            <p>
              Upload tourist-place images from the admin panel.
            </p>
          </div>
        ) : (
          <Swiper
            className="home-gallery-swiper"
            modules={[
              Autoplay,
              Navigation,
              Pagination,
            ]}
            slidesPerView={1}
            spaceBetween={0}
            loop={galleryImages.length > 1}
            speed={900}
            autoplay={{
              delay: 2800,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation
            pagination={{
              clickable: true,
            }}
          >
            {galleryImages.map((item) => (
              <SwiperSlide key={item.id}>
                <article className="home-gallery-card">
                  <img
                    src={`http://localhost:5000/${item.image}`}
                    alt={item.name}
                  />

                  <div className="home-gallery-overlay">
                    <span>
                      {item.category ||
                        "TravelBharat Gallery"}
                    </span>

                    <h3>{item.name}</h3>

                    <p>
                      {item.city}

                      {item.city && item.state
                        ? ", "
                        : ""}

                      {item.state}
                    </p>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}

export default HomeGallery;