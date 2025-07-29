import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/rentals", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReservations(response.data);
        setError(null);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Échec du chargement des réservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [token]);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:3000/api/rentals/${id}/etat`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservations(prev => 
        prev.map(r => r.rental_id === id ? { ...r, status } : r)
      );
    } catch (err) {
      console.error("Erreur:", err);
      alert("Échec de la mise à jour du statut");
    }
  };

  const statusOptions = [
    { value: "en attente", label: "En attente", badgeClass: "bg-warning text-dark" },
    { value: "confirmée", label: "Confirmée", badgeClass: "bg-success text-white" },
    { value: "annulée", label: "Annulée", badgeClass: "bg-danger text-white" },
    { value: "refusée", label: "Refusée", badgeClass: "bg-secondary text-white" },
    { value: "terminée", label: "Terminée", badgeClass: "bg-info text-dark" }
  ];

  const filteredReservations = reservations.filter(res => 
    filter === "all" || res.status === filter
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mx-auto mt-5 text-center" style={{ maxWidth: "600px" }}>
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
        <button 
          className="btn btn-sm btn-outline-danger ms-3"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary mb-0">
          <i className="bi bi-calendar-check me-2"></i>
          Gestion des Réservations
        </h1>
        
        <div className="d-flex gap-2">
          <select 
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: "200px" }}
          >
            <option value="all">Tous les statuts</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredReservations.length === 0 ? (
        <div className="alert alert-info mx-auto text-center" style={{ maxWidth: "600px" }}>
          <i className="bi bi-info-circle-fill me-2"></i>
          Aucune réservation trouvée
        </div>
      ) : (
        <div className="row g-4">
          {filteredReservations.map(res => (
            <div key={res.rental_id} className="col-md-12">
              <div className="card shadow-sm h-100">
                <div className="row g-0 h-100">
                  <div className="col-md-4">
                    <img 
                      src={`http://localhost:3000/uploads/${res.img_url || 'default-car.jpg'}`}
                      className="img-fluid rounded-start h-100 object-fit-cover"
                      alt={`${res.make} ${res.model}`}
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/600x400?text=Image+Non+Disponible';
                        e.target.className = "img-fluid rounded-start h-100 object-fit-contain p-2";
                      }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body h-100 d-flex flex-column">
                      <div className="flex-grow-1">
                        <h5 className="card-title">
                          {res.make} {res.model} <small className="text-muted">({res.year})</small>
                        </h5>
                        
                        <div className="row mt-3">
                          <div className="col-md-6">
                            <p className="mb-2">
                              <i className="bi bi-person me-2 text-primary"></i>
                              <strong>Client:</strong> {res.first_name} {res.last_name}
                            </p>
                            <p className="mb-2">
                              <i className="bi bi-envelope me-2 text-primary"></i>
                              <strong>Email:</strong> {res.email}
                            </p>
                            <p className="mb-2">
                              <i className="bi bi-telephone me-2 text-primary"></i>
                              <strong>Téléphone:</strong> {res.phone_number || 'N/A'}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p className="mb-2">
                              <i className="bi bi-calendar-date me-2 text-primary"></i>
                              <strong>Période:</strong> {new Date(res.start_date).toLocaleDateString()} → {new Date(res.end_date).toLocaleDateString()}
                            </p>
                           <p className="mb-2">
  <i className="bi bi-clock me-2 text-primary"></i>
  <strong>Jours:</strong> {Math.ceil((new Date(res.end_date) - new Date(res.start_date)) / (1000 * 60 * 60 * 24))}
</p>
                            <p className="mb-2">
                              <i className="bi bi-currency-exchange me-2 text-primary"></i>
                              <strong>Total:</strong> {res.total_price} MAD
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="d-flex gap-2 align-items-center">
                          <select
                            className={`form-select ${statusOptions.find(o => o.value === res.status)?.badgeClass}`}
                            value={res.status}
                            onChange={(e) => handleStatusChange(res.rental_id, e.target.value)}
                            style={{ width: "180px" }}
                          >
                            {statusOptions.map(option => (
                              <option 
                                key={option.value} 
                                value={option.value}
                                className={option.badgeClass}
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                          
                          <span className={`badge ${statusOptions.find(o => o.value === res.status)?.badgeClass}`}>
                            {statusOptions.find(o => o.value === res.status)?.label}
                          </span>
                        </div>
                        
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => navigate(`/reservations/${res.rental_id}`)}
                        >
                          <i className="bi bi-eye me-2"></i>
                          Détails
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}