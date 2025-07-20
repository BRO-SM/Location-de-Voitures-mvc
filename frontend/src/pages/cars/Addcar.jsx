import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function AddCar() {
  const [car, setCar] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    license_plate: "",
    price_per_day: "",
    description: "",
    seats: 5,
    transmission: "Manuelle",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await axios.post("http://localhost:3000/api/cars", car);
      if (res.data) {
        alert(`La voiture ${car.make} ${car.model} a été ajoutée avec succès`);
        navigate("/cars");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      alert("Une erreur est survenue lors de l'ajout de la voiture");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">
                  <FontAwesomeIcon icon={faCar} className="me-2" />
                  Ajouter une nouvelle voiture
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
                  {/* Marque et Modèle */}
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

                  {/* Année et Couleur */}
                  <div className="col-md-4">
                    <label className="form-label">Année*</label>
                    <input
                      type="number"
                      className="form-control"
                      name="year"
                      min="2000"
                      max={new Date().getFullYear()}
                      value={car.year}
                      onChange={handleChange}
                      required
                    />
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

                  {/* Prix et Places */}
                  <div className="col-md-4">
                    <label className="form-label">Prix/jour (Dh)*</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        name="price_per_day"
                        min="0"
                        step="100"
                        value={car.price_per_day}
                        onChange={handleChange}
                        required
                      />
                      <span className="input-group-text">Dh</span>
                    </div>
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

                  {/* Description */}
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

                  {/* Bouton de soumission */}
                  <div className="col-12 mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary px-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      ) : (
                        <FontAwesomeIcon icon={faSave} className="me-2" />
                      )}
                      {isSubmitting ? "En cours..." : "Enregistrer"}
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