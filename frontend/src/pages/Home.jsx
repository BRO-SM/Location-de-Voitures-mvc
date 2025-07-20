export default function Home() {
  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body text-center">
          <h1 className="card-title text-primary">Bienvenue chez Location Auto</h1>
          <p className="card-text text-secondary lead">
            Louez une voiture facilement et rapidement à des prix compétitifs. Choisissez parmi une large gamme de véhicules adaptés à tous vos besoins.
          </p>
        </div>

        <ul className="list-group list-group-flush">
          <li className="list-group-item">🚗 Véhicules modernes et bien entretenus</li>
          <li className="list-group-item">📆 Réservation flexible en ligne</li>
          <li className="list-group-item">📍 Agences disponibles dans plusieurs villes</li>
          <li className="list-group-item">🕑 Service client 24h/24 et 7j/7</li>
        </ul>

        <div className="card-body text-center">
          <button className="btn btn-success mt-3">Réserver maintenant</button>
        </div>
      </div>
    </div>
  );
}
