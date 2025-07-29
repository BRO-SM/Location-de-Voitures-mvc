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
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [verifyingId, setVerifyingId] = useState(null);
  const [error, setError] = useState(null);

  // Fetch clients data
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:3000/api/users/clients");
      setClients(response.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Failed to load clients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Verify client
  const verifyClient = async (userId) => {
    try {
      setVerifyingId(userId);
      await axios.patch(`http://localhost:3000/api/users/verify/${userId}`);
      fetchClients();
    } catch (err) {
      console.error("Error verifying client:", err);
      setError("Failed to verify client.");
    } finally {
      setVerifyingId(null);
    }
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.CNE.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <User className="me-2" size={24} />
          Clients List
        </h2>
        
        <div className="search-box" style={{ width: "300px" }}>
          <div className="input-group">
            <span className="input-group-text">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Loader2 className="animate-spin me-2" size={24} />
          <span>Loading clients...</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">
          {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchClients}
          >
            Retry
          </button>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-5">
          {searchTerm ? (
            <>
              <Search size={48} className="mb-3 text-muted" />
              <h5>No clients found matching your search</h5>
              <button 
                className="btn btn-outline-primary mt-2"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </button>
            </>
          ) : (
            <>
              <Frown size={48} className="mb-3 text-muted" />
              <h5>No clients found</h5>
            </>
          )}
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredClients.map((client) => (
            <div key={client.user_id} className="col">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">
                      <User className="me-2" size={18} />
                      {client.first_name} {client.last_name}
                    </h5>
                    {client.is_verified ? (
                      <span className="badge bg-success">
                        <Verified size={14} className="me-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="badge bg-warning text-dark">
                        <XCircle size={14} className="me-1" />
                        Unverified
                      </span>
                    )}
                  </div>

                  <div className="client-details">
                    <p className="mb-2">
                      <Mail className="me-2" size={16} />
                      {client.email}
                    </p>

                    <p className="mb-2">
                      <Phone className="me-2" size={16} />
                      {client.phone_number || "N/A"}
                    </p>

                    <p className="mb-2">
                      <BadgeInfo className="me-2" size={16} />
                      CNE: {client.CNE || "N/A"}
                    </p>

                    <p className="mb-2">
                      <Shield className="me-2" size={16} />
                      Role: <strong>{client.role}</strong>
                    </p>

                    <p className="mb-3 text-muted">
                      <CalendarClock className="me-2" size={16} />
                      Last login:{" "}
                      {client.last_login
                        ? new Date(client.last_login).toLocaleDateString()
                        : "Never"}
                    </p>
                  </div>

                  <div className="d-flex gap-2">
                    {!client.is_verified && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => verifyClient(client.user_id)}
                        disabled={verifyingId === client.user_id}
                      >
                        {verifyingId === client.user_id ? (
                          <>
                            <Loader2 className="animate-spin me-1" size={14} />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={14} className="me-1" />
                            Verify
                          </>
                        )}
                      </button>
                    )}
                    <NavLink
                      to={`/users/clients/${client.user_id}`}
                      className="btn btn-sm btn-primary"
                    >
                      <Edit size={14} className="me-1" />
                      Edit
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