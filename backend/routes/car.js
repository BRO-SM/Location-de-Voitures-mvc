const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");
const authenticate = require("../middleware/auth");

// Ajouter une voiture
router.post("/add", authenticate, carController.addCar);

// Obtenir toutes les voitures
router.get("/", carController.getAllCars);

// Modifier une voiture
router.put("/:id", authenticate, carController.updateCar);

// Supprimer une voiture
router.delete("/:id", authenticate, carController.deleteCar);

module.exports = router;
