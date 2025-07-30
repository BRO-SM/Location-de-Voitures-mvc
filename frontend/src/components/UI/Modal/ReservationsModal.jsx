// src/pages/rentals/ReservationsModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/useAuth";

export default function ReservationsModal({ show, handleClose }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!show) return; // لا تجلب البيانات إلا إذا المودال مفتوح

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `http://localhost:3000/api/rentals/my-bookings/${user.user_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des réservations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [show, user]);

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
      onClick={handleClose}
    >
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Mes Réservations</h5>
            <button type="button" className="btn-close" onClick={handleClose} />
          </div>
          <div className="modal-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
            {loading ? (
              <p>Chargement...</p>
            ) : bookings.length === 0 ? (
              <p>Aucune réservation trouvée.</p>
            ) : (
              bookings.map((booking) => (
                <div key={booking.rental_id} className="mb-3 border-bottom pb-2">
                  <strong>{booking.car_make} {booking.car_model}</strong>
                  <br />
                  Du {new Date(booking.start_date).toLocaleDateString("fr-FR")} au {new Date(booking.end_date).toLocaleDateString("fr-FR")}
                  <br />
                  Statut: <span className="badge bg-info">{booking.status}</span>
                </div>
              ))
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
