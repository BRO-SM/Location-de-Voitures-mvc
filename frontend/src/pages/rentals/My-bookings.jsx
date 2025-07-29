import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CalendarDays, CarFront, Clock } from "lucide-react";
import { NavLink } from "react-router-dom";
import { API_BASE_URL } from "../../config";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = jwtDecode(token);
      const userId = decoded.user_id;

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/rentals/my-bookings/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
  }, []);

  const handleDeleteBooking = async (rentalId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/rentals/${rentalId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.rental_id !== rentalId)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression de la reservation", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmée":
        return "badge bg-success";
      case "en attente":
        return "badge bg-warning text-dark";
      case "annulée":
        return "badge bg-secondary";
      case "refusée":
        return "badge bg-danger";
      case "terminée":
        return "badge bg-info text-dark";
      default:
        return "badge bg-light text-dark";
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Chargement des réservations...</p>;
  }

  if (bookings.length === 0) {
    return (
      <p className="text-center mt-10 text-muted">
        Aucune réservation trouvée.
      </p>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Mes Réservations</h2>
      <div className="row">
        {bookings.map((booking) => (
          <div key={booking.rental_id} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm h-100 border-0">
              {booking.image_url && (
                <img
                  src={booking.image_url}
                  alt={`${booking.car_make} ${booking.car_model}`}
                  className="card-img-top"
                  style={{
                    height: "180px",
                    objectFit: "cover",
                    borderTopLeftRadius: "0.375rem",
                    borderTopRightRadius: "0.375rem",
                  }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-2">
                  {booking.car_make} {booking.car_model}
                </h5>
                <p className="mb-1 text-muted small">
                  <CalendarDays className="me-2 inline" size={16} />
                  {new Date(booking.start_date).toLocaleDateString(
                    "fr-FR"
                  )} → {new Date(booking.end_date).toLocaleDateString("fr-FR")}
                </p>
                <p className="mb-1 text-muted small">
                  <Clock className="me-2 inline" size={16} />
                  Statut:{" "}
                  <span className={getStatusColor(booking.status)}>
                    {booking.status}
                  </span>
                </p>
                <p className="mb-1 text-muted small">
                  <CarFront className="me-2 inline" size={16} />
                  Prix: <strong>{booking.total_price} MAD</strong>
                </p>
                <p className="text-muted small">
                  Paiement: {booking.payment_status}
                </p>

                <div className="mt-auto d-flex justify-content-between gap-2">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDeleteBooking(booking.rental_id)}
                  >
                    Supprimer
                  </button>
                  {booking.status === "en attente" && (
                    <NavLink
                      to={`/updatebooking/${booking.rental_id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Modifier
                    </NavLink>
                  )}
                  {booking.status === "confirmée" && (
                    <NavLink
                      to={`/addreview/${booking.rental_id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Ajouter une critique
                    </NavLink>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
