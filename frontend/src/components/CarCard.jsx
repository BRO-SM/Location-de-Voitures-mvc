import { Link, useNavigate } from "react-router-dom";
import { StarFill } from "react-bootstrap-icons";
import { useAuth } from "../context/useAuth";

const CarCard = ({ car }) => {
  const mainImage =
    car.images?.find((img) => img.is_primary) || car.images?.[0];
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleReservationClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate(`/rental/create/${car.car_id}`);
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0">
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
        <span
          className={`badge position-absolute top-0 start-0 m-2 ${
            car.status === "disponible" ? "bg-success" : "bg-danger"
          }`}
        >
          {car.status}
        </span>
        <span className="badge bg-light text-primary position-absolute bottom-0 end-0 m-2 fw-bold">
          {car.price_per_day} MAD / jour
        </span>
      </div>

      <div className="card-body">
        <h5 className="card-title text-dark">
          {car.make} {car.model} - {car.year}
        </h5>

        <div className="mb-2 text-warning">
          {[...Array(5)].map((_, i) => (
            <StarFill
              key={i}
              className={`me-1 ${
                i < Math.round(car.avg_rating || 0) ? "" : "text-muted"
              }`}
            />
          ))}
          <span className="ms-2 text-dark small">
            {car.avg_rating ? `${car.avg_rating}/5` : "Pas encore notée"}
          </span>
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
          className="btn btn-secondary w-100 m-1"
        >
          voir plus
        </Link>

        <button
          onClick={handleReservationClick}
          className="btn btn-primary w-100 mt-1"
        >
          Réserver maintenant
        </button>

        {isAuthenticated && user?.role === "admin" && (
          <Link
            to={`/UpdateCar/${car.car_id}`}
            className="btn btn-secondary w-100 mt-2"
          >
            Modifier
          </Link>
        )}
      </div>
    </div>
  );
};

export default CarCard;
