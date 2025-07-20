
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faGasPump,
  faCar,
  faCog,
  faCalendarAlt,
  faCarSide,
  faPalette,
  faIdCard
} from "@fortawesome/free-solid-svg-icons";

const CarCard = ({ car }) => {
  const mainImage = car.images?.find((img) => img.is_primary) || car.images?.[0];

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm">
        {/* Image de la voiture */}
        <div className="card-img-top position-relative overflow-hidden" style={{ height: "200px" }}>
          <img
            src={mainImage?.img_url || "https://via.placeholder.com/300x200"}
            className="w-100 h-100 object-fit-cover"
            alt={`${car.make} ${car.model}`}
          />
          <span className={`position-absolute top-0 start-0 m-2 badge ${car.status === "disponible" ? "bg-success" : "bg-danger"}`}>
            {car.status }
          </span>
        </div>

        {/* Corps de la carte */}
        <div className="card-body">
          {/* Titre et prix */}
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h5 className="card-title mb-0">
              {car.make} {car.model} {car.year}
            </h5>
            <div className="text-primary fw-bold">
              {car.price_per_day} DH/jour
            </div>
          </div>

          {/* Évaluation */}
          <div className="mb-3 text-warning">
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
          </div>

          {/* Spécifications de la voiture */}
          <div className="row g-2 mb-3">
            <div className="col-6">
              <div className="d-flex align-items-center text-muted">
                <FontAwesomeIcon icon={faCar} className="me-2" />
                <small>{car.seats} places</small>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex align-items-center text-muted">
                <FontAwesomeIcon icon={faCog} className="me-2" />
                <small>{car.transmission === "automatic" ? "Automatique" : "Manuelle"}</small>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex align-items-center text-muted">
                <FontAwesomeIcon icon={faGasPump} className="me-2" />
                <small>Essence</small>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex align-items-center text-muted">
                <FontAwesomeIcon icon={faCarSide} className="me-2" />
                <small>{car.category || "Berline"}</small>
              </div>
            </div>
          </div>

          {/* Détails supplémentaires */}
          <div className="mb-3">
            <div className="d-flex align-items-center text-muted mb-1">
              <FontAwesomeIcon icon={faPalette} className="me-2" />
              <small>Couleur: {car.color || "Non spécifié"}</small>
            </div>
            <div className="d-flex align-items-center text-muted">
              <FontAwesomeIcon icon={faIdCard} className="me-2" />
              <small>Plaque: {car.license_plate || "Non spécifié"}</small>
            </div>
          </div>

          {/* Bouton de réservation */}
          <button className="btn btn-primary w-100">
            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
            Réserver maintenant
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;