// routes.jsx
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Cars from "./pages/cars/Cars";
import CarDetails from "./pages/cars/CarDetails";
import Addcar from "./pages/cars/Addcar";
import UpdateCar from "./pages/cars/UpdateCar";
import Addcarimg from "./pages/cars/Addcarimg";

import Contact from "./pages/Contact";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";

import CreateRental from "./pages/rentals/CreateRental";
import MyBookings from "./pages/rentals/My-bookings";
import AddReview from "./pages/rentals/addreview";
import Reservations from "./pages/rentals/Reservations";

import Clients from "./pages/users/Clients";
import MyProfile from "./pages/users/My-profile";
import UpdateClientsInfo from "./pages/users/UpdateClientsInfo";
import ClientMessages from "./pages/users/Client_messages";

import Dashboard from "./components/dashboard";
import ProtectedRoute from "./context/ProtectedRoute";



const RoutesConfig  = () => {
  return (
    <Routes>
        {/* ✅ Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/carDetails/:id" element={<CarDetails />} />
        <Route path="/contact" element={<Contact />} />

        {/* ✅ Client */}
        <Route path="/rental/create/:car_id" element={<ProtectedRoute roles={["client"]} element={<CreateRental />} />} />
        <Route path="/my-bookings" element={<ProtectedRoute roles={["client"]} element={<MyBookings />} />} />
        <Route path="/addreview/:rentalId" element={<ProtectedRoute roles={["client"]} element={<AddReview />} />} />
        <Route path="/my-profile" element={<ProtectedRoute roles={["client"]} element={<MyProfile />} />} />
        <Route path="/client_messages" element={<ProtectedRoute roles={["client"]} element={<ClientMessages />} />} />

        {/* ✅ Admin */}
        <Route path="/dashboard" element={<ProtectedRoute roles={["admin"]} element={<Dashboard />} />} />
        <Route path="/add-car" element={<ProtectedRoute roles={["admin"]} element={<Addcar />} />} />
        <Route path="/UpdateCar/:id" element={<ProtectedRoute roles={["admin"]} element={<UpdateCar />} />} />
        <Route path="/admin/add-car/image/:id" element={<ProtectedRoute roles={["admin"]} element={<Addcarimg />} />} />
        <Route path="/reservations" element={<ProtectedRoute roles={["admin"]} element={<Reservations />} />} />
        <Route path="/clients" element={<ProtectedRoute roles={["admin"]} element={<Clients />} />} />
        <Route path="/users/clients/:id" element={<ProtectedRoute roles={["admin", "client"]} element={<UpdateClientsInfo />} />} />

        {/* 404 */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
  );
};

export default RoutesConfig;