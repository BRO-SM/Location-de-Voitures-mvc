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

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Fetch car data from API based on car_id
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/cars");
        const foundCar = res.data.find((c) => c.car_id === parseInt(car_id));
        setCar(foundCar);
      } catch (err) {
        console.error("Erreur lors du chargement de la voiture :", err);
      }
    };
    fetchCar();
  }, [car_id]);

  // Handle date changes and update total price
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...dates, [name]: value };
    setDates(updated);

    // Calculate rental duration and total price
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

  // Submit the rental to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
              min={today} // Prevent past dates
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
              min={dates.start_date || today} // End date must be after or equal to start
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
