import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, StarHalf, StarOff } from "lucide-react"; // يمكنك استبدالها بـ أي مكتبة أيقونات أخرى مثل react-icons
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddReview() {
  const { rentalId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (rating < 1 || rating > 5) {
      setError("Veuillez sélectionner une note entre 1 et 5 étoiles.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous devez être connecté pour ajouter une critique.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:3000/api/rentals/addreview",
        {
          rating,
          comment,
          rentalId: Number(rentalId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/my-bookings");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Erreur lors de l'envoi de la critique."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={32}
          className={`me-1 cursor-pointer ${
            (hoveredRating || rating) >= i ? "text-warning" : "text-muted"
          }`}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setRating(i)}
        />
      );
    }
    return stars;
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="mb-4">Ajouter une critique pour la réservation #</h3>

          {error && (
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
              {error}
              <button className="btn-close" onClick={() => setError(null)} />
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Rating */}
            <div className="mb-3">
              <label className="form-label fw-bold">Note :</label>
              <div>{renderStars()}</div>
            </div>

            {/* Comment */}
            <div className="mb-3">
              <label htmlFor="comment" className="form-label fw-bold">
                Commentaire :
              </label>
              <textarea
                id="comment"
                className="form-control"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Votre avis ici..."
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary d-flex align-items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Envoi...
                </>
              ) : (
                "Envoyer la critique"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
