import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/users/connexion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password ,}),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the token in localStorage
        localStorage.setItem("token", data.token);
        setMessage("✅ Connexion réussie !");
        // هنا يمكنك إعادة التوجيه أو أي فعل آخر بعد تسجيل الدخول
        navigate("/admin");
      } else {
        setMessage(data.message || "Erreur lors de la connexion");
      }
    } catch (error) {
      setMessage("Erreur réseau ou serveur");
    }
  };

  return (
    <div className="container mt-5 mb-5">
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
