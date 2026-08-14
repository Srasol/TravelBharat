import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../../services/api";
import "./PopularStates.css";

function PopularStates() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    try {
      const response = await API.get("/states");
      setStates((response.data.states || []).slice(0, 6));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="popular-states">
        <div className="container">
          <h2>Loading States...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="popular-states">
      <div className="container">

        <div className="section-title">
          <span>EXPLORE INDIA</span>
          <h2>Popular States</h2>
        </div>

        <div className="states-grid">
          {states.map((state) => (
            <div className="state-card" key={state._id}>

              <img
                src={
                  state.image
                    ? `http://localhost:5000/${state.image}`
                    : "https://via.placeholder.com/400x250"
                }
                alt={state.name}
              />

              <div className="state-content">
                <h3>{state.name}</h3>

                <p>{state.description}</p>

                <Link to={`/states/${state._id}`}>
                  View Places →
                </Link>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default PopularStates;