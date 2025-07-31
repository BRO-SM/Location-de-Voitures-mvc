// src/pages/rentals/CreateRental.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CreateRental() {
  const { car_id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [dates, setDates] = useState({ start_date: "", end_date: "" });
  const [totalPrice, setTotalPrice] = useState(0);
  const [previousRentals, setPreviousRentals] = useState([]);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // جلب بيانات السيارة والحجوزات السابقة
  useEffect(() => {
  const fetchCarAndRentals = async () => {
    try {
      const token = localStorage.getItem("token");

      const [carRes, rentalsRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/cars/${car_id}`),
        axios.get(`http://localhost:3000/api/rentals/car/${car_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setCar(carRes.data);
      setPreviousRentals(rentalsRes.data);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
      setError("Erreur de chargement des données. Veuillez réessayer.");
    }
  };

  fetchCarAndRentals();
}, [car_id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...dates, [name]: value };
    setDates(updated);
    setError("");

    if (updated.start_date && updated.end_date) {
      const start = new Date(updated.start_date);
      const end = new Date(updated.end_date);
      const days = (end - start) / (1000 * 60 * 60 * 24);

      if (days >= 1 && car) {
        setTotalPrice(days * car.price_per_day);
      } else {
        setTotalPrice(0);
      }
    }
  };

  // التحقق من التداخل مع الحجوزات السابقة
  const isOverlapping = () => {
    const start = new Date(dates.start_date);
    const end = new Date(dates.end_date);

    return previousRentals.some((rental) => {
      const prevStart = new Date(rental.start_date);
      const prevEnd = new Date(rental.end_date);

      // يجب أن يكون هناك يوم على الأقل فارق بين الحجزين
      return (
        (start <= prevEnd && end >= prevStart) || // تداخل في التواريخ
        Math.abs((start - prevEnd) / (1000 * 60 * 60 * 24)) < 1 || 
        Math.abs((prevStart - end) / (1000 * 60 * 60 * 24)) < 1
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isOverlapping()) {
      setError("⚠️ La période sélectionnée est en conflit avec une réservation existante. Laissez au moins un jour entre deux réservations.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/api/rentals/creer",
        {
          car_id,
          start_date: dates.start_date,
          end_date: dates.end_date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data.message + `\nPrix total: ${res.data.total_price} DH`);
      navigate("/cars");
    } catch (error) {
      alert(
        error?.response?.data?.message ||
        "Une erreur est survenue lors de la réservation."
      );
    }
  };

  if (!car) return <p className="text-center mt-5">Chargement de la voiture...</p>;

  return (
    <div className="container mt-5 p-4 shadow rounded bg-light">
      <h2 className="mb-4 text-center">
        Réserver : <span className="text-primary">{car.make} {car.model}</span>
      </h2>

      {/* عرض تواريخ الحجوزات السابقة */}
      {previousRentals.length > 0 && (
        <div className="alert alert-warning">
          <h6>Réservations précédentes :</h6>
          <ul className="mb-0">
            {previousRentals.map((r) => (
              <li key={r.rental_id}>
                {new Date(r.start_date).toLocaleDateString()} -{" "}
                {new Date(r.end_date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* رسالة خطأ إذا وُجد تداخل */}
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="start_date" className="form-label">Date de début</label>
            <input
              type="date"
              name="start_date"
              id="start_date"
              className="form-control"
              value={dates.start_date}
              onChange={handleChange}
              min={today}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="end_date" className="form-label">Date de fin</label>
            <input
              type="date"
              name="end_date"
              id="end_date"
              className="form-control"
              value={dates.end_date}
              onChange={handleChange}
              min={dates.start_date || today}
              required
            />
          </div>
        </div>

        {totalPrice > 0 && (
          <div className="alert alert-success text-center">
            <strong>Prix total : {totalPrice} DH</strong>
          </div>
        )}

        <div className="text-center">
          <button type="submit" className="btn btn-primary px-5">
            Confirmer la réservation
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateRental;
