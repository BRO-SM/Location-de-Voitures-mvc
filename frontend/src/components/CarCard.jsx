import React from "react";
import { Link } from "react-router-dom";
import { StarFill } from "react-bootstrap-icons"; // npm i react-bootstrap-icons

const CarCard = ({ car }) => {
  const mainImage =
    car.images?.find((img) => img.is_primary) || car.images?.[0];

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm border-0">
        {/* Image */}
        <div className="position-relative">
          <img
            src={
              mainImage?.img_url
                ? `http://localhost:3000/uploads/cars/${mainImage.img_url}`
                : "https://via.placeholder.com/400x250"
            }
            alt={`${car.make} ${car.model}`}
            className="card-img-top"
            style={{ height: "200px", objectFit: "cover" }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x250";
              e.target.onerror = null;
            }}
          />
          {/* Badge disponibilité */}
          <span
            className={`badge position-absolute top-0 start-0 m-2 ${
              car.status === "disponible" ? "bg-success" : "bg-danger"
            }`}
          >
            {car.status}
          </span>
          {/* Prix */}
          <span className="badge bg-light text-primary position-absolute bottom-0 end-0 m-2 fw-bold">
            {car.price_per_day} MAD / jour
          </span>
        </div>

        {/* Détails */}
        <div className="card-body">
          <h5 className="card-title text-dark">
            {car.make} {car.model} - {car.year}
          </h5>

          {/* Évaluation */}
          <div className="mb-2 text-warning">
            {[...Array(5)].map((_, i) => (
              <StarFill key={i} className="me-1" />
            ))}
          </div>

          <ul className="list-unstyled small text-muted mb-3">
            <li>
              <strong>Transmission :</strong> {car.transmission}
            </li>
            <li>
              <strong>Places :</strong> {car.seats}
            </li>
            <li>
              <strong>Carburant :</strong> {car.fuel || "Non spécifié"}
            </li>
            <li>
              <strong>Couleur :</strong> {car.color || "Non spécifié"}
            </li>
          </ul>

          <Link
            to={`/carDetails/${car.car_id}`}
            className="btn btn-outline-secondary w-100 m-1"
          >
            voir plus
          </Link>
          <Link
            to={`/rental/create/${car.car_id}`}
            className="btn btn-primary w-100 mt-1"
          >
            Réserver maintenant
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
