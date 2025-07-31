import React, { useEffect, useState } from "react";
import { useParams, Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import {
  Star,
  Users,
  Zap,
  Calendar,
  MapPin,
  ArrowLeft,
  Heart,
  Fuel,
  Trash2,
  Edit2,
} from "lucide-react";
import axios from "axios";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/cars/${id}`
        );
        setCar(response.data.car);
        setReviews(response.data.reviews || []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer la voiture ${car.make} ${car.model} ?`
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/api/cars/${car.car_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("🚗 Voiture supprimée avec succès");
        navigate("/cars");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("❌ Erreur lors de la suppression de la voiture");
      }
    }
  };

  if (loading)
    return <div className="text-center py-20 text-gray-500">Chargement...</div>;

  if (!car)
    return (
      <div className="text-center py-20 text-red-500">Voiture introuvable</div>
    );

  return (
    <div className="container py-5">
      <Link
        to="/cars"
        className="text-blue-600 flex items-center mb-4 hover:underline"
      >
        <ArrowLeft className="me-1" /> Retour à la liste
      </Link>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="border rounded shadow-sm overflow-hidden position-relative">
            <img
              src={`http://localhost:3000/uploads/cars/${car.images?.[currentImageIndex]?.img_url}`}
              alt="car"
              className="w-100"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
            <button
              onClick={toggleFavorite}
              className={`position-absolute top-0 end-0 m-2 btn btn-sm rounded-circle ${
                isFavorite ? "btn-danger" : "btn-light"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
              />
            </button>
          </div>

          <div className="d-flex mt-2 gap-2 overflow-auto">
            {car.images?.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:3000/uploads/cars/${img.img_url}`}
                alt="miniature"
                onClick={() => setCurrentImageIndex(index)}
                className={`rounded border ${
                  currentImageIndex === index
                    ? "border-primary"
                    : "border-light"
                }`}
                style={{
                  width: "80px",
                  height: "60px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>

        <div className="col-md-6">
          <h2 className="fw-bold">
            {car.make} {car.model}{" "}
            <span className="text-muted">({car.year})</span>
          </h2>
          <p className="text-muted">{car.description}</p>

          <div className="my-3 d-flex gap-3 flex-wrap text-secondary">
            <span>
              <Zap className="me-1" size={16} /> {car.transmission}
            </span>
            <span>
              <Users className="me-1" size={16} /> {car.seats} sièges
            </span>
            <span>
              <Fuel className="me-1" size={16} /> {car.fuel}
            </span>
            {car.location && (
              <span>
                <MapPin className="me-1" size={16} /> {car.location}
              </span>
            )}
            <span>
              <Calendar className="me-1" size={16} />
              <span
                className={`badge ${
                  car.status === "disponible"
                    ? "bg-success"
                    : car.status === "reserve"
                    ? "bg-info text-dark"
                    : car.status === "en maintenance"
                    ? "bg-warning text-dark"
                    : "bg-danger"
                }`}
              >
                {car.status === "disponible"
                  ? "Disponible"
                  : car.status === "reserve"
                  ? "Réservée"
                  : car.status === "en maintenance"
                  ? "En maintenance"
                  : "Indisponible"}
              </span>
            </span>
          </div>

          {/* Show rental dates if reserved or unavailable */}
          {(car.status === "reserve" || car.status === "indisponible") &&
            car.currentRental && (
              <div className="mt-2 text-muted">
                {car.status === "reserve" ? (
                  <>
                    <strong>Période de réservation:</strong>
                    <br />
                    {new Date(
                      car.currentRental.start_date
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(car.currentRental.end_date).toLocaleDateString()}
                  </>
                ) : (
                  <>
                    <strong>Indisponible jusqu'au:</strong>
                    <br />
                    {new Date(car.currentRental.end_date).toLocaleDateString()}
                  </>
                )}
              </div>
            )}

          <h4 className="text-primary">{car.price_per_day} MAD / jour</h4>

          {isAuthenticated && (
            <>
              {user?.role === "client" && (
                <>
                  <button
                    className={`btn btn-${
                      car.status === "disponible" || car.status === "reserve"
                        ? "primary"
                        : "secondary"
                    } w-100 mt-3`}
                    onClick={() => navigate(`/rental/create/${car.car_id}`)}
                    disabled={
                      car.status !== "disponible" && car.status !== "reserve"
                    }
                  >
                    {car.status === "disponible" || car.status === "reserve"
                      ? "Réserver maintenant"
                      : "Indisponible"}
                  </button>

                  <button
                    className="btn btn-info w-100 mt-3 d-flex align-items-center justify-content-center"
                    onClick={() => navigate(`/addreview/${car.car_id}`)}
                  >
                    Ajouter une critique
                  </button>
                </>
              )}

              {user?.role === "admin" && (
                <>
                  <NavLink
                    to={`/UpdateCar/${car.car_id}`}
                    className="btn btn-warning w-100 mt-3 d-flex align-items-center justify-content-center"
                  >
                    <ArrowLeft className="me-2" size={16} />
                    Modifier la voiture
                  </NavLink>

                  <NavLink
                    to={`/admin/add-car/image/${car.car_id}`}
                    className="btn btn-info w-100 mt-3 d-flex align-items-center justify-content-center"
                  >
                    <Edit2 className="me-2" size={16} />
                    Modifier les images
                  </NavLink>

                  <button
                    onClick={handleDelete}
                    className="btn btn-danger w-100 mt-3"
                  >
                    <Trash2 className="me-2" size={16} />
                    Supprimer la voiture
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Customer reviews */}
      <div className="mt-5">
        <h4 className="mb-3">Avis des clients</h4>
        {reviews.length === 0 ? (
          <p className="text-muted">Aucun avis pour cette voiture.</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="border-bottom pb-3 mb-3">
              <strong>{rev.userName}</strong> -{" "}
              <small className="text-muted">{rev.date}</small>
              <div className="text-warning">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`me-1 ${
                      i < rev.rating ? "text-warning" : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="mb-0">{rev.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CarDetails;
