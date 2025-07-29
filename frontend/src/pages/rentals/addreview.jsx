// frontend/src/pages/AddReview.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddReview() {
  const { rentalId } = useParams(); // نجيب الـ rentalId من الرابط
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // تحقق بسيط
    if (rating < 1 || rating > 5) {
      setError("La note doit être entre 1 et 5.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vous devez être connecté pour ajouter une critique.");
        setLoading(false);
        return;
      }

      // إرسال مراجعة للـ backend
      await axios.post(
        "http://localhost:3000/api/addreview",
        { rating, comment, rentalId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // بعد النجاح، رجوع لصفحة الحجوزات مثلاً
      navigate("/mybookings");
    } catch (err) {
      setError("Erreur lors de l'envoi de la critique.");
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h2>Ajouter une critique pour la réservation #{rentalId}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="rating" className="form-label">Note (1-5)</label>
          <input
            type="number"
            id="rating"
            className="form-control"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="comment" className="form-label">Commentaire</label>
          <textarea
            id="comment"
            className="form-control"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Votre avis ici..."
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer la critique"}
        </button>
      </form>
    </div>
  );
}
