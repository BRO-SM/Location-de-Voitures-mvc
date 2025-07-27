import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CalendarDays, CarFront, Clock } from "lucide-react";

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
          `http://localhost:3000/api/rentals/my-bookings/${userId}`,
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

  if (loading) {
    return <p className="text-center mt-10">Chargement des réservations...</p>;
  }

  if (bookings.length === 0) {
    return <p className="text-center mt-10 text-muted">Aucune réservation trouvée.</p>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Mes Réservations</h2>
      <div className="row">
        {bookings.map((booking) => (
          <div key={booking.rental_id} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{booking.car_make} {booking.car_model}</h5>
                <p>
                  <CalendarDays className="me-2 inline" />
                  {booking.start_date} → {booking.end_date}
                </p>
                <p>
                  <Clock className="me-2 inline" />
                  Statut: <strong>{booking.status}</strong>
                </p>
                <p>
                  <CarFront className="me-2 inline" />
                  Prix: {booking.total_price} MAD
                </p>
                <p className="text-muted">
                  Paiement: {booking.payment_status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
