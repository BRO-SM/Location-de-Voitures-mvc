import AddCar from "../pages/cars/Addcar";
import UpdateCar from "../pages/cars/UpdateCar";
import { NavLink, Route, Routes } from "react-router-dom";


export default function Admin() {
    return (
        <div>
            <NavLink to="/add-car" className="btn btn-outline-success justify-content-center ">
                <button className="btn btn-outline-success">Ajouter voiture</button>
            </NavLink>
            <Routes>
                <Route path="/add-car" element={<AddCar />} />
                <Route path="/updateCar/:id" element={<UpdateCar />} />
            </Routes>

        </div>
    );
}