import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import NavBar from "./pages/NavBar";
import Addcar from "./pages/cars/Addcar";
import CarDetails from "./pages/cars/CarDetails";
import UpdateCar from "./pages/cars/UpdateCar";
import Cars from "./pages/cars/Cars";
import Footer from "./pages/Footer";
import Contact from "./pages/Contact";
import LoginForm from "./components/Auth/LoginForm";
import Dashboard from "./components/dashboard";
import Addcarimg from "./pages/cars/Addcarimg";
import RegisterForm from "./components/Auth/RegisterForm";
import CreateRental from "./pages/rentals/CreateRental";
import MyBookings from "./pages/rentals/My-bookings";




function App() {
  

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/add-car" element={<Addcar />} />
        <Route path="/carDetails/:id" element={<CarDetails />} />
        <Route path="/updateCar/:id" element={<UpdateCar />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/add-car/image/:id" element={<Addcarimg />} />
        <Route path="/rental/create/:car_id" element={<CreateRental />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="*" element={<h1>404 Not Found</h1>} /> Route
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
