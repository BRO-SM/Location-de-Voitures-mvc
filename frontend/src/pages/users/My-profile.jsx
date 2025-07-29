import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/useAuth";

export default function MyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/users/${user.user_id}`
        );
        setProfile(res.data);
        setError(null);
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: "300px"}}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
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

  if (!profile) return (
    <div className="alert alert-warning text-center mx-auto mt-5" style={{maxWidth: "500px"}}>
      No profile information available.
    </div>
  );

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg rounded-4 overflow-hidden border-0">
            {/* Header with gradient background */}
            <div className="card-header bg-gradient-primary text-white py-4">
              <h3 className="card-title text-center mb-0">
                <i className="bi bi-person-circle me-2"></i>
                My Profile
              </h3>
            </div>
            
            {/* Profile picture section */}
            <div className="text-center mt-3">
              <div className="avatar-lg mx-auto">
                <div className="rounded-circle bg-light d-flex justify-content-center align-items-center" 
                     style={{width: "120px", height: "120px", margin: "-60px auto 20px", border: "5px solid white"}}>
                  <span className="display-4 text-muted">
                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Profile details */}
            <div className="card-body px-4 py-3">
              <div className="row g-3">
                <ProfileField label="First Name" value={profile.first_name} icon="bi-person" />
                <ProfileField label="Last Name" value={profile.last_name} icon="bi-person" />
                <ProfileField label="Phone" value={profile.phone_number} icon="bi-telephone" />
                <ProfileField label="Email" value={profile.email} icon="bi-envelope" />
                <ProfileField label="CNE" value={profile.CNE} icon="bi-card-text" />
              </div>
              
              {/* Edit button */}
              <div className="text-center mt-4">
                <button className="btn btn-primary px-4">
                  <i className="bi bi-pencil-square me-2"></i>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable profile field component
function ProfileField({ label, value, icon }) {
  return (
    <div className="col-md-6">
      <div className="d-flex align-items-center p-3 bg-light rounded-3">
        <i className={`bi ${icon} fs-4 text-primary me-3`}></i>
        <div>
          <div className="text-muted small">{label}</div>
          <div className="fw-bold">{value || '-'}</div>
        </div>
      </div>
    </div>
  );
}