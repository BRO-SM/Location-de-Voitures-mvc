import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

import CarCard from "../../components/CarCard";
import "../../components/CarCard.css";

export default function Cars() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/cars").then((response) => {
      setCars(response.data);
    });
  }, []);
  console.log(cars);

  return (
    <div className="container">
      <div className="container-fluid text-sm-center">
        <NavLink to="/add-car" className="btn btn-outline-success">
          <button className="btn btn-outline-success">Add Car</button>
        </NavLink>
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
