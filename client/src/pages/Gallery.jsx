import { useEffect, useMemo, useState } from "react";
import { FaImage, FaSearch, FaTimes } from "react-icons/fa";

import API from "../services/api";
import "../styles/gallery.css";

function Gallery() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/places");

      setPlaces(response.data.places || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load gallery."
      );
    } finally {
      setLoading(false);
    }
  };

  const galleryImages = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return places.flatMap((place) => {
      const matches =
        !keyword ||
        place.name?.toLowerCase().includes(keyword) ||
        place.state?.name?.toLowerCase().includes(keyword) ||
        place.city?.name?.toLowerCase().includes(keyword) ||
        place.category?.name?.toLowerCase().includes(keyword);

      if (!matches) {
        return [];
      }

      return (place.images || []).map((image, index) => ({
        id: `${place._id}-${index}`,
        image,
        placeName: place.name,
        stateName: place.state?.name || "",
        cityName: place.city?.name || "",
        categoryName: place.category?.name || "",
      }));
    });
  }, [places, search]);

  return (
    <main className="gallery-page">
      <section className="gallery-hero">
        <div className="container">
          <span>TRAVELBHARAT GALLERY</span>

          <h1>Discover India Through Beautiful Moments</h1>

          <p>
            Explore destination images uploaded through the TravelBharat
            admin panel.
          </p>
        </div>
      </section>

      <section className="gallery-section">
        <div className="container">
          <div className="gallery-toolbar">
            <div className="gallery-search">
              <FaSearch />

              <input
                type="search"
                placeholder="Search place, state, city or category..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <span>
              {galleryImages.length} image
              {galleryImages.length === 1 ? "" : "s"}
            </span>
          </div>

          {loading ? (
            <div className="gallery-empty">
              <div className="gallery-spinner"></div>
              <p>Loading gallery...</p>
            </div>
          ) : error ? (
            <div className="gallery-empty">
              <p>{error}</p>
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="gallery-empty">
              <FaImage size={38} />
              <h3>No gallery images found</h3>
              <p>
                Upload tourist-place images from the Admin Tourist Places page.
              </p>
            </div>
          ) : (
            <div className="gallery-grid">
              {galleryImages.map((item) => (
                <article
                  className="gallery-card"
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                >
                  <img
                    src={`http://localhost:5000/${item.image}`}
                    alt={item.placeName}
                  />

                  <div className="gallery-overlay">
                    <span>{item.categoryName}</span>
                    <h3>{item.placeName}</h3>

                    <p>
                      {item.cityName}
                      {item.cityName && item.stateName ? ", " : ""}
                      {item.stateName}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedImage && (
        <div
          className="gallery-lightbox"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image"
          >
            <FaTimes />
          </button>

          <div
            className="gallery-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={`http://localhost:5000/${selectedImage.image}`}
              alt={selectedImage.placeName}
            />

            <div>
              <span>{selectedImage.categoryName}</span>
              <h2>{selectedImage.placeName}</h2>

              <p>
                {selectedImage.cityName}
                {selectedImage.cityName &&
                selectedImage.stateName
                  ? ", "
                  : ""}
                {selectedImage.stateName}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Gallery;