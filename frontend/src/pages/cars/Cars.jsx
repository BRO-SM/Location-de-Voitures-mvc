import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

import CarCard from "../../components/CarCard";


export default function Cars() {
  const [cars, setCars] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    axios.get("http://localhost:3000/api/cars").then((response) => {
      setCars(response.data);
    });
  }, []);
  console.log(cars);

  return (
    <div className="container">
      <div className="container-fluid text-sm-center">
        {user?.role === "admin" && (
        <div className="container-fluid text-sm-center mb-4">
          <NavLink to="/add-car" className="btn btn-outline-success">
            <button className="btn btn-outline-success">Add Car</button>
          </NavLink>
        </div>
      )}
      </div>

      <div className="container mt-5 mb-5">
        <h1 className="text-center text-primary mb-4">notre auto</h1>
        <div className="row justify-content-center">
          {cars.map((car) => (
            <CarCard key={car.car_id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
}
