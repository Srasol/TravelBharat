import { useEffect, useState } from "react";
import API from "../../services/api";
import "./Categories.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await API.get("/categories");
      setCategories(response.data.categories || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="categories">
        <div className="container">
          <h2>Loading Categories...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="categories">
      <div className="container">

        <div className="section-title">
          <span>EXPLORE BY TYPE</span>
          <h2>Tourism Categories</h2>
          <p>
            Discover destinations based on your interests.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <div
              className="category-card"
              key={category._id}
            >
              <div className="category-icon">
                🌍
              </div>

              <h3>{category.name}</h3>

              <p>
                Explore beautiful {category.name.toLowerCase()} destinations.
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Categories;