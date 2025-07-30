import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { FiSearch, FiFilter, FiArrowUp, FiArrowDown, FiStar } from "react-icons/fi";
import CarCard from "../../components/CarCard";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    sort: "none",
  });

  useEffect(() => {
    axios.get("http://localhost:3000/api/cars").then((response) => {
      setCars(response.data);
      setFilteredCars(response.data);
    });
  }, []);

  useEffect(() => {
    let tempCars = [...cars];

    if (filters.search.trim() !== "") {
      tempCars = tempCars.filter(
        (car) =>
          car.make.toLowerCase().includes(filters.search.toLowerCase()) ||
          car.model.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status !== "all") {
      tempCars = tempCars.filter((car) => car.status === filters.status);
    }

    if (filters.sort === "priceAsc") {
      tempCars.sort((a, b) => a.price_per_day - b.price_per_day);
    } else if (filters.sort === "priceDesc") {
      tempCars.sort((a, b) => b.price_per_day - a.price_per_day);
    } else if (filters.sort === "ratingDesc") {
      tempCars.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
    }

    setFilteredCars(tempCars);
  }, [cars, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="container py-4">
      {/* شريط الفلترة المحسن */}
      <div className="filter-bar">
        <div className="row g-3 align-items-end">
          {/* زر الإضافة للمشرف */}
          {user?.role === "admin" && (
            <div className="col-md-2">
              <NavLink to="/add-car" className="btn btn-success w-100">
                + Ajouter
              </NavLink>
            </div>
          )}

          {/* حقل البحث */}
          <div className="col-md-3">
            <label className="filter-label">Recherche</label>
            <div className="input-group">
              <span className="input-group-text">
                <FiSearch />
              </span>
              <input
                type="text"
                placeholder="Marque ou modèle"
                className="form-control filter-input"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
          </div>

          {/* فلترة الحالة */}
          <div className="col-md-3">
            <label className="filter-label">Disponibilité</label>
            <div className="input-group">
              <span className="input-group-text">
                <FiFilter />
              </span>
              <select
                className="form-select filter-input filter-select"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="all">Toutes les voitures</option>
                <option value="disponible">Disponibles</option>
                <option value="indisponible">Indisponibles</option>
              </select>
            </div>
          </div>

          {/* فرز النتائج */}
          <div className="col-md-3">
            <label className="filter-label">Trier par</label>
            <div className="input-group">
              <span className="input-group-text">
                {filters.sort.includes("price") ? (
                  filters.sort === "priceAsc" ? (
                    <FiArrowUp />
                  ) : (
                    <FiArrowDown />
                  )
                ) : filters.sort === "ratingDesc" ? (
                  <FiStar />
                ) : null}
              </span>
              <select
                className="form-select filter-input filter-select"
                value={filters.sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
              >
                <option value="none">Non trié</option>
                <option value="priceAsc">Prix croissant</option>
                <option value="priceDesc">Prix décroissant</option>
                <option value="ratingDesc">Meilleures notes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* نتائج البحث */}
      {filteredCars.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">Aucune voiture trouvée</h4>
          <p className="text-muted">Essayez de modifier vos critères de recherche</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredCars.map((car) => (
            <div key={car.car_id} className="col-lg-4 col-md-6">
              <div className="car-card-animation h-100">
                <CarCard car={car} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}