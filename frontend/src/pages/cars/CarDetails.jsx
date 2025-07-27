import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Users, Zap, Calendar, MapPin, ArrowLeft, Heart, Fuel } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/cars/${id}`);
        setCar(response.data.car);
        setReviews(response.data.reviews || []);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCarDetails();
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBooking = () => {
    navigate(`/ranterCar/${car.car_id}`);
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">Chargement...</div>
    );
  }

  if (!car) {
    return (
      <div className="text-center py-20 text-red-500">Voiture introuvable</div>
    );
  }

  return (
    <div className="container py-5">
      {/* Retour */}
      <Link to="/cars" className="text-blue-600 flex items-center mb-4 hover:underline">
        <ArrowLeft className="me-1" /> Retour à la liste
      </Link>

      <div className="row">
        {/* Galerie d'images */}
        <div className="col-md-6 mb-4">
          <div className="border rounded shadow-sm overflow-hidden position-relative">
            <img
              src={`http://localhost:3000/uploads/cars/${car.images?.[currentImageIndex]?.img_url}`}
              alt="voiture"
              className="w-100"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
            <button
              onClick={toggleFavorite}
              className={`position-absolute top-0 end-0 m-2 btn btn-sm rounded-circle ${
                isFavorite ? "btn-danger" : "btn-light"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Miniatures */}
          <div className="d-flex mt-2 gap-2 overflow-auto">
            {car.images?.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:3000/uploads/cars/${img.img_url}`}
                alt="mini"
                onClick={() => setCurrentImageIndex(index)}
                className={`rounded border ${currentImageIndex === index ? "border-primary" : "border-light"}`}
                style={{ width: "80px", height: "60px", objectFit: "cover", cursor: "pointer" }}
              />
            ))}
          </div>
        </div>

        {/* Infos voiture */}
        <div className="col-md-6">
          <h2 className="fw-bold">
            {car.make} {car.model} <span className="text-muted">({car.year})</span>
          </h2>
          <p className="text-muted">{car.description}</p>

          <div className="my-3 d-flex gap-3 flex-wrap text-secondary">
            <span><Zap className="me-1" size={16} /> {car.transmission}</span>
            <span><Users className="me-1" size={16} /> {car.seats} places</span>
            <span><Fuel className="me-1" size={16} /> {car.fuel}</span>
            <span><MapPin className="me-1" size={16} /> {car.location}</span>
            <span>
              <Calendar className="me-1" size={16} />{" "}
              <span className={`badge ${car.status === "disponible" ? "bg-success" : "bg-danger"}`}>
                {car.status}
              </span>
            </span>
          </div>

          <h4 className="text-primary">{car.price_per_day} MAD / jour</h4>

          <button
            className={`btn btn-${car.status === "disponible" ? "primary" : "secondary"} w-100 mt-3`}
            onClick={handleBooking}
            disabled={car.status !== "disponible"}
          >
            {car.status === "disponible" ? "Réserver Maintenant" : "Indisponible"}
          </button>
        </div>
      </div>

      {/* Avis clients */}
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
                    className={`me-1 ${i < rev.rating ? "text-warning" : "text-muted"}`}
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
