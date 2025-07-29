// src/pages/cars/UpdateCar.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function UpdateCar() {
  const { id } = useParams(); // ID de la voiture à modifier
  const [car, setCar] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/cars/${id}`);
        setCar(res.data.car); // Charger les données de la voiture
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        alert("❌ Impossible de charger la voiture");
      }
    };

    fetchCar();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:3000/api/cars/update/${id}`, car, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Voiture mise à jour avec succès");
      navigate("/cars");
    } catch (err) {
      console.error(err);
      alert("❌ Échec de la mise à jour");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!car) return <div className="text-center py-5">Chargement...</div>;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-warning text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">
                  <FontAwesomeIcon icon={faCar} className="me-2" />
                  Modifier la voiture
                </h3>
                <button 
                  className="btn btn-light btn-sm"
                  onClick={() => navigate("/cars")}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                  Retour
                </button>
              </div>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Champs réutilisés de AddCar */}
                  <div className="col-md-6">
                    <label className="form-label">Marque*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="make"
                      value={car.make}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Modèle*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="model"
                      value={car.model}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Carburant*</label>
                    <select
                      className="form-select"
                      name="fuel"
                      value={car.fuel}
                      onChange={handleChange}
                      required
                    >
                      <option value="Essence">Essence</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybride">Hybride</option>
                      <option value="Electrique">Electrique</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Année*</label>
                    <input
                      type="number"
                      className="form-control"
                      name="year"
                      value={car.year}
                      onChange={handleChange}
                      min="2000"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Nombre de places*</label>
                    <select
                      className="form-select"
                      name="seats"
                      value={car.seats}
                      onChange={handleChange}
                      required
                    >
                      {[2, 4, 5, 7, 9].map(num => (
                        <option key={num} value={num}>{num} places</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Couleur</label>
                    <input
                      type="text"
                      className="form-control"
                      name="color"
                      value={car.color}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Immatriculation*</label>
                    <input
                      type="text"
                      className="form-control text-uppercase"
                      name="license_plate"
                      value={car.license_plate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Prix/jour (Dh)*</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        name="price_per_day"
                        value={car.price_per_day}
                        onChange={handleChange}
                        required
                      />
                      <span className="input-group-text">Dh</span>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Transmission*</label>
                    <select
                      className="form-select"
                      name="transmission"
                      value={car.transmission}
                      onChange={handleChange}
                      required
                    >
                      <option value="Manuelle">Manuelle</option>
                      <option value="Automatique">Automatique</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={car.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12 mt-4">
                    <button 
                      type="submit"
                      className="btn btn-warning px-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      ) : (
                        <FontAwesomeIcon icon={faSave} className="me-2" />
                      )}
                      {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
