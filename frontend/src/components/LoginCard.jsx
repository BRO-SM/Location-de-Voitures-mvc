import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; //
import Switgreeting from "./Switalert/switalert";

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/api/users/connexion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        const decoded = jwtDecode(data.token);
        console.log(decoded.exp);

        const role = decoded.role;
        const first_name = decoded.first_name;

        if (role === "admin") {
          setGreeting("Bienvenue admin " + first_name);
          setTimeout(() => navigate("/admin"), 1500);

        } else if (role === "client") {
          setGreeting("Bienvenue " + first_name);
          setTimeout(() => navigate("/cars"), 1500);
        }
      } else {
        setMessage(data.message || "Connexion echouée");
      }
    } catch (error) {
      console.error("Error réseau ou serveur", error);
      setMessage("Erreur réseau ou serveur");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      {greeting && <Switgreeting title={greeting} />} 
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center">Connexion</h2>
              {message && <p className="text-center">{message}</p>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-success px-4">
                    Se connecter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
