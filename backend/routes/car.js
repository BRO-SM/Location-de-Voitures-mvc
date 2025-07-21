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

router.post('/addimg/:id', authenticate, upload.single('image'), carController.adimgcar);

// Supprimer une voiture
router.delete("/:id", authenticate, carController.deleteCar);

module.exports = router;
