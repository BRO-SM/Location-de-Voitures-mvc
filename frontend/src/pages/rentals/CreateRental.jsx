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

  useEffect(() => {
    const fetchCar = async () => {
      const res = await axios.get(`http://localhost:3000/api/cars`);
      const foundCar = res.data.find((c) => c.car_id === parseInt(car_id));
      setCar(foundCar);
    };
    fetchCar();
  }, [car_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...dates, [name]: value };
    setDates(updated);

    // Auto-calculate price
    if (updated.start_date && updated.end_date) {
      const days =
        (new Date(updated.end_date) - new Date(updated.start_date)) /
        (1000 * 60 * 60 * 24);
      if (days >= 1) {
        setTotalPrice(days * car.price_per_day);
      } else {
        setTotalPrice(0);
      }
    }
  };

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
      alert(res.data.message + `\nTotal: ${res.data.total_price} DH`);
      navigate("/cars");
    } catch (error) {
      alert(
        error?.response?.data?.message || "Erreur lors de la réservation."
      );
    }
  };

  if (!car) return <p>Chargement...</p>;

  return (
    <div className="container mt-5">
      <h2>Réserver la voiture : {car.make} {car.model}</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label>Date de début</label>
          <input
            type="date"
            name="start_date"
            className="form-control"
            value={dates.start_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Date de fin</label>
          <input
            type="date"
            name="end_date"
            className="form-control"
            value={dates.end_date}
            onChange={handleChange}
            required
          />
        </div>

        {totalPrice > 0 && (
          <p className="alert alert-success">
            Prix total: <strong>{totalPrice} DH</strong>
          </p>
        )}

        <button type="submit" className="btn btn-primary">
          Réserver
        </button>
      </form>
    </div>
  );
}

export default CreateRental;
