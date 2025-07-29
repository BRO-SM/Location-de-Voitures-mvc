import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Pencil, Trash2, Plus } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [stats, setStats] = useState({ totalCars: 0, totalUsers: 0, totalBookings: 0 });

  useEffect(() => {
    fetchCars();
    fetchStats();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/cars");
      setCars(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des voitures:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/admin/stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    }
  };

  const handleDelete = async (car_id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette voiture ?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/cars/${car_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchCars();
    } catch (error) {
      console.error("Erreur de suppression:", error);
    }
  };

  if (!user || user.role !== "admin") {
    return <div className="text-danger text-center mt-5">Accès refusé</div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Dashboard Administrateur</h2>

      {/* Statistiques */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5>Total Voitures</h5>
              <p>{stats.totalCars}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5>Total Utilisateurs</h5>
              <p>{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5>Total Réservations</h5>
              <p>{stats.totalBookings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des voitures */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Voitures Disponibles</h4>
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/add-car")}
        >
          <Plus className="me-1" size={18} /> Ajouter Voiture
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Image</th>
            <th>Marque</th>
            <th>Modèle</th>
            <th>Statut</th>
            <th>Prix/Jour</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.car_id}>
              <td>
                <img
                  src={`http://localhost:3000/uploads/cars/${car.images?.[0]?.img_url}`}
                  alt="car"
                  width="80"
                />
              </td>
              <td>{car.make}</td>
              <td>{car.model}</td>
              <td>
                <span
                  className={`badge ${
                    car.status === "disponible" ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {car.status}
                </span>
              </td>
              <td>{car.price_per_day} MAD</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => navigate(`/UpdateCar/${car.car_id}`)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(car.car_id)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
