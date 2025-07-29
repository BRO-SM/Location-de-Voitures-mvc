import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/useAuth";

export default function UpdateClientsInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    CNE: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/users/${id}`);
        setFormData(res.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement du client :", err);
        setError("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`http://localhost:3000/api/users/update/${id}`, formData);
      setSuccess(true);
      setTimeout(() => {
        if (user?.role === "admin") {
          navigate("/clients");
        } else {
          navigate("/cars");
        }
      }, 1500);
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      setError(err.response?.data?.message || "Échec de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !success) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: "300px"}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="alert alert-danger text-center mx-auto mt-5" style={{maxWidth: "500px"}}>
        {error}
        <button 
          className="btn btn-sm btn-outline-danger ms-3"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg rounded-4 border-0">
            <div className="card-header bg-gradient-primary text-primary py-3">
              <h2 className="card-title text-center mb-0">
                <i className="bi bi-person-gear me-2"></i>
                Modifier les informations
              </h2>
            </div>

            {success ? (
              <div className="card-body text-center py-5">
                <div className="alert alert-success">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Informations mises à jour avec succès !
                </div>
                <div className="spinner-border text-primary mt-3" role="status">
                  <span className="visually-hidden">Redirecting...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card-body p-4">
                <div className="row g-3">
                  <FormField
                    label="Prénom"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    icon="bi-person"
                  />
                  <FormField
                    label="Nom"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    icon="bi-person"
                  />
                  <FormField
                    label="Téléphone"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    icon="bi-telephone"
                  />
                  <FormField
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    icon="bi-envelope"
                  />
                  <FormField
                    label="CNE"
                    name="CNE"
                    value={formData.CNE}
                    onChange={handleChange}
                    required
                    icon="bi-card-text"
                  />
                  <FormField
                    label="Mot de passe (laisser vide pour ne pas changer)"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    icon="bi-lock"
                  />
                </div>

                <div className="d-grid gap-2 mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <span>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enregistrement...
                      </span>
                    ) : (
                      <span>
                        <i className="bi bi-save me-2"></i>
                        Enregistrer les modifications
                      </span>
                    )}
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Retour
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable form field component
function FormField({ label, name, value, onChange, type = "text", required = false, icon }) {
  return (
    <div className="col-md-12">
      <div className="form-group">
        <label className="form-label">
          <i className={`bi ${icon} me-2 text-primary`}></i>
          {label}
        </label>
        <input
          type={type}
          className="form-control"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
    </div>
  );
}