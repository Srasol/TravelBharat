import { Link } from "react-router-dom";
import { FaArrowLeft, FaCompass } from "react-icons/fa";

function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "150px 20px 70px",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        background: "#f5f7fa",
      }}
    >
      <section
        style={{
          width: "min(100%, 620px)",
          padding: "50px 30px",
          borderRadius: "28px",
          background: "#ffffff",
          boxShadow: "0 22px 60px rgba(20, 44, 74, 0.1)",
        }}
      >
        <div
          style={{
            width: "75px",
            height: "75px",
            margin: "0 auto 22px",
            display: "grid",
            placeItems: "center",
            borderRadius: "22px",
            color: "#ffffff",
            background: "linear-gradient(135deg, #ff9933, #f36c21)",
            fontSize: "1.8rem",
          }}
        >
          <FaCompass />
        </div>

        <h1
          style={{
            marginBottom: "12px",
            color: "#10233f",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: "800",
          }}
        >
          404
        </h1>

        <h2 style={{ color: "#10233f", fontWeight: "800" }}>
          Page not found
        </h2>

        <p
          style={{
            maxWidth: "480px",
            margin: "15px auto 28px",
            color: "#718096",
            lineHeight: "1.8",
          }}
        >
          The page you are looking for does not exist or may have been moved.
        </p>

        <Link
          to="/"
          style={{
            padding: "14px 20px",
            display: "inline-flex",
            alignItems: "center",
            gap: "9px",
            borderRadius: "13px",
            color: "#ffffff",
            background: "linear-gradient(135deg, #ff9933, #f36c21)",
            fontWeight: "800",
          }}
        >
          <FaArrowLeft />
          Return Home
        </Link>
      </section>
    </main>
  );
}

export default NotFound;