import "../../styles/featuredStates.css";

const states = [
  {
    id: 1,
    name: "Kerala",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
    places: "245 Destinations",
  },
  {
    id: 2,
    name: "Goa",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
    places: "120 Destinations",
  },
  {
    id: 3,
    name: "Rajasthan",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
    places: "310 Destinations",
  },
  {
    id: 4,
    name: "Himachal Pradesh",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
    places: "180 Destinations",
  },
];

function FeaturedStates() {
  return (
    <section className="featured-section" id="featured-states">
      <div className="container">

        <div className="section-title">
          <h2>Featured States</h2>
          <p>Explore India's most loved destinations.</p>
        </div>

        <div className="row">

          {states.map((state) => (
            <div className="col-lg-3 col-md-6 mb-4" key={state.id}>
              <div className="state-card">

                <img src={state.image} alt={state.name} />

                <div className="state-overlay">
                  <h3>{state.name}</h3>
                  <p>{state.places}</p>

                  <button>Explore</button>
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default FeaturedStates;