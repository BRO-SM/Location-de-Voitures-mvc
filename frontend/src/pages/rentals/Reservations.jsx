import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/rentals", {
          headers: { Authorization: `Bearer ${token}` },
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

      const updatedReservation = reservations.find((r) => r.rental_id === id);

      setReservations((prev) =>
        prev.map((r) => (r.rental_id === id ? { ...r, status } : r))
      );

      if (updatedReservation) {
        alert(
          `✅ Statut mis à jour pour la réservation de ${updatedReservation.first_name} ${updatedReservation.last_name} : ${status}`
        );
      }
    } catch (err) {
      console.error("Erreur:", err);
      alert("❌Échec de la confirmation de la réservation. Veuillez confirmer les informations du client.");
      navigate("/clients");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      try {
        await axios.delete(`http://localhost:3000/api/rentals/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations((prev) => prev.filter((r) => r.rental_id !== id));
      } catch (err) {
        console.error("Erreur de suppression:", err);
        alert("Échec de la suppression de la réservation");
      }
    }
  };

  const statusOptions = [
    {
      value: "en attente",
      label: "En attente",
      badgeClass: "bg-warning text-dark",
    },
    {
      value: "confirmée",
      label: "Confirmée",
      badgeClass: "bg-success text-white",
    },
    { value: "annulée", label: "Annulée", badgeClass: "bg-danger text-white" },
    {
      value: "refusée",
      label: "Refusée",
      badgeClass: "bg-secondary text-white",
    },
    { value: "terminée", label: "Terminée", badgeClass: "bg-info text-dark" },
  ];

  
  const filteredReservations = reservations.filter(
    (res) =>
      (filter === "all" || res.status === filter) &&
      (
        res.first_name.toLowerCase().includes(search) ||
        res.last_name.toLowerCase().includes(search) ||
        res.make.toLowerCase().includes(search) ||
        res.model.toLowerCase().includes(search) ||
        (res.national_id && res.national_id.toLowerCase().includes(search))
      )
  );

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="alert alert-danger mx-auto mt-5 text-center"
        style={{ maxWidth: "600px" }}
      >
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
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 className="text-primary mb-0 d-flex align-items-center">
          <i className="bi bi-calendar-check me-2"></i>
          Gestion des Réservations
        </h1>

        <div className="d-flex gap-2 flex-wrap align-items-center">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Rechercher par nom client, voiture ou CNE"
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            style={{ maxWidth: "300px" }}
          />

          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: "200px" }}
          >
            <option value="all">Tous les statuts</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredReservations.length === 0 ? (
        <div
          className="alert alert-info mx-auto text-center"
          style={{ maxWidth: "600px" }}
        >
          <i className="bi bi-info-circle-fill me-2"></i>
          Aucune réservation trouvée
        </div>
      ) : (
        <div className="row g-4">
          {filteredReservations.map((res) => (
            <div key={res.rental_id} className="col-lg-4 col-md-6">
              <div className="card shadow-sm h-100 border-0">
                <div className="card-img-top ratio ratio-16x9">
                  <img
                    src={`http://localhost:3000/uploads/cars/${
                      res.img_url || "default-car.jpg"
                    }`}
                    className="object-fit-cover rounded-top"
                    alt={`${res.make} ${res.model}`}
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/600x400?text=Image+Non+Disponible";
                      e.target.className =
                        "object-fit-contain rounded-top p-2 w-100 h-100";
                    }}
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary">
                    {res.make} {res.model}{" "}
                    <small className="text-muted">({res.year})</small>
                  </h5>
                  <p className="mb-1">
                    <i className="bi bi-person me-2 text-primary"></i>
                    <strong>Client:</strong> {res.first_name} {res.last_name}
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-envelope me-2 text-primary"></i>
                    <strong>Email:</strong> {res.email}
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-telephone me-2 text-primary"></i>
                    <strong>Téléphone:</strong> {res.phone_number || "N/A"}
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-calendar-date me-2 text-primary"></i>
                    <strong>Période:</strong>{" "}
                    {new Date(res.start_date).toLocaleDateString()} →{" "}
                    {new Date(res.end_date).toLocaleDateString()}
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-clock me-2 text-primary"></i>
                    <strong>Jours:</strong>{" "}
                    {Math.ceil(
                      (new Date(res.end_date) - new Date(res.start_date)) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </p>
                  <p className="mb-3">
                    <i className="bi bi-currency-exchange me-2 text-primary"></i>
                    <strong>Total:</strong> {res.total_price} MAD
                  </p>

                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <select
                      className={`form-select form-select-sm ${
                        statusOptions.find((o) => o.value === res.status)
                          ?.badgeClass
                      }`}
                      value={res.status}
                      onChange={(e) =>
                        handleStatusChange(res.rental_id, e.target.value)
                      }
                      style={{ maxWidth: "150px" }}
                    >
                      {statusOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className={option.badgeClass}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(res.rental_id)}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Supprimer
                    </button>
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
