import "../../styles/gallery.css";

const images = [
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900",
  "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900",
  "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900",
  "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=900",
  "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900",
  "https://images.unsplash.com/photo-1599661046827-dacde6976548?w=900",
];

function Gallery() {
  return (
    <section className="travel-gallery">
      <div className="container">

        <div className="section-title">
          <h2>Travel Gallery</h2>
          <p>Beautiful moments from across India.</p>
        </div>

        <div className="gallery-grid">

          {images.map((image, index) => (
            <div className="gallery-item" key={index}>
              <img src={image} alt="Travel" />
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Gallery;