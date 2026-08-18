import { useEffect, useMemo, useState } from "react";
import {
  FaImage,
  FaMapMarkerAlt,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

import API from "../services/api";
import { getImageUrl } from "../utils/imageUrl";

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
      console.error(
        "Gallery load error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to load gallery."
      );
    } finally {
      setLoading(false);
    }
  };

  const galleryImages = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return places.flatMap((place) => {
      const matches =
        !keyword ||
        place.name
          ?.toLowerCase()
          .includes(keyword) ||
        place.state?.name
          ?.toLowerCase()
          .includes(keyword) ||
        place.city?.name
          ?.toLowerCase()
          .includes(keyword) ||
        place.category?.name
          ?.toLowerCase()
          .includes(keyword);

      if (!matches) {
        return [];
      }

      return (place.images || []).map(
        (image, index) => ({
          id: `${place._id}-${index}`,
          image,
          placeName: place.name,
          stateName:
            place.state?.name || "",
          cityName:
            place.city?.name || "",
          categoryName:
            place.category?.name || "",
        })
      );
    });
  }, [places, search]);

  return (
    <main className="gallery-page-new">

      {/* HERO */}

      <section className="gallery-hero-new">
        <div className="container">

          <span>
            TRAVELBHARAT GALLERY
          </span>

          <h1>
            Moments from
            <br />
            Incredible India
          </h1>

          <p>
            A visual collection of beautiful
            destinations, heritage, landscapes and
            unforgettable travel experiences across India.
          </p>

        </div>
      </section>

      {/* GALLERY SECTION */}

      <section className="gallery-content-new">

        <div className="container">

          {/* TOP */}

          <div className="gallery-top-new">

            <div>
              <span>
                VISUAL DISCOVERY
              </span>

              <h2>
                Explore the gallery
              </h2>
            </div>

            <p>
              {galleryImages.length} image
              {galleryImages.length === 1
                ? ""
                : "s"}
            </p>

          </div>

          {/* SEARCH */}

          <div className="gallery-search-new">

            <FaSearch />

            <input
              type="search"
              placeholder="Search place, city, state or category..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

          {/* CONTENT */}

          {loading ? (
            <div className="gallery-message-new">

              <div className="gallery-spinner-new"></div>

              <h3>
                Loading gallery
              </h3>

              <p>
                Preparing beautiful travel moments.
              </p>

            </div>
          ) : error ? (
            <div className="gallery-message-new">

              <h3>
                Unable to load gallery
              </h3>

              <p>
                {error}
              </p>

            </div>
          ) : galleryImages.length === 0 ? (
            <div className="gallery-message-new">

              <FaImage />

              <h3>
                No images found
              </h3>

              <p>
                Try another search.
              </p>

            </div>
          ) : (
            <div className="gallery-grid-new">

              {galleryImages.map((item) => (
                <article
                  className="gallery-card-new"
                  key={item.id}
                  onClick={() =>
                    setSelectedImage(item)
                  }
                >

                  <div className="gallery-image-new">

                    <img
                      src={getImageUrl(
                        item.image
                      )}
                      alt={item.placeName}
                    />

                    <span>
                      {item.categoryName ||
                        "Destination"}
                    </span>

                  </div>

                  <div className="gallery-info-new">

                    <h3>
                      {item.placeName}
                    </h3>

                    <p>
                      <FaMapMarkerAlt />

                      {item.cityName}

                      {item.cityName &&
                      item.stateName
                        ? ", "
                        : ""}

                      {item.stateName}
                    </p>

                  </div>

                </article>
              ))}

            </div>
          )}

        </div>

      </section>

      {/* LIGHTBOX */}

      {selectedImage && (
        <div
          className="gallery-lightbox-new"
          onClick={() =>
            setSelectedImage(null)
          }
        >

          <button
            type="button"
            onClick={() =>
              setSelectedImage(null)
            }
          >
            <FaTimes />
          </button>

          <div
            className="gallery-lightbox-box"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <img
              src={getImageUrl(
                selectedImage.image
              )}
              alt={
                selectedImage.placeName
              }
            />

            <div>

              <span>
                {selectedImage.categoryName ||
                  "Destination"}
              </span>

              <h2>
                {
                  selectedImage.placeName
                }
              </h2>

              <p>
                <FaMapMarkerAlt />

                {
                  selectedImage.cityName
                }

                {selectedImage.cityName &&
                selectedImage.stateName
                  ? ", "
                  : ""}

                {
                  selectedImage.stateName
                }
              </p>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

export default Gallery;