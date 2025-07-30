import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  CalendarClock,
  BadgeInfo,
  Search,
  Frown,
  Loader2,
  Verified,
  Edit,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [verifyingId, setVerifyingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:3000/api/users/clients");
      setClients(response.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Échec du chargement des clients. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const verifyClient = async (userId) => {
    try {
      setVerifyingId(userId);
      await axios.patch(`http://localhost:3000/api/users/verify/${userId}`);
      setSuccess("Client vérifié avec succès !");
      setTimeout(() => setSuccess(null), 3000);
      fetchClients();
    } catch (err) {
      console.error("Erreur de vérification:", err);
      setError("Échec de la vérification du client.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setVerifyingId(null);
    }
  };

  const normalize = (str) => str?.toLowerCase().trim();

  const filteredClients = clients.filter((client) => {
    const search = normalize(searchTerm);
    return (
      normalize(`${client.first_name} ${client.last_name}`).includes(search) ||
      normalize(client.first_name).includes(search) ||
      normalize(client.last_name).includes(search) ||
      normalize(client.email).includes(search) ||
      (client.CNE && normalize(client.CNE).includes(search))
    );
  });

  return (
    <div className="container py-5">
      {/* Header + Search */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4">
        <h2 className="mb-0 d-flex align-items-center">
          <User className="me-2" size={24} />
          <span>Gestion des Clients</span>
        </h2>

        <div className="d-flex gap-2 w-100 w-md-auto">
          <div className="input-group flex-nowrap" style={{ minWidth: "250px" }}>
            <span className="input-group-text bg-white">
              <Search size={18} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Rechercher par nom, email ou CNE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn btn-outline-secondary d-flex align-items-center"
            onClick={fetchClients}
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4">
          <AlertCircle className="me-2" size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success d-flex align-items-center mb-4">
          <CheckCircle className="me-2" size={18} />
          {success}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <Loader2 className="animate-spin me-2" size={24} />
          <span>Chargement des clients...</span>
        </div>
      )}

      {/* Empty */}
      {!loading && filteredClients.length === 0 && (
        <div className="text-center py-5">
          {searchTerm ? (
            <>
              <Search size={48} className="mb-3 text-muted" />
              <h5>Aucun client trouvé</h5>
              <p className="text-muted">Aucun résultat pour "{searchTerm}"</p>
              <button
                className="btn btn-outline-primary mt-2"
                onClick={() => setSearchTerm("")}
              >
                Effacer la recherche
              </button>
            </>
          ) : (
            <>
              <Frown size={48} className="mb-3 text-muted" />
              <h5>Aucun client disponible</h5>
              <p className="text-muted">Aucun client n'est encore enregistré.</p>
            </>
          )}
        </div>
      )}

      {/* Clients Grid */}
      {!loading && filteredClients.length > 0 && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredClients.map((client) => (
            <div key={client.user_id} className="col">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0 d-flex align-items-center">
                      <User className="me-2" size={18} />
                      {client.first_name} {client.last_name}
                    </h5>
                    <span className={`badge ${client.is_verified ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {client.is_verified ? (
                        <Verified size={14} className="me-1" />
                      ) : (
                        <XCircle size={14} className="me-1" />
                      )}
                      {client.is_verified ? 'Vérifié' : 'Non vérifié'}
                    </span>
                  </div>

                  <div className="client-details">
                    <div className="d-flex align-items-center mb-2">
                      <Mail className="me-2 text-muted" size={16} />
                      <span>{client.email}</span>
                    </div>

                    <div className="d-flex align-items-center mb-2">
                      <Phone className="me-2 text-muted" size={16} />
                      <span>{client.phone_number || "N/A"}</span>
                    </div>

                    <div className="d-flex align-items-center mb-2">
                      <BadgeInfo className="me-2 text-muted" size={16} />
                      <span>CNE: {client.CNE || "N/A"}</span>
                    </div>

                    <div className="d-flex align-items-center mb-2">
                      <Shield className="me-2 text-muted" size={16} />
                      <span>Rôle: <strong>{client.role}</strong></span>
                    </div>

                    <div className="d-flex align-items-center mb-3 text-muted">
                      <CalendarClock className="me-2" size={16} />
                      <small>
                        Dernière connexion:{" "}
                        {client.last_login
                          ? new Date(client.last_login).toLocaleDateString()
                          : "Jamais"}
                      </small>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    {!client.is_verified && (
                      <button
                        className="btn btn-sm btn-success d-flex align-items-center"
                        onClick={() => verifyClient(client.user_id)}
                        disabled={verifyingId === client.user_id}
                      >
                        {verifyingId === client.user_id ? (
                          <>
                            <Loader2 className="animate-spin me-1" size={14} />
                            En cours...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={14} className="me-1" />
                            Vérifier
                          </>
                        )}
                      </button>
                    )}
                    <NavLink
                      to={`/users/clients/${client.user_id}`}
                      className="btn btn-sm btn-primary d-flex align-items-center"
                    >
                      <Edit size={14} className="me-1" />
                      Modifier
                    </NavLink>
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
